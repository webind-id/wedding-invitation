"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attempt, failure, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { formToObject, invitationMetaSchema } from "@/lib/forms";
import { insertInvitation } from "@/lib/repo/invitations";
import { getTemplate } from "@/lib/repo/templates";
import { fieldErrors } from "@/shared/contract";
import { sampleContent } from "@/shared/sample";
import { DEFAULT_MESSAGE } from "@/lib/message";
import type { SlugAvailability } from "@/lib/domain";
import { isUuid } from "@/lib/invitee";
import { isSlugReserved, slugAvailability } from "@/lib/public-url";

/** Undangan baru dimulai dari konten contoh, lalu diisi di editor. */
export async function createInvitationAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  let createdId: string | null = null;

  const result = await attempt(async () => {
    const parsed = invitationMetaSchema.safeParse(formToObject(form));
    if (!parsed.success) return failure("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
    if (await isSlugReserved(parsed.data.slug)) return failure("Slug tidak tersedia.", { slug: "Nama ini dipakai sistem dan tidak bisa menjadi alamat undangan" });

    const template = await getTemplate(parsed.data.template_id);
    if (!template) return failure("Template tidak ditemukan.", { template_id: "Template tidak ditemukan" });

    const created = await insertInvitation({
      ...parsed.data,
      content: sampleContent,
      message_template: DEFAULT_MESSAGE,
    });
    if (!created) return failure("Slug sudah dipakai.", { slug: "Slug sudah dipakai undangan lain" });

    createdId = created.id;
    return { ok: true, data: undefined };
  });

  if (!result.ok || !createdId) return result;
  revalidatePath("/undangan");
  redirect(`/undangan/${createdId}`);
}

/** Cek ketersediaan slug/subdomain saat mengetik. excludeId = undangan yang sedang diedit. */
export async function checkSlugAction(slug: string, excludeId?: string): Promise<SlugAvailability | "unknown"> {
  await requireAdmin();
  if (typeof slug !== "string" || slug.length > 100) return "invalid";
  if (excludeId !== undefined && !isUuid(excludeId)) return "invalid";
  try {
    return await slugAvailability(slug.trim().toLowerCase(), excludeId);
  } catch (err) {
    console.error("[slug] cek ketersediaan", err);
    // Pemeriksaan ini hanya bantuan; penyimpanan tetap memeriksa ulang.
    return "unknown";
  }
}
