/**
 * Kontak tamu untuk panel penyebaran undangan: nomor WhatsApp (format 62…)
 * atau username Instagram. Fungsi murni — aman dipakai di browser & server.
 */

export type Channel = "whatsapp" | "instagram";

export interface ParsedContact {
  channel: Channel;
  value: string;
}

const PHONE_CHARS = /^[+\d\s\-().]+$/;
const IG_USERNAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{1,30}$/;

export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return /^62\d{8,13}$/.test(digits) ? digits : null;
}

export function normalizeInstagram(raw: string): string | null {
  const handle = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
  return IG_USERNAME.test(handle) ? handle : null;
}

/** Tebak jenis kontak dari teks bebas, lalu normalkan. null bila tidak valid. */
export function parseContact(raw: string): ParsedContact | null {
  const text = raw.trim();
  if (!text) return null;
  if (PHONE_CHARS.test(text)) {
    const phone = normalizePhone(text);
    return phone ? { channel: "whatsapp", value: phone } : null;
  }
  const handle = normalizeInstagram(text);
  return handle ? { channel: "instagram", value: handle } : null;
}

export function displayContact(contact: ParsedContact): string {
  return contact.channel === "whatsapp" ? `+${contact.value}` : `@${contact.value}`;
}

export function invitationLink(baseUrl: string, guestName: string): string {
  const base = baseUrl.trim().replace(/\/+$/, "");
  return `${base}/?to=${encodeURIComponent(guestName)}`;
}

export interface TemplateVars {
  nama: string;
  link: string;
  pengundang?: string | null;
}

/** Isi placeholder {nama}, {link}, {pengundang} di template pesan. */
export function fillTemplate(template: string, vars: TemplateVars): string {
  return template
    .replaceAll("{nama}", vars.nama)
    .replaceAll("{link}", vars.link)
    .replaceAll("{pengundang}", vars.pengundang ?? "");
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function instagramDmLink(handle: string): string {
  return `https://ig.me/m/${handle}`;
}
