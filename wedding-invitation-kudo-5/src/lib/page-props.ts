import type { Metadata } from "next";
import { coupleLabel, type InvitationContent } from "@/shared/contract";
import { normalizeGuestName, verifyGuestName } from "@/shared/guest-token";

type Param = string | string[] | undefined;

export type SearchParams = Promise<{ untuk?: Param; to?: Param; k?: Param; preview?: Param }>;

/** Kode tautan tamu dari admin, mis. "pak-budi-keluarga-k7q2" (lihat admin migrasi 003). */
const GUEST_CODE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const GUEST_CODE_MAX = 64;

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

/** ?untuk=… yang formatnya sah — selain itu undefined (tidak pernah dikirim ke database). */
export function guestCodeFrom(untuk: Param): string | undefined {
  const code = first(untuk);
  return code && code.length <= GUEST_CODE_MAX && GUEST_CODE.test(code) ? code : undefined;
}

interface GuestNameInput {
  /** Nama tamu hasil pencarian ?untuk=… di daftar tamu; null bila tidak ada/tidak ditemukan. */
  invitedName: string | null;
  /** true bila tautan membawa ?untuk=… (meski tidak ditemukan). */
  hasCode?: boolean;
  slug: string;
  to?: Param;
  k?: Param;
  fallback: string;
  secret: string | undefined;
}

/**
 * Nama di sampul undangan:
 * 1. ?untuk=<kode> → nama dari daftar tamu admin (kode tak dikenal → sapaan bawaan);
 * 2. tanpa kode → tautan lama ?to=&k= bertanda tangan (verifiedGuestName);
 * 3. selain itu → sapaan bawaan.
 */
export function resolveGuestName({ invitedName, hasCode, slug, to, k, fallback, secret }: GuestNameInput): string {
  if (invitedName) return normalizeGuestName(invitedName) || fallback;
  if (hasCode) return fallback;
  return verifiedGuestName(slug, to, k, fallback, secret);
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
