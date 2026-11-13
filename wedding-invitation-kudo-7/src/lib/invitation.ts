import "server-only";
import { cache } from "react";
import { invitationContentSchema, type InvitationContent } from "@/shared/contract";
import { previewSecret, verifyPreviewToken } from "@/shared/preview-token";
import { db } from "./supabase-server";

export interface LoadedInvitation {
  id: string;
  slug: string;
  content: InvitationContent;
  isPreview: boolean;
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Kode template ini (harus sama dengan kolom templates.code di admin). */
export function templateCode(): string | undefined {
  return process.env.TEMPLATE_CODE?.trim() || undefined;
}

/**
 * Undangan milik template ini berdasarkan slug.
 * Hanya yang `published`, kecuali `preview` berisi token pratinjau valid dari admin.
 */
export const loadInvitation = cache(async (slug: string, preview?: string): Promise<LoadedInvitation | null> => {
  const client = db();
  const code = templateCode();
  if (!client || !code || !SLUG.test(slug) || slug.length > 60) return null;

  const { data, error } = await client
    .from("invitations")
    .select("id, slug, status, content, template:templates!inner(code)")
    .eq("slug", slug)
    .eq("template.code", code)
    .maybeSingle();

  if (error) {
    console.error("[undangan] gagal memuat", error);
    return null;
  }
  if (!data) return null;

  const isPreview = data.status !== "published";
  if (isPreview && !verifyPreviewToken(slug, preview, previewSecret())) return null;

  const parsed = invitationContentSchema.safeParse(data.content);
  if (!parsed.success) {
    console.error(`[undangan] konten "${slug}" tidak sesuai kontrak`, parsed.error.issues.slice(0, 5));
    return null;
  }
  return { id: data.id as string, slug, content: parsed.data, isPreview };
});

/** id undangan terbit untuk menerima RSVP (draft tidak menerima ucapan). */
export async function publishedInvitationId(slug: string): Promise<string | null> {
  const client = db();
  const code = templateCode();
  if (!client || !code || !SLUG.test(slug)) return null;

  const { data, error } = await client
    .from("invitations")
    .select("id, template:templates!inner(code)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("template.code", code)
    .maybeSingle();
  if (error) console.error("[undangan] gagal memuat id", error);
  return (data?.id as string | undefined) ?? null;
}
