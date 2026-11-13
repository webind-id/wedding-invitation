import { createResolver, type Resolution } from "./resolve";
import { decidePath, matchHost, parseList, rewriteLocation, upstreamHeaders, upstreamUrl } from "./routing";

export interface Env {
  /** Domain induk, mis. "kudostack.com" (lokal: "localhost"). */
  ROOT_DOMAIN: string;
  /** Subdomain tambahan yang dilindungi, dipisah koma. */
  RESERVED_SUBDOMAINS?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  /** Rahasia bersama dengan app template (min. 32 karakter) — untuk meneruskan IP tamu. */
  GATEWAY_SECRET?: string;
  /** Opsional, JSON {"slug": "https://template"} — pengembangan lokal tanpa DB. */
  STATIC_ROUTES?: string;
  /** Opsional, JSON {"admin": "http://admin:3000", "ews": "http://ews:3000", "router": "http://router:3000"}. */
  ORIGIN_ROUTES?: string;
}

export interface Deps {
  /** fetch ke internet (app template & Supabase). */
  fetch: typeof fetch;
  /** Teruskan permintaan asli ke origin DNS-nya (untuk host yang bukan undangan). */
  passthrough: (request: Request) => Promise<Response>;
  resolve: (slug: string) => Promise<Resolution>;
}

function page(status: number, title: string, body: string): Response {
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F7F4EE;color:#1D1C1A;font:16px/1.6 Georgia,serif;text-align:center;padding:24px}h1{font-weight:400;font-style:italic;font-size:2rem;margin:0 0 .5rem}p{color:#6E6A62;max-width:28rem;margin:0 auto}</style></head>
<body><main><h1>${title}</h1><p>${body}</p></main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

/** Dipanggil admin (menu Domain → Uji gateway) untuk memastikan Worker terpasang. */
export const HEALTH_PATH = "/_kudo/health";

async function health(env: Env, deps: Deps): Promise<Response> {
  let database: "ok" | "error" = "ok";
  try {
    await deps.resolve("kudo-health-check");
  } catch (err) {
    console.error("[gateway] health: resolve gagal", err);
    database = "error";
  }
  const body = {
    ok: database === "ok",
    service: "kudo-gateway",
    rootDomain: env.ROOT_DOMAIN,
    database,
    // Hanya "terisi atau tidak" — nilainya tidak pernah dikirim.
    gatewaySecret: (env.GATEWAY_SECRET?.length ?? 0) >= 32,
  };
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*" },
  });
}

const NOT_FOUND = () =>
  page(404, "Undangan tidak ditemukan", "Periksa kembali alamatnya, atau hubungi pengirim undangan.");

export async function handle(request: Request, env: Env, deps: Deps): Promise<Response> {
  const url = new URL(request.url);
  const match = matchHost(url.host, env.ROOT_DOMAIN, parseList(env.RESERVED_SUBDOMAINS));
  if (match.kind === "passthrough") return deps.passthrough(request);

  if (url.pathname === HEALTH_PATH && request.method === "GET") return health(env, deps);

  const decision = decidePath(url.pathname);
  if (decision.kind === "not-found") return NOT_FOUND();

  let target: Resolution;
  try {
    target = await deps.resolve(match.slug);
  } catch (err) {
    console.error("[gateway] resolve gagal", err);
    return page(503, "Sedang ada gangguan", "Undangan belum bisa dimuat. Silakan coba beberapa saat lagi.");
  }
  if (!target) return NOT_FOUND();
  if ("reserved" in target) return deps.passthrough(request);

  const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
  const upstream = new Request(upstreamUrl(target.baseUrl, match.slug, url, decision), {
    method: request.method,
    headers: upstreamHeaders(request.headers, clientIp, env.GATEWAY_SECRET, url.host),
    // Body hanya ada untuk kiriman ucapan (kecil) — dibaca utuh agar portabel di semua runtime.
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  });

  let response: Response;
  try {
    response = await deps.fetch(upstream);
  } catch (err) {
    console.error("[gateway] template tidak terjangkau", err);
    return page(502, "Sedang ada gangguan", "Undangan belum bisa dimuat. Silakan coba beberapa saat lagi.");
  }

  const location = response.headers.get("location");
  if (!location) return response;
  const headers = new Headers(response.headers);
  headers.set("location", rewriteLocation(location, target.baseUrl, url.origin, match.slug));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

/** Rakit dependensi produksi dari env. Resolver dibuat sekali per isolate. */
let cachedResolver: ReturnType<typeof createResolver> | null = null;

export function productionDeps(env: Env): Deps {
  cachedResolver ??= createResolver({
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    staticRoutes: env.STATIC_ROUTES,
  });
  const resolver = cachedResolver;
  return {
    fetch: (input) => fetch(input),
    passthrough: (request) => fetch(request),
    resolve: (slug) => resolver.resolve(slug),
  };
}
