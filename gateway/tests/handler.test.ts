import { describe, expect, it, vi } from "vitest";
import { handle, type Deps, type Env } from "../src/handler";
import { createResolver } from "../src/resolve";

const env: Env = { ROOT_DOMAIN: "kudostack.com", GATEWAY_SECRET: "g".repeat(40) };
const TEMPLATE = "https://tpl-kudo3.kudostack.com";

function deps(overrides: Partial<Deps> = {}): Deps & { upstream: Request[] } {
  const upstream: Request[] = [];
  return {
    upstream,
    fetch: vi.fn(async (input: RequestInfo | URL) => {
      upstream.push(input as Request);
      return new Response("<html>undangan</html>", { headers: { "content-type": "text/html" } });
    }) as unknown as typeof fetch,
    passthrough: vi.fn(async () => new Response("origin")),
    resolve: vi.fn(async (slug: string) => (slug === "cahya-wahyu" ? { baseUrl: TEMPLATE } : null)),
    ...overrides,
  };
}

const req = (url: string, init?: RequestInit) =>
  new Request(url, { ...init, headers: { "cf-connecting-ip": "1.2.3.4", ...(init?.headers as Record<string, string>) } });

describe("handle", () => {
  it("serves the invitation page from its template", async () => {
    const d = deps();
    const res = await handle(req("https://cahya-wahyu.kudostack.com/?to=Pak%20Budi"), env, d);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("undangan");
    expect(d.upstream[0].url).toBe(`${TEMPLATE}/cahya-wahyu?to=Pak%20Budi`);
    expect(d.upstream[0].headers.get("x-kudo-client-ip")).toBe("1.2.3.4");
  });

  it("forwards guestbook POSTs with their body", async () => {
    const d = deps();
    await handle(
      req("https://cahya-wahyu.kudostack.com/api/ucapan", { method: "POST", body: '{"name":"Budi"}', headers: { "content-type": "application/json" } }),
      env,
      d,
    );
    expect(d.upstream[0].method).toBe("POST");
    expect(d.upstream[0].url).toBe(`${TEMPLATE}/api/ucapan`);
    expect(await d.upstream[0].text()).toBe('{"name":"Budi"}');
  });

  it("returns 404 for unknown slugs and blocked paths without calling the template", async () => {
    const d = deps();
    expect((await handle(req("https://tidak-ada.kudostack.com/"), env, d)).status).toBe(404);
    expect((await handle(req("https://cahya-wahyu.kudostack.com/nayla-mike"), env, d)).status).toBe(404);
    expect(d.fetch).not.toHaveBeenCalled();
  });

  it("passes system hosts through to their origin", async () => {
    const d = deps();
    const res = await handle(req("https://admin.kudostack.com/masuk"), env, d);
    expect(await res.text()).toBe("origin");
    expect(d.resolve).not.toHaveBeenCalled();
  });

  it("rewrites template redirects onto the subdomain", async () => {
    const d = deps({
      fetch: vi.fn(async () => new Response(null, { status: 307, headers: { location: `${TEMPLATE}/cahya-wahyu?x=1` } })) as unknown as typeof fetch,
    });
    const res = await handle(req("https://cahya-wahyu.kudostack.com/"), env, d);
    expect(res.headers.get("location")).toBe("https://cahya-wahyu.kudostack.com/?x=1");
  });

  it("passes names reserved in the admin through to their origin", async () => {
    const d = deps({ resolve: vi.fn(async () => ({ reserved: true as const })) });
    const res = await handle(req("https://blog.kudostack.com/"), env, d);
    expect(await res.text()).toBe("origin");
    expect(d.fetch).not.toHaveBeenCalled();
  });

  it("answers the health check without touching a template", async () => {
    const d = deps();
    const res = await handle(req("https://kudo-health-check.kudostack.com/_kudo/health"), env, d);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ ok: true, service: "kudo-gateway", rootDomain: "kudostack.com", database: "ok", gatewaySecret: true });
    expect(d.fetch).not.toHaveBeenCalled();

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const broken = deps({ resolve: vi.fn(async () => Promise.reject(new Error("db down"))) });
    const body = await (await handle(req("https://abc.kudostack.com/_kudo/health"), { ROOT_DOMAIN: "kudostack.com" }, broken)).json();
    expect(body).toMatchObject({ ok: false, database: "error", gatewaySecret: false });
    errorSpy.mockRestore();
  });

  it("degrades gracefully when the lookup or template fails", async () => {
    const failingResolve = deps({ resolve: vi.fn(async () => Promise.reject(new Error("db down"))) });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect((await handle(req("https://cahya-wahyu.kudostack.com/"), env, failingResolve)).status).toBe(503);
    const failingFetch = deps({ fetch: vi.fn(async () => Promise.reject(new Error("timeout"))) as unknown as typeof fetch });
    expect((await handle(req("https://cahya-wahyu.kudostack.com/"), env, failingFetch)).status).toBe(502);
    errorSpy.mockRestore();
  });
});

describe("createResolver", () => {
  it("calls the Supabase RPC with the anon key and caches results", async () => {
    const fetchFn = vi.fn(async () => Response.json([{ base_url: TEMPLATE, template_code: "kudo-3" }]));
    const resolver = createResolver({ supabaseUrl: "https://x.supabase.co/", supabaseAnonKey: "anon" }, fetchFn as unknown as typeof fetch);
    expect(await resolver.resolve("cahya-wahyu", 0)).toEqual({ baseUrl: TEMPLATE });
    expect(await resolver.resolve("cahya-wahyu", 30_000)).toEqual({ baseUrl: TEMPLATE });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://x.supabase.co/rest/v1/rpc/resolve_invitation_host");
    expect(JSON.parse(String(init.body))).toEqual({ p_slug: "cahya-wahyu" });
    // Setelah kedaluwarsa, query lagi.
    await resolver.resolve("cahya-wahyu", 61_000);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("recognises names reserved in the database", async () => {
    const resolver = createResolver(
      { supabaseUrl: "https://x", supabaseAnonKey: "a" },
      (async () => Response.json([{ base_url: null, template_code: null, reserved: true }])) as unknown as typeof fetch,
    );
    expect(await resolver.resolve("blog")).toEqual({ reserved: true });
  });

  it("treats empty or malformed rows as not found", async () => {
    const resolver = createResolver(
      { supabaseUrl: "https://x", supabaseAnonKey: "a" },
      (async () => Response.json([{ base_url: "javascript:alert(1)" }])) as unknown as typeof fetch,
    );
    expect(await resolver.resolve("a-b-c")).toBeNull();
  });

  it("supports static routes for local development and validates them", async () => {
    const resolver = createResolver({ staticRoutes: '{"cahya-wahyu":"http://localhost:3005"}' });
    expect(await resolver.resolve("cahya-wahyu")).toEqual({ baseUrl: "http://localhost:3005" });
    expect(await resolver.resolve("lain-lain")).toBeNull();
    expect(() => createResolver({ staticRoutes: "{bukan json" })).toThrow("STATIC_ROUTES");
  });

  it("fails loudly without configuration or on RPC errors", async () => {
    await expect(createResolver({}).resolve("abc")).rejects.toThrow("SUPABASE_URL");
    const failing = createResolver({ supabaseUrl: "https://x", supabaseAnonKey: "a" }, (async () => new Response("", { status: 500 })) as unknown as typeof fetch);
    await expect(failing.resolve("abc")).rejects.toThrow("500");
  });
});
