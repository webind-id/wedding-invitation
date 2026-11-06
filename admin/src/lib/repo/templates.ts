import "server-only";
import { db, dbFail } from "../supabase";

export interface TemplateRow {
  id: string;
  code: string;
  name: string;
  description: string;
  base_url: string;
  preview_image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateWithUsage extends TemplateRow {
  invitation_count: number;
}

export type TemplateInput = Pick<TemplateRow, "code" | "name" | "description" | "base_url" | "preview_image" | "is_active">;

export async function listTemplates(): Promise<TemplateWithUsage[]> {
  const { data, error } = await db()
    .from("templates")
    .select("*, invitations(count)")
    .order("created_at", { ascending: true });
  if (error) dbFail("memuat template", error);

  return (data ?? []).map(({ invitations, ...row }) => ({
    ...(row as TemplateRow),
    invitation_count: (invitations as { count: number }[] | null)?.[0]?.count ?? 0,
  }));
}

export async function getTemplate(id: string): Promise<TemplateRow | null> {
  const { data, error } = await db().from("templates").select("*").eq("id", id).maybeSingle();
  if (error) dbFail("memuat template", error);
  return data as TemplateRow | null;
}

/** Simpan template baru atau perbarui yang ada. Mengembalikan null bila kode sudah dipakai. */
export async function saveTemplate(input: TemplateInput, id?: string): Promise<TemplateRow | null> {
  const query = id ? db().from("templates").update(input).eq("id", id) : db().from("templates").insert(input);
  const { data, error } = await query.select().single();
  if (error?.code === "23505") return null;
  if (error) dbFail("menyimpan template", error);
  return data as TemplateRow;
}

export async function templateUsage(id: string): Promise<{ code: string; count: number } | null> {
  const { data, error } = await db().from("templates").select("code, invitations(count)").eq("id", id).maybeSingle();
  if (error) dbFail("memuat template", error);
  if (!data) return null;
  return { code: data.code as string, count: (data.invitations as { count: number }[] | null)?.[0]?.count ?? 0 };
}

/** Hapus template. false bila masih dipakai undangan (FK restrict). */
export async function deleteTemplate(id: string): Promise<boolean> {
  const { error } = await db().from("templates").delete().eq("id", id);
  if (error?.code === "23503") return false;
  if (error) dbFail("menghapus template", error);
  return true;
}
