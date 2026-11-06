/**
 * Aturan routing gateway — fungsi murni, tanpa API Cloudflare, agar mudah dites.
 *
 *   cahya-wahyu.kudostack.com/            → {template}/cahya-wahyu
 *   cahya-wahyu.kudostack.com/api/ucapan  → {template}/api/ucapan
 *   cahya-wahyu.kudostack.com/_next/...   → {template}/_next/...
 */

/** Sama dengan pola slug di admin (huruf kecil, angka, tanda -; 3–60 karakter). */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Subdomain sistem yang tidak pernah dianggap undangan. */
export const DEFAULT_RESERVED = ["www", "admin", "api", "app", "mail", "gateway", "static", "cdn", "assets", "dev", "staging"];

/** Semua subdomain berawalan ini milik sistem (mis. tpl-kudo3.kudostack.com untuk app template). */
export const RESERVED_PREFIX = "tpl-";

export type HostMatch =
  | { kind: "invitation"; slug: string }
  /** Bukan urusan gateway (apex, subdomain sistem, domain lain) — teruskan apa adanya. */
  | { kind: "passthrough" };

export function parseList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Tentukan apakah host adalah subdomain undangan di bawah rootDomain. */
export function matchHost(host: string, rootDomain: string, reserved: string[] = []): HostMatch {
  const hostname = host.toLowerCase().split(":")[0].replace(/\.$/, "");
  const root = rootDomain.toLowerCase().replace(/^\.+|\.+$/g, "");
  if (!hostname.endsWith(`.${root}`)) return { kind: "passthrough" };

  const sub = hostname.slice(0, -(root.length + 1));
  // Hanya satu tingkat: a.b.kudostack.com bukan undangan.
  if (!sub || sub.includes(".")) return { kind: "passthrough" };
  if (sub.startsWith(RESERVED_PREFIX)) return { kind: "passthrough" };
  if ([...DEFAULT_RESERVED, ...reserved].includes(sub)) return { kind: "passthrough" };
  if (sub.length < 3 || sub.length > 60 || !SLUG.test(sub)) return { kind: "passthrough" };
  return { kind: "invitation", slug: sub };
}

/** Path yang boleh diteruskan ke template. Selain ini → 404 dari gateway. */
const ASSET_PREFIXES = ["/_next/", "/images/", "/audio/", "/videos/", "/fonts/"];
const ASSET_FILES = ["/favicon.ico", "/robots.txt", "/icon.png", "/icon.svg", "/apple-icon.png"];
const API_PATHS = ["/api/ucapan"];

export type PathDecision = { kind: "page" } | { kind: "proxy" } | { kind: "not-found" };

export function decidePath(pathname: string): PathDecision {
  if (pathname === "/" || pathname === "") return { kind: "page" };
  if (pathname.includes("..")) return { kind: "not-found" };
  if (API_PATHS.includes(pathname)) return { kind: "proxy" };
  if (ASSET_FILES.includes(pathname)) return { kind: "proxy" };
  if (ASSET_PREFIXES.some((p) => pathname.startsWith(p))) return { kind: "proxy" };
  return { kind: "not-found" };
}

/** URL tujuan di app template. Query string (?to=, ?preview=, ?slug=) ikut diteruskan. */
export function upstreamUrl(baseUrl: string, slug: string, requestUrl: URL, decision: PathDecision): URL {
  const base = baseUrl.replace(/\/+$/, "");
  const path = decision.kind === "page" ? `/${slug}` : requestUrl.pathname;
  return new URL(`${base}${path}${requestUrl.search}`);
}

/**
 * Header redirect dari template menunjuk ke domain template — ubah agar
 * tetap di subdomain undangan. "/{slug}" dipetakan kembali ke "/".
 */
export function rewriteLocation(location: string, baseUrl: string, publicOrigin: string, slug: string): string {
  let target: URL;
  try {
    target = new URL(location, baseUrl);
  } catch {
    return location;
  }
  const base = new URL(baseUrl);
  if (target.origin !== base.origin) return location;
  const path = target.pathname === `/${slug}` ? "/" : target.pathname;
  return `${publicOrigin}${path}${target.search}${target.hash}`;
}

/** Header yang tidak boleh diteruskan dari klien (hop-by-hop, info proxy, header internal gateway). */
const DROP_HEADERS = ["host", "connection", "keep-alive", "transfer-encoding", "upgrade", "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto", "x-real-ip", "forwarded"];

export function upstreamHeaders(incoming: Headers, clientIp: string, gatewaySecret: string | undefined, publicHost: string): Headers {
  const headers = new Headers();
  incoming.forEach((value, key) => {
    const k = key.toLowerCase();
    if (DROP_HEADERS.includes(k) || k.startsWith("cf-") || k.startsWith("x-kudo-")) return;
    headers.set(key, value);
  });
  headers.set("x-forwarded-host", publicHost);
  headers.set("x-forwarded-proto", "https");
  // IP asli tamu untuk rate limit di template — hanya dipercaya bila rahasianya cocok.
  if (gatewaySecret) {
    headers.set("x-kudo-gateway-secret", gatewaySecret);
    headers.set("x-kudo-client-ip", clientIp);
  }
  return headers;
}
