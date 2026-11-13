export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SLUG_MIN = 3;
export const SLUG_MAX = 60;

/** "Cahya & Wahyu — 2027!" → "Cahya-Wahyu-2027" */
export function slugify(value: string, max: number = SLUG_MAX): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
}

export function isValidSlug(value: string, min: number = SLUG_MIN, max: number = SLUG_MAX): boolean {
  return value.length >= min && value.length <= max && SLUG_PATTERN.test(value);
}

/** URL publik undangan di domain template. Tautan per tamu dibuat lewat lib/guest-link (bertanda tangan). */
export function invitationUrl(baseUrl: string, slug: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${slug}`;
}

// ── Subdomain per undangan (gateway Cloudflare) ─────────────────────────
// Daftar & awalan ini HARUS sama dengan gateway/src/routing.ts.

/** Subdomain sistem yang tidak boleh dipakai sebagai slug. */
export const RESERVED_SUBDOMAINS = ["www", "admin", "ews", "router", "api", "app", "mail", "gateway", "static", "cdn", "assets", "dev", "staging"];
/** Awalan subdomain milik app template, mis. tpl-kudo3.kudostack.com. */
export const RESERVED_PREFIX = "tpl-";

export function isReservedSlug(slug: string, extra: string[] = []): boolean {
  return slug.startsWith(RESERVED_PREFIX) || [...RESERVED_SUBDOMAINS, ...extra].includes(slug);
}

/**
 * URL publik undangan. Dengan pola (mis. "https://{slug}.kudostack.com")
 * hasilnya subdomain per undangan; tanpa pola, kembali ke {domain template}/{slug}.
 * Tautan per tamu dibuat lewat lib/guest-link (bertanda tangan), bukan di sini.
 */
export function publicUrl(pattern: string | null, templateBaseUrl: string, slug: string): string {
  return pattern ? pattern.replace("{slug}", slug).replace(/\/+$/, "") : invitationUrl(templateBaseUrl, slug);
}
