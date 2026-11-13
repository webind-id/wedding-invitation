import "server-only";
import type { InvitationContent } from "@/shared/contract";
import { clientFormExpiry, newClientFormToken, type ClientFormRow, type ClientGuestRow } from "../client-form";
import { db, dbFail } from "../supabase";

/** Tabel belum ada (migrasi 004 belum dijalankan): Postgres 42P01 / PostgREST PGRST205. */
const MISSING_TABLE = new Set(["42P01", "PGRST205"]);

export type ClientFormLookup = { ready: false } | { ready: true; form: ClientFormRow | null };

/** Tautan formulir yang sedang berlaku (belum dicabut) untuk satu undangan. */
export async function activeClientForm(invitationId: string): Promise<ClientFormLookup> {
  const { data, error } = await db()
    .from("client_forms")
    .select("*")
    .eq("invitation_id", invitationId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && MISSING_TABLE.has(error.code)) return { ready: false };
  if (error) dbFail("memuat formulir klien", error);
  return { ready: true, form: (data as ClientFormRow | null) ?? null };
}

/** Cabut tautan lama (bila ada) lalu buat tautan baru. */
export async function createClientForm(invitationId: string): Promise<ClientFormRow> {
  await revokeClientForms(invitationId);
  const { data, error } = await db()
    .from("client_forms")
    .insert({ invitation_id: invitationId, token: newClientFormToken(), expires_at: clientFormExpiry() })
    .select("*")
    .single();
  if (error) dbFail("membuat formulir klien", error);
  return data as ClientFormRow;
}

export async function revokeClientForms(invitationId: string): Promise<void> {
  const { error } = await db()
    .from("client_forms")
    .update({ revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("invitation_id", invitationId)
    .is("revoked_at", null);
  if (error && !MISSING_TABLE.has(error.code)) dbFail("mencabut formulir klien", error);
}

export interface ClientFormWithInvitation extends ClientFormRow {
  invitation: { id: string; title: string; slug: string; content: InvitationContent };
}

/** Formulir + undangannya dari token di tautan publik. null bila token tidak dikenal. */
export async function clientFormByToken(token: string): Promise<ClientFormWithInvitation | null> {
  const { data, error } = await db()
    .from("client_forms")
    .select("*, invitation:invitations!inner(id, title, slug, content)")
    .eq("token", token)
    .maybeSingle();
  if (error && MISSING_TABLE.has(error.code)) return null;
  if (error) dbFail("memuat formulir klien", error);
  return data as unknown as ClientFormWithInvitation | null;
}

/** Simpan draf klien (tanpa validasi ketat). Hanya formulir yang masih berlaku yang bisa diubah. */
export async function saveClientDraft(id: string, draft: Record<string, unknown>, guests: ClientGuestRow[]): Promise<boolean> {
  const { data, error } = await db()
    .from("client_forms")
    .update({ draft, guests, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("revoked_at", null)
    .neq("status", "imported")
    .select("id");
  if (error) dbFail("menyimpan draf formulir", error);
  return (data ?? []).length > 0;
}

/** Kiriman final klien (sudah lolos kontrak) — menunggu ditinjau admin. */
export async function submitClientForm(id: string, content: InvitationContent, guests: ClientGuestRow[]): Promise<boolean> {
  const now = new Date().toISOString();
  const { data, error } = await db()
    .from("client_forms")
    .update({ draft: content, guests, status: "submitted", submitted_at: now, updated_at: now })
    .eq("id", id)
    .is("revoked_at", null)
    .neq("status", "imported")
    .select("id");
  if (error) dbFail("mengirim formulir", error);
  return (data ?? []).length > 0;
}

export async function markClientFormImported(id: string): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await db().from("client_forms").update({ status: "imported", imported_at: now, updated_at: now }).eq("id", id);
  if (error) dbFail("menandai formulir sudah diimpor", error);
}
