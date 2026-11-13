"use server";

import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { prepareClientSubmission } from "@/lib/client-form";
import { isUuid } from "@/lib/invitee";
import { activeClientForm, createClientForm, markClientFormImported, revokeClientForms } from "@/lib/repo/client-forms";
import { invitationExists, updateInvitation } from "@/lib/repo/invitations";
import { insertInvitees } from "@/lib/repo/invitees";

const MIGRATION = "Jalankan migrasi supabase/migrations/004_client_forms.sql dulu.";

/** Buat tautan formulir klien baru (tautan lama otomatis dicabut). */
export async function createClientFormAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    if (!(await invitationExists(id))) return failure("Undangan tidak ditemukan.");
    if (!(await activeClientForm(id)).ready) return failure(MIGRATION);
    await createClientForm(id);
    revalidatePath(`/undangan/${id}/formulir`);
    return success(undefined);
  });
}

export async function revokeClientFormAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    await revokeClientForms(id);
    revalidatePath(`/undangan/${id}/formulir`);
    return success(undefined);
  });
}

export interface ImportResult {
  guestsAdded: number;
  /** Tamu yang dilewati: tidak valid, ganda di kiriman, atau kontaknya sudah ada di tab Tamu. */
  guestsSkipped: number;
}

/** Pasang kiriman klien ke undangan: konten diganti, daftar tamu (opsional) ditambahkan. */
export async function importClientFormAction(id: string, includeGuests: boolean): Promise<ActionResult<ImportResult>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const lookup = await activeClientForm(id);
    if (!lookup.ready) return failure(MIGRATION);
    const form = lookup.form;
    if (!form || form.status !== "submitted") return failure("Belum ada kiriman klien yang bisa diimpor.");

    // Validasi ulang — data di DB tidak dipercaya begitu saja.
    const prepared = prepareClientSubmission(form.draft, form.guests);
    if (!prepared.ok) return failure("Kiriman klien tidak lolos validasi. Minta klien memperbaiki lalu mengirim ulang.");

    const updated = await updateInvitation(id, { content: prepared.content });
    if (updated === "missing") return failure("Undangan tidak ditemukan.");

    let guestsAdded = 0;
    const offered = prepared.guests.valid.length + prepared.guests.invalid;
    if (includeGuests && prepared.guests.valid.length > 0) {
      guestsAdded = (await insertInvitees(id, prepared.guests.valid)).length;
    }
    await markClientFormImported(form.id);
    revalidatePath(`/undangan/${id}`, "layout");
    return success({ guestsAdded, guestsSkipped: includeGuests ? offered - guestsAdded : 0 });
  });
}
