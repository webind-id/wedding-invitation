import type { Metadata } from "next";
import { coupleLabel, type InvitationContent } from "@/shared/contract";
import { normalizeGuestName, verifyGuestName } from "@/shared/guest-token";
import { OG_SIZE, ogText } from "./og-meta";

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

export interface MetadataOptions {
  /** Nama tamu dari tautan pribadi — disapa di deskripsi pratinjau. */
  guestName?: string | null;
  /** Alamat halaman yang dilihat tamu (og:url). */
  pageUrl?: string;
  /** Gambar pratinjau 1200×630 dari /<slug>/og (absolut). Tanpa ini: kartu teks saja. */
  imageUrl?: string;
}

/** Meta halaman & pratinjau tautan (WhatsApp, Telegram, Instagram, X, …). */
export function metadataFor(content: InvitationContent, { guestName = null, pageUrl, imageUrl }: MetadataOptions = {}): Metadata {
  const { title, description } = ogText(content, guestName);
  const couple = coupleLabel(content);
  const images = imageUrl ? [{ url: imageUrl, width: OG_SIZE.width, height: OG_SIZE.height, type: "image/jpeg", alt: `Undangan pernikahan ${couple}` }] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "id_ID", siteName: couple, url: pageUrl, images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images: imageUrl ? [imageUrl] : undefined },
    robots: { index: false, follow: false },
  };
}
