import { timingSafeEqual } from "node:crypto";

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

const MIN_GATEWAY_SECRET = 32;

/**
 * IP tamu yang diteruskan gateway subdomain (Cloudflare Worker). Lewat
 * gateway semua permintaan datang dari IP Cloudflare, jadi tanpa ini semua
 * tamu berbagi satu jatah rate limit. Header hanya dipercaya bila
 * x-kudo-gateway-secret cocok dengan GATEWAY_SECRET (dibandingkan waktu-konstan).
 */
function gatewayClientIp(headers: Headers): string | null {
  const secret = process.env.GATEWAY_SECRET;
  const given = headers.get("x-kudo-gateway-secret");
  if (!secret || secret.length < MIN_GATEWAY_SECRET || !given) return null;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return headers.get("x-kudo-client-ip")?.trim() || null;
}

/**
 * IP klien dari header yang ditulis proxy, bukan oleh klien. Entri pertama
 * X-Forwarded-For bisa dipalsukan bila proxy hanya menambahkan (append), jadi
 * yang dipakai adalah header gateway bertanda tangan, header milik platform,
 * atau entri paling kanan.
 */
export function clientIp(headers: Headers): string {
  const viaGateway = gatewayClientIp(headers);
  if (viaGateway) return viaGateway;
  const trusted = headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip");
  if (trusted) return trusted.split(",")[0].trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",").at(-1)!.trim();
  return "unknown";
}
