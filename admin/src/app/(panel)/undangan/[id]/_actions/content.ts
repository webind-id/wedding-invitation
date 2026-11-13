"use server";

import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { isUuid } from "@/lib/invitee";
import type { MediaKind } from "@/lib/media";
import { invitationExists, updateInvitation } from "@/lib/repo/invitations";
import { uploadMedia } from "@/lib/upload";
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

/** Upload foto/musik ke Supabase Storage (foto otomatis jadi WebP); mengembalikan URL publiknya. */
export async function uploadMediaAction(id: string, form: FormData): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const file = form.get("file");
    const kind: MediaKind = form.get("kind") === "audio" ? "audio" : "image";
    if (!(file instanceof File)) return failure("Pilih file terlebih dahulu.");
    if (!(await invitationExists(id))) return failure("Undangan tidak ditemukan.");

    const result = await uploadMedia(id, file, kind);
    return result.ok ? success({ url: result.url }) : failure(result.error);
  });
}
