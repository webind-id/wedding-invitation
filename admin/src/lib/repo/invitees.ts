import "server-only";
import type { Invitee, InviteeDraft } from "../invitee";
import { db, dbFail } from "../supabase";

export async function listInvitees(invitationId: string): Promise<Invitee[]> {
  const { data, error } = await db()
    .from("invitees")
    .select("*")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: true })
    .limit(5000);
  if (error) dbFail("memuat daftar tamu", error);
  return (data ?? []) as Invitee[];
}

/** Kontak yang sudah ada di undangan ini dilewati (tidak ditimpa). */
export async function insertInvitees(invitationId: string, drafts: InviteeDraft[]): Promise<Invitee[]> {
  if (drafts.length === 0) return [];
  const { data, error } = await db()
    .from("invitees")
    .upsert(
      drafts.map((d) => ({ ...d, invitation_id: invitationId })),
      { onConflict: "invitation_id,channel,contact", ignoreDuplicates: true },
    )
    .select();
  if (error) dbFail("menyimpan tamu", error);
  return (data ?? []) as Invitee[];
}

export async function setInviteeSent(invitationId: string, id: string, isSent: boolean): Promise<Invitee | null> {
  const { data, error } = await db()
    .from("invitees")
    .update({ is_sent: isSent, sent_at: isSent ? new Date().toISOString() : null })
    .eq("invitation_id", invitationId)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) dbFail("memperbarui status tamu", error);
  return data as Invitee | null;
}

export async function deleteInvitee(invitationId: string, id: string): Promise<void> {
  const { error } = await db().from("invitees").delete().eq("invitation_id", invitationId).eq("id", id);
  if (error) dbFail("menghapus tamu", error);
}

export async function clearInvitees(invitationId: string): Promise<void> {
  const { error } = await db().from("invitees").delete().eq("invitation_id", invitationId);
  if (error) dbFail("mengosongkan daftar tamu", error);
}
