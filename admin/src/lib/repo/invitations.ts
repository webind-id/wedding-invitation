import "server-only";
import type { InvitationContent } from "@/shared/contract";
import { sanitizeSearch } from "../search";
import { db, dbFail } from "../supabase";
import type { TemplateRow } from "./templates";

export type InvitationStatus = "draft" | "published";

type TemplateRef = Pick<TemplateRow, "id" | "code" | "name" | "base_url">;

export interface InvitationListItem {
  id: string;
  slug: string;
  title: string;
  status: InvitationStatus;
  updated_at: string;
  template: TemplateRef;
}

export interface InvitationRow extends InvitationListItem {
  template_id: string;
  content: InvitationContent;
  message_template: string;
  published_at: string | null;
  created_at: string;
}

const TEMPLATE_REF = "template:templates!inner(id, code, name, base_url)";

export interface InvitationFilter {
  q?: string;
  templateId?: string;
  status?: InvitationStatus;
}

export async function listInvitations(filter: InvitationFilter = {}, limit = 200): Promise<InvitationListItem[]> {
  let query = db()
    .from("invitations")
    .select(`id, slug, title, status, updated_at, ${TEMPLATE_REF}`)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (filter.templateId) query = query.eq("template_id", filter.templateId);
  if (filter.status) query = query.eq("status", filter.status);
  const q = filter.q ? sanitizeSearch(filter.q) : "";
  if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) dbFail("memuat undangan", error);
  return (data ?? []) as unknown as InvitationListItem[];
}

export async function getInvitation(id: string): Promise<InvitationRow | null> {
  const { data, error } = await db().from("invitations").select(`*, ${TEMPLATE_REF}`).eq("id", id).maybeSingle();
  if (error) dbFail("memuat undangan", error);
  return data as unknown as InvitationRow | null;
}

export interface NewInvitation {
  template_id: string;
  slug: string;
  title: string;
  content: InvitationContent;
  message_template?: string;
}

/** null bila slug sudah dipakai. */
export async function insertInvitation(input: NewInvitation): Promise<{ id: string } | null> {
  const { data, error } = await db().from("invitations").insert(input).select("id").single();
  if (error?.code === "23505") return null;
  if (error) dbFail("membuat undangan", error);
  return data as { id: string };
}

export type InvitationPatch = Partial<
  Pick<InvitationRow, "template_id" | "slug" | "title" | "content" | "status" | "message_template" | "published_at">
>;

/** "conflict" bila slug bentrok, "missing" bila tidak ditemukan. */
export async function updateInvitation(id: string, patch: InvitationPatch): Promise<"ok" | "conflict" | "missing"> {
  const { data, error } = await db().from("invitations").update(patch).eq("id", id).select("id").maybeSingle();
  if (error?.code === "23505") return "conflict";
  if (error) dbFail("menyimpan undangan", error);
  return data ? "ok" : "missing";
}

export async function invitationExists(id: string): Promise<boolean> {
  const { data, error } = await db().from("invitations").select("id").eq("id", id).maybeSingle();
  if (error) dbFail("memuat undangan", error);
  return Boolean(data);
}

/** ID undangan pemilik slug, atau null. */
export async function invitationIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await db().from("invitations").select("id").eq("slug", slug).maybeSingle();
  if (error) dbFail("memeriksa slug", error);
  return (data as { id: string } | null)?.id ?? null;
}

/** Slug dari daftar ini yang sudah dipakai undangan. */
export async function slugsInUse(slugs: string[]): Promise<string[]> {
  if (slugs.length === 0) return [];
  const { data, error } = await db().from("invitations").select("slug").in("slug", slugs);
  if (error) dbFail("memeriksa slug", error);
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}

export async function deleteInvitation(id: string): Promise<void> {
  const { error } = await db().from("invitations").delete().eq("id", id);
  if (error) dbFail("menghapus undangan", error);
}

export interface DashboardStats {
  templates: number;
  invitations: number;
  published: number;
  rsvps: number;
  invitees: number;
  sent: number;
}

export async function dashboardStats(): Promise<DashboardStats> {
  const head = (table: string) => db().from(table).select("id", { count: "exact", head: true });
  const results = await Promise.all([
    head("templates"),
    head("invitations"),
    head("invitations").eq("status", "published"),
    head("guestbook"),
    head("invitees"),
    head("invitees").eq("is_sent", true),
  ]);
  const failed = results.find((r) => r.error);
  if (failed) dbFail("memuat statistik", failed.error);

  const [templates, invitations, published, rsvps, invitees, sent] = results.map((r) => r.count ?? 0);
  return { templates, invitations, published, rsvps, invitees, sent };
}
