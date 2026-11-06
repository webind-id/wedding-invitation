/**
 * Cari alamat app template untuk sebuah slug. Hasil disimpan di memori
 * isolate Worker selama beberapa detik agar tidak query DB tiap permintaan.
 */

export interface ResolverConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  /** JSON {"slug": "https://template..."} — untuk pengembangan lokal tanpa DB. */
  staticRoutes?: string;
}

/**
 * - `{ baseUrl }`     → undangan, teruskan ke app template
 * - `{ reserved }`    → nama dicadangkan dari admin (menu Domain), teruskan ke origin DNS-nya
 * - `null`            → tidak ada undangan dengan slug ini
 */
export type Resolution = { baseUrl: string } | { reserved: true } | null;

const FOUND_TTL_MS = 60_000;
const MISSING_TTL_MS = 20_000;
const MAX_ENTRIES = 2_000;

interface CacheEntry {
  value: Resolution;
  expires: number;
}

export function createResolver(config: ResolverConfig, fetchFn: typeof fetch = fetch) {
  const cache = new Map<string, CacheEntry>();
  let staticMap: Record<string, string> | null = null;
  if (config.staticRoutes) {
    try {
      staticMap = JSON.parse(config.staticRoutes) as Record<string, string>;
    } catch {
      throw new Error("STATIC_ROUTES bukan JSON yang valid.");
    }
  }

  async function lookup(slug: string): Promise<Resolution> {
    if (staticMap) return staticMap[slug] ? { baseUrl: staticMap[slug] } : null;
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY belum diatur di gateway.");
    }
    const res = await fetchFn(`${config.supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/resolve_invitation_host`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_slug: slug }),
    });
    if (!res.ok) throw new Error(`Supabase RPC gagal (${res.status}).`);
    const rows = (await res.json()) as { base_url?: unknown; reserved?: unknown }[];
    if (rows[0]?.reserved === true) return { reserved: true };
    const baseUrl = rows[0]?.base_url;
    return typeof baseUrl === "string" && /^https?:\/\//.test(baseUrl) ? { baseUrl } : null;
  }

  return {
    async resolve(slug: string, now: number = Date.now()): Promise<Resolution> {
      const hit = cache.get(slug);
      if (hit && hit.expires > now) return hit.value;

      const value = await lookup(slug);
      if (cache.size >= MAX_ENTRIES) cache.clear();
      cache.set(slug, { value, expires: now + (value ? FOUND_TTL_MS : MISSING_TTL_MS) });
      return value;
    },
  };
}
