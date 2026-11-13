import { signGuestName } from "@/shared/guest-token";
import type { Invitee } from "./invitee";

/** Tamu beserta tautan pribadinya (dibuat di server). */
export type LinkedInvitee = Invitee & { link: string };

/** Nama parameter tautan tamu: …/?untuk=pak-budi-keluarga-k7q2 */
export const GUEST_PARAM = "untuk";

type Guest = Pick<Invitee, "name" | "code">;

/**
 * Tautan pribadi tamu.
 * - Tamu punya kode (migrasi 003): <alamat undangan>?untuk=<kode> — template mencari namanya di DB.
 * - Belum ada kode: format lama ?to=<nama>&k=<tanda tangan>; `secret` = PREVIEW_SECRET,
 *   jadi fungsi ini hanya boleh dipanggil di server. Tanpa secret, `k` tidak ditambahkan.
 */
export function guestLink(baseLink: string, slug: string, guest: Guest, secret: string | undefined): string {
  // "https://slug.domain" → "https://slug.domain/" agar hasilnya ".../?untuk=…", bukan "...domain?untuk=…".
  const base = /^https?:\/\/[^/?#]+$/.test(baseLink) ? `${baseLink}/` : baseLink;
  const separator = base.includes("?") ? "&" : "?";
  if (guest.code) return `${base}${separator}${GUEST_PARAM}=${guest.code}`;
  const legacy = `${base}${separator}to=${encodeURIComponent(guest.name)}`;
  return secret ? `${legacy}&k=${signGuestName(slug, guest.name, secret)}` : legacy;
}

export function withGuestLinks(invitees: Invitee[], baseLink: string, slug: string, secret: string | undefined): LinkedInvitee[] {
  return invitees.map((invitee) => ({ ...invitee, link: guestLink(baseLink, slug, invitee, secret) }));
}

/** Peringatan untuk tab Tamu bila sebagian tamu belum punya kode tautan; null bila semua beres. */
export function guestLinkNotice(invitees: Guest[], secret: string | undefined): string | null {
  if (!invitees.some((g) => !g.code)) return null;
  const migrate = "Jalankan migrasi supabase/migrations/003_invitee_code.sql agar tautan tamu berbentuk ?untuk=nama-tamu-xxxx.";
  return secret
    ? `${migrate} Sementara itu tautan memakai format lama (?to=…&k=…) yang tetap berfungsi.`
    : `${migrate} PREVIEW_SECRET juga belum diatur, jadi tautan format lama tidak bertanda tangan dan nama tamu tidak akan tampil.`;
}
