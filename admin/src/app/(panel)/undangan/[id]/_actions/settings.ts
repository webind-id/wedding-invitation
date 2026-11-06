"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { formToObject, invitationMetaSchema } from "@/lib/forms";
import { isUuid } from "@/lib/invitee";
import { isSlugReserved } from "@/lib/public-url";
import { deleteInvitation, getInvitation, insertInvitation, updateInvitation } from "@/lib/repo/invitations";
import { getTemplate } from "@/lib/repo/templates";
import { slugify } from "@/lib/slug";
import { db, MEDIA_BUCKET } from "@/lib/supabase";
import { fieldErrors } from "@/shared/contract";

function revalidateInvitation(id: string) {
  revalidatePath("/undangan");
  revalidatePath(`/undangan/${id}`, "layout");
}

export async function updateMetaAction(id: string, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const parsed = invitationMetaSchema.safeParse(formToObject(form));
    if (!parsed.success) return failure("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
    if (await isSlugReserved(parsed.data.slug)) return failure("Slug tidak tersedia.", { slug: "Nama ini dipakai sistem dan tidak bisa menjadi alamat undangan" });
    if (!(await getTemplate(parsed.data.template_id))) return failure("Template tidak ditemukan.");

    const result = await updateInvitation(id, parsed.data);
    if (result === "conflict") return failure("Slug sudah dipakai.", { slug: "Slug sudah dipakai undangan lain" });
    if (result === "missing") return failure("Undangan tidak ditemukan.");
    revalidateInvitation(id);
    return success(undefined);
  });
}

export async function setStatusAction(id: string, publish: boolean): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const result = await updateInvitation(id, {
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
    });
    if (result !== "ok") return failure("Undangan tidak ditemukan.");
    revalidateInvitation(id);
    return success(undefined);
  });
}

/** Salin undangan (konten + template) sebagai draft baru, lalu buka salinannya. */
export async function duplicateAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  let newId: string | null = null;
  const result = await attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const source = await getInvitation(id);
    if (!source) return failure("Undangan tidak ditemukan.");

    const suffix = randomBytes(2).toString("hex");
    const created = await insertInvitation({
      template_id: source.template_id,
      title: `${source.title} (salinan)`.slice(0, 120),
      slug: `${slugify(source.slug, 50)}-${suffix}`,
      content: source.content,
      message_template: source.message_template,
    });
    if (!created) return failure("Gagal membuat slug unik, coba lagi.");
    newId = created.id;
    return success(undefined);
  });
  if (!result.ok || !newId) return result;
  revalidatePath("/undangan");
  redirect(`/undangan/${newId}/pengaturan`);
}

/** Hapus semua file undangan di storage. Gagal di sini hanya dicatat — undangan sudah terhapus. */
async function removeMedia(id: string): Promise<void> {
  const storage = db().storage.from(MEDIA_BUCKET);
  for (;;) {
    const { data, error } = await storage.list(id, { limit: 1000 });
    if (error || !data?.length) {
      if (error) console.error("[storage] gagal membaca", error);
      return;
    }
    const { error: removeError } = await storage.remove(data.map((f) => `${id}/${f.name}`));
    if (removeError) {
      console.error("[storage] gagal menghapus", removeError);
      return;
    }
    if (data.length < 1000) return;
  }
}

export async function deleteInvitationAction(id: string, confirmSlug: string): Promise<ActionResult> {
  await requireAdmin();
  const result = await attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const inv = await getInvitation(id);
    if (!inv) return failure("Undangan tidak ditemukan.");
    if (confirmSlug.trim() !== inv.slug) return failure("Slug konfirmasi tidak cocok.");
    await deleteInvitation(id);
    await removeMedia(id);
    return success(undefined);
  });
  if (!result.ok) return result;
  revalidatePath("/undangan");
  redirect("/undangan");
}
