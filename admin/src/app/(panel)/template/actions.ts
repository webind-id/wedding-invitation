"use server";

import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { formToObject, templateInputSchema } from "@/lib/forms";
import { deleteTemplate, saveTemplate, templateUsage } from "@/lib/repo/templates";
import { fieldErrors } from "@/shared/contract";

const UUID = /^[0-9a-f-]{36}$/i;

export async function saveTemplateAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    const id = String(form.get("id") ?? "");
    if (id && !UUID.test(id)) return failure("ID tidak valid.");

    const parsed = templateInputSchema.safeParse(formToObject(form, ["is_active"]));
    if (!parsed.success) return failure("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));

    if (id) {
      // Template app mencocokkan kode dengan TEMPLATE_CODE — mengganti kode memutus undangan yang sudah ada.
      const usage = await templateUsage(id);
      if (!usage) return failure("Template tidak ditemukan.");
      if (usage.count > 0 && usage.code !== parsed.data.code) {
        return failure("Kode tidak bisa diubah selama template dipakai undangan.", {
          code: `Dipakai ${usage.count} undangan — kode harus tetap "${usage.code}"`,
        });
      }
    }

    const saved = await saveTemplate(parsed.data, id || undefined);
    if (!saved) return failure("Kode template sudah dipakai.", { code: "Kode sudah dipakai template lain" });

    revalidatePath("/template");
    revalidatePath("/undangan", "layout");
    return success(undefined);
  });
}

export async function deleteTemplateAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!UUID.test(id)) return failure("ID tidak valid.");
    const deleted = await deleteTemplate(id);
    if (!deleted) return failure("Template masih dipakai undangan. Pindahkan undangannya ke template lain dulu.");
    revalidatePath("/template");
    return success(undefined);
  });
}
