import { signGuestName } from "@/shared/guest-token";
import type { Invitee } from "./invitee";

/** Tamu beserta tautan pribadinya (sudah ditandatangani di server). */
export type LinkedInvitee = Invitee & { link: string };

/**
 * Tautan pribadi tamu: <alamat undangan>?to=<nama>&k=<tanda tangan>.
 * Hanya boleh dipanggil di server — `secret` adalah PREVIEW_SECRET.
 * Tanpa secret, tautan dibuat tanpa `k` (template akan memakai sapaan bawaan).
 */
export function guestLink(baseLink: string, slug: string, name: string, secret: string | undefined): string {
  const separator = baseLink.includes("?") ? "&" : "?";
  const link = `${baseLink}${separator}to=${encodeURIComponent(name)}`;
  return secret ? `${link}&k=${signGuestName(slug, name, secret)}` : link;
}

export function withGuestLinks(invitees: Invitee[], baseLink: string, slug: string, secret: string | undefined): LinkedInvitee[] {
  return invitees.map((invitee) => ({ ...invitee, link: guestLink(baseLink, slug, invitee.name, secret) }));
}
