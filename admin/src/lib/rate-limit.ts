/**
 * Rate limiter sliding-window sederhana di memori. Cukup sebagai rem ringan
 * untuk form publik; di serverless tiap instance punya hitungannya sendiri,
 * jadi untuk trafik besar ganti dengan penyimpanan bersama (mis. Upstash).
 */
export interface RateLimiter {
  /** true bila permintaan boleh lanjut. */
  check(key: string, now?: number): boolean;
}

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      hits.set(key, [...recent, now]);
      // Cegah Map tumbuh tanpa batas dari IP yang sudah lama diam.
      if (hits.size > 5_000) {
        for (const [k, times] of hits) {
          if (times.every((t) => now - t >= windowMs)) hits.delete(k);
        }
      }
      return true;
    },
  };
}

/**
 * IP klien dari header yang ditulis proxy, bukan oleh klien. Entri pertama
 * X-Forwarded-For bisa dipalsukan bila proxy hanya menambahkan (append), jadi
 * yang dipakai adalah header milik platform atau entri paling kanan.
 */
export function clientIp(headers: Headers): string {
  const trusted = headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip");
  if (trusted) return trusted.split(",")[0].trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",").at(-1)!.trim();
  return "unknown";
}
