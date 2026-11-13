/**
 * Teks & alamat untuk pratinjau tautan (WhatsApp, Telegram, Instagram, dsb.).
 * Murni (tanpa DB/IO) agar mudah diuji. Gambarnya dibuat oleh src/app/[slug]/og/route.ts.
 */
import { createHash } from "node:crypto";
import { coupleLabel, type InvitationContent } from "@/shared/contract";
import { formatLongDate } from "./datetime";

export const OG_SIZE = { width: 1200, height: 630 } as const;
const DESCRIPTION_MAX = 200;

function clip(text: string, max: number): string {
  const chars = Array.from(text);
  return chars.length <= max ? text : `${chars.slice(0, max - 1).join("").trimEnd()}…`;
}

/** Judul & deskripsi pratinjau; disapa dengan nama bila tautan pribadi (?untuk=…). */
export function ogText(content: InvitationContent, guestName: string | null): { title: string; description: string } {
  const couple = coupleLabel(content);
  const first = content.events[0];
  const title = content.seo.title || `Undangan Pernikahan ${couple}`;
  const when = first ? `${formatLongDate(first.start, content.timeZone)} · ${first.venue}` : "";
  const body = content.seo.description || (guestName ? `Dengan hormat kami mengundang Anda ke pernikahan kami. ${when}` : `Dengan hormat kami mengundang Anda ke pernikahan ${couple}. ${when}`).trim();
  const description = guestName ? `Kepada Yth. ${guestName} — ${body}` : body;
  return { title, description: clip(description, DESCRIPTION_MAX) };
}

/**
 * Versi gambar pratinjau: berubah hanya bila isi gambarnya berubah (nama, tanggal, tempat, foto).
 * Dipasang di URL gambar (?v=…) agar cache WhatsApp/CDN ikut diperbarui.
 */
export function ogVersion(content: InvitationContent): string {
  const first = content.events[0];
  const key = JSON.stringify([content.bride.nickname, content.groom.nickname, content.headlineOrder, first?.start, first?.venue, content.timeZone, content.coverPhoto]);
  return createHash("sha256").update(key).digest("hex").slice(0, 10);
}

/** Origin template ini (dari Host), mis. https://wedding6.kudostack.my.id — tempat gambar /og dilayani. */
export function requestOrigin(headers: Headers): string {
  const host = headers.get("host") ?? "localhost";
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Alamat halaman yang dilihat tamu. Lewat gateway (sudah diverifikasi rahasianya) itu subdomain
 * undangan dari x-forwarded-host; selain itu alamat template langsung. Header dari luar gateway
 * tidak dipercaya.
 */
export function publicPageUrl(headers: Headers, slug: string, isFromGateway: boolean): string {
  const forwardedHost = headers.get("x-forwarded-host");
  if (isFromGateway && forwardedHost) return `https://${forwardedHost}/`;
  return `${requestOrigin(headers)}/${slug}`;
}
