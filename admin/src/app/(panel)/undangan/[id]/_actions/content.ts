"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { isUuid } from "@/lib/invitee";
import { checkMedia, type MediaKind } from "@/lib/media";
import { invitationExists, updateInvitation } from "@/lib/repo/invitations";
import { db, MEDIA_BUCKET } from "@/lib/supabase";
import { fieldErrors, invitationContentSchema } from "@/shared/contract";

export async function saveContentAction(id: string, content: unknown): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const parsed = invitationContentSchema.safeParse(content);
    if (!parsed.success) return failure("Ada isian yang belum benar.", fieldErrors(parsed.error));

    const result = await updateInvitation(id, { content: parsed.data });
    if (result === "missing") return failure("Undangan tidak ditemukan.");
    revalidatePath(`/undangan/${id}`);
    return success(undefined);
  });
}

/** Upload foto/musik ke Supabase Storage; mengembalikan URL publiknya. */
export async function uploadMediaAction(id: string, form: FormData): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const file = form.get("file");
    const kind = form.get("kind") === "audio" ? "audio" : ("image" satisfies MediaKind);
    if (!(file instanceof File)) return failure("Pilih file terlebih dahulu.");
    if (!(await invitationExists(id))) return failure("Undangan tidak ditemukan.");

    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkMedia(file.type, file.size, bytes.subarray(0, 16), kind);
    if (!check.ok) return failure(check.error);

    const path = `${id}/${randomUUID()}.${check.ext}`;
    const storage = db().storage.from(MEDIA_BUCKET);
    const { error } = await storage.upload(path, bytes, {
      contentType: check.mime,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("[upload]", error);
      return failure("Gagal mengunggah file. Pastikan bucket invitation-media sudah dibuat (schema.sql).");
    }
    return success({ url: storage.getPublicUrl(path).data.publicUrl });
  });
}
