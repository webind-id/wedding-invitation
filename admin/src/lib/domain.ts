import { isReservedSlug, isValidSlug } from "./slug";

/**
 * Pengaturan domain undangan (menu "Domain" di admin, tabel domain_settings).
 * Fungsi murni di sini dipakai server & browser; akses DB ada di repo/domain.ts.
 */

export type Scheme = "https" | "http";

export interface DomainSettings {
  /** Aktif → setiap undangan di {slug}.{rootDomain}; nonaktif → {alamat template}/{slug}. */
  enabled: boolean;
  scheme: Scheme;
  /** Domain induk, mis. "kudostack.com" (lokal: "localhost:8787"). */
  rootDomain: string;
  /** Nama tambahan yang tidak boleh jadi slug (di luar daftar bawaan). */
  reserved: string[];
  updatedAt: string | null;
}

export const DEFAULT_DOMAIN: DomainSettings = { enabled: false, scheme: "https", rootDomain: "", reserved: [], updatedAt: null };

const LABEL = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
const ROOT_DOMAIN = new RegExp(String.raw`^${LABEL}(?:\.${LABEL})*(?::\d{2,5})?$`);
const RESERVED_NAME = new RegExp(`^${LABEL}$`);

/** "https://www.KudoStack.com/" → "kudostack.com"; "*.kudostack.com" → "kudostack.com". */
export function normalizeRootDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^\*\./, "")
    .replace(/[/?#].*$/, "")
    .replace(/\.+$/, "");
}

export function isValidRootDomain(value: string): boolean {
  return value.length <= 253 && ROOT_DOMAIN.test(value);
}

/** "blog, promo\nshop" → ["blog", "promo", "shop"] — huruf kecil, tanpa duplikat. */
export function parseReservedList(value: string): string[] {
  return [...new Set(value.split(/[\s,]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

export function isValidReservedName(name: string): boolean {
  return RESERVED_NAME.test(name);
}

/** Nama yang sudah bawaan tidak perlu disimpan lagi. */
export function withoutBuiltIn(names: string[]): string[] {
  return names.filter((n) => !isReservedSlug(n));
}

/** "https://{slug}.kudostack.com", atau null bila subdomain belum aktif. */
export function subdomainPattern(settings: Pick<DomainSettings, "enabled" | "scheme" | "rootDomain">): string | null {
  return settings.enabled && settings.rootDomain ? `${settings.scheme}://{slug}.${settings.rootDomain}` : null;
}

/** Bagian sebelum & sesudah {slug} — untuk menampilkan "https://[slug].kudostack.com" di form. */
export function splitPattern(pattern: string): { prefix: string; suffix: string } {
  const [prefix, suffix = ""] = pattern.split("{slug}");
  return { prefix, suffix };
}

export type SlugAvailability = "available" | "invalid" | "reserved" | "taken";

/** Pemeriksaan tanpa DB; "taken" diputuskan pemanggil yang bisa query. */
export function checkSlugLocally(slug: string, reserved: string[]): Exclude<SlugAvailability, "taken"> {
  if (!isValidSlug(slug)) return "invalid";
  if (isReservedSlug(slug, reserved)) return "reserved";
  return "available";
}
