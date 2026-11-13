import type { Metadata } from "next";
import { coupleLabel, type InvitationContent } from "@/shared/contract";
import { normalizeGuestName, verifyGuestName } from "@/shared/guest-token";

type Param = string | string[] | undefined;

export type SearchParams = Promise<{ to?: Param; k?: Param; preview?: Param }>;

function first(value: Param): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Halaman demo: nama tamu dari ?to=… apa adanya (dirapikan); fallback ke sapaan bawaan. */
export function guestNameFrom(to: Param, fallback: string): string {
  return normalizeGuestName(first(to) ?? "") || fallback;
}

/**
 * Undangan sungguhan: nama dari ?to=… hanya ditampilkan bila ?k=… adalah tanda tangan
 * admin untuk nama & undangan ini (lihat shared/guest-token.ts). Nama yang diketik
 * sendiri, diubah, atau tautan tanpa k → sapaan bawaan.
 */
export function verifiedGuestName(slug: string, to: Param, k: Param, fallback: string, secret: string | undefined): string {
  const name = normalizeGuestName(first(to) ?? "");
  return name && verifyGuestName(slug, name, first(k), secret) ? name : fallback;
}

export function previewFrom(preview: Param): string | undefined {
  return first(preview);
}

export function metadataFor(content: InvitationContent): Metadata {
  const title = content.seo.title || coupleLabel(content);
  const description = content.seo.description || `Undangan pernikahan ${coupleLabel(content)}.`;
  const image = content.coverPhoto.startsWith("https://") ? [content.coverPhoto] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: image },
    robots: { index: false, follow: false },
  };
}
