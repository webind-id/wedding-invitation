"use server";

import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { messageTemplateSchema } from "@/lib/forms";
import { ATTENDANCE_LABEL } from "@/lib/guestbook";
import { isUuid, prepareInvitees, type Invitee } from "@/lib/invitee";
import { allGuestbookEntries, deleteGuestbookEntry } from "@/lib/repo/guestbook";
import { updateInvitation } from "@/lib/repo/invitations";
import { clearInvitees, deleteInvitee, insertInvitees, setInviteeSent } from "@/lib/repo/invitees";

export interface AddResult {
  invitees: Invitee[];
  inserted: number;
  invalid: number;
  duplicate: number;
}

export async function addInviteesAction(id: string, rows: unknown): Promise<ActionResult<AddResult>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const { valid, invalid } = prepareInvitees(rows);
    const inserted = await insertInvitees(id, valid);
    revalidatePath(`/undangan/${id}/tamu`);
    return success({ invitees: inserted, inserted: inserted.length, invalid, duplicate: valid.length - inserted.length });
  });
}

export async function setSentAction(id: string, inviteeId: string, isSent: boolean): Promise<ActionResult<Invitee>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id) || !isUuid(inviteeId)) return failure("ID tidak valid.");
    const updated = await setInviteeSent(id, inviteeId, isSent);
    return updated ? success(updated) : failure("Tamu tidak ditemukan.");
  });
}

export async function deleteInviteeAction(id: string, inviteeId: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id) || !isUuid(inviteeId)) return failure("ID tidak valid.");
    await deleteInvitee(id, inviteeId);
    return success(undefined);
  });
}

export async function clearInviteesAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    await clearInvitees(id);
    revalidatePath(`/undangan/${id}/tamu`);
    return success(undefined);
  });
}

export async function saveMessageAction(id: string, message: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const parsed = messageTemplateSchema.safeParse(message);
    if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Pesan tidak valid.");
    const result = await updateInvitation(id, { message_template: parsed.data });
    return result === "ok" ? success(undefined) : failure("Undangan tidak ditemukan.");
  });
}

export async function deleteEntryAction(id: string, entryId: string): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id) || !isUuid(entryId)) return failure("ID tidak valid.");
    await deleteGuestbookEntry(id, entryId);
    revalidatePath(`/undangan/${id}/ucapan`);
    return success(undefined);
  });
}

export async function exportGuestbookAction(id: string): Promise<ActionResult<string>> {
  await requireAdmin();
  return attempt(async () => {
    if (!isUuid(id)) return failure("ID tidak valid.");
    const entries = await allGuestbookEntries(id);
    const rows = entries.map((e) => [
      e.name,
      ATTENDANCE_LABEL[e.attendance],
      e.attendance === "hadir" ? String(e.party_size) : "",
      e.message ?? "",
      e.created_at,
    ]);
    return success(toCsv(["Nama", "Kehadiran", "Jumlah", "Ucapan", "Waktu"], rows));
  });
}
