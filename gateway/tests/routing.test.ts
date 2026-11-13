import { describe, expect, it } from "vitest";
import { decidePath, matchHost, parseList, rewriteLocation, upstreamHeaders, upstreamUrl } from "../src/routing";
import wranglerToml from "../wrangler.toml?raw";

describe("matchHost", () => {
  const root = "kudostack.com";

  it("treats one-level subdomains as invitations", () => {
    expect(matchHost("cahya-wahyu.kudostack.com", root)).toEqual({ kind: "invitation", slug: "cahya-wahyu" });
    expect(matchHost("Arini-Andra.KudoStack.com", root)).toEqual({ kind: "invitation", slug: "arini-andra" });
    expect(matchHost("nayla-mike.localhost:8787", "localhost")).toEqual({ kind: "invitation", slug: "nayla-mike" });
  });

  it("passes through the apex, other domains and nested subdomains", () => {
    for (const host of ["kudostack.com", "evil.com", "cahya.evil.com", "a.b.kudostack.com", "kudostack.com.evil.com"]) {
      expect(matchHost(host, root)).toEqual({ kind: "passthrough" });
    }
  });

  it("protects system subdomains, the tpl- prefix and extra reserved names", () => {
    for (const host of ["www.kudostack.com", "admin.kudostack.com", "api.kudostack.com", "tpl-kudo3.kudostack.com"]) {
      expect(matchHost(host, root)).toEqual({ kind: "passthrough" });
    }
    expect(matchHost("promo.kudostack.com", root, ["promo"])).toEqual({ kind: "passthrough" });
  });

  it("rejects labels that can't be slugs", () => {
    for (const sub of ["ab", "-cahya", "cahya-", "ca--hya", "a".repeat(61)]) {
      expect(matchHost(`${sub}.kudostack.com`, root)).toEqual({ kind: "passthrough" });
    }
  });

  it("supports multi-label root domains like kudostack.my.id", () => {
    const myId = "kudostack.my.id";
    expect(matchHost("arini-andra.kudostack.my.id", myId)).toEqual({ kind: "invitation", slug: "arini-andra" });
    for (const host of ["kudostack.my.id", "a.b.kudostack.my.id", "admin.kudostack.my.id", "tpl-kudo5.kudostack.my.id", "other.my.id"]) {
      expect(matchHost(host, myId)).toEqual({ kind: "passthrough" });
    }
  });

  it("never routes the admin (undangan.) or template (wedding1–8.) hosts from wrangler.toml as invitations", () => {
    const root = /^ROOT_DOMAIN = "(.+)"/m.exec(wranglerToml)?.[1] ?? "";
    const reserved = parseList(/^RESERVED_SUBDOMAINS = "(.*)"/m.exec(wranglerToml)?.[1]);
    expect(root).toBe("kudostack.my.id");
    for (const sub of ["undangan", ...Array.from({ length: 8 }, (_, i) => `wedding${i + 1}`)]) {
      expect(matchHost(`${sub}.${root}`, root, reserved)).toEqual({ kind: "passthrough" });
    }
    expect(matchHost(`arini-andra.${root}`, root, reserved)).toEqual({ kind: "invitation", slug: "arini-andra" });
  });

  it("parses comma lists", () => {
    expect(parseList(" Promo, blog ,,")).toEqual(["promo", "blog"]);
    expect(parseList(undefined)).toEqual([]);
  });
});

describe("decidePath", () => {
  it("maps the root to the invitation page", () => {
    expect(decidePath("/")).toEqual({ kind: "page" });
  });

  it("proxies assets and the guestbook API only", () => {
    for (const p of ["/_next/static/chunks/a.js", "/images/cover.jpg", "/audio/lagu.mp3", "/api/ucapan", "/favicon.ico"]) {
      expect(decidePath(p)).toEqual({ kind: "proxy" });
    }
  });

  it("blocks everything else, including other slugs and traversal", () => {
    for (const p of ["/nayla-mike", "/api/other", "/_next/../secret", "/admin"]) {
      expect(decidePath(p)).toEqual({ kind: "not-found" });
    }
  });
});

describe("upstreamUrl", () => {
  const base = "https://tpl-kudo3.kudostack.com/";

  it("rewrites / to /{slug} and keeps the query", () => {
    const url = upstreamUrl(base, "cahya-wahyu", new URL("https://cahya-wahyu.kudostack.com/?to=Pak%20Budi"), { kind: "page" });
    expect(url.toString()).toBe("https://tpl-kudo3.kudostack.com/cahya-wahyu?to=Pak%20Budi");
  });

  it("forwards the guest-name signature (k) untouched — templates need it to show the name", () => {
    const url = upstreamUrl(base, "cahya-wahyu", new URL("https://cahya-wahyu.kudostack.com/?to=Pak%20Budi&k=Ab3_x-9QzLm2Pq7R"), { kind: "page" });
    expect(url.searchParams.get("to")).toBe("Pak Budi");
    expect(url.searchParams.get("k")).toBe("Ab3_x-9QzLm2Pq7R");
  });

  it("keeps the path for proxied requests", () => {
    const url = upstreamUrl(base, "cahya-wahyu", new URL("https://cahya-wahyu.kudostack.com/api/ucapan?slug=cahya-wahyu"), { kind: "proxy" });
    expect(url.toString()).toBe("https://tpl-kudo3.kudostack.com/api/ucapan?slug=cahya-wahyu");
  });
});

describe("rewriteLocation", () => {
  const base = "https://tpl-kudo3.kudostack.com";
  const origin = "https://cahya-wahyu.kudostack.com";

  it("maps template URLs back onto the subdomain", () => {
    expect(rewriteLocation("https://tpl-kudo3.kudostack.com/cahya-wahyu?to=A", base, origin, "cahya-wahyu")).toBe(`${origin}/?to=A`);
    expect(rewriteLocation("/images/a.jpg", base, origin, "cahya-wahyu")).toBe(`${origin}/images/a.jpg`);
  });

  it("leaves foreign redirects untouched", () => {
    expect(rewriteLocation("https://maps.google.com/x", base, origin, "cahya-wahyu")).toBe("https://maps.google.com/x");
  });
});

describe("upstreamHeaders", () => {
  it("drops spoofable headers and adds the signed client IP", () => {
    const incoming = new Headers({
      host: "cahya-wahyu.kudostack.com",
      "x-forwarded-for": "6.6.6.6",
      "x-kudo-client-ip": "6.6.6.6",
      "x-kudo-gateway-secret": "forged",
      "cf-connecting-ip": "1.2.3.4",
      accept: "text/html",
    });
    const out = upstreamHeaders(incoming, "1.2.3.4", "s".repeat(40), "cahya-wahyu.kudostack.com");
    expect(out.get("accept")).toBe("text/html");
    expect(out.get("host")).toBeNull();
    expect(out.get("x-forwarded-for")).toBeNull();
    expect(out.get("cf-connecting-ip")).toBeNull();
    expect(out.get("x-kudo-client-ip")).toBe("1.2.3.4");
    expect(out.get("x-kudo-gateway-secret")).toBe("s".repeat(40));
    expect(out.get("x-forwarded-host")).toBe("cahya-wahyu.kudostack.com");
  });

  it("omits gateway headers when no secret is configured", () => {
    const out = upstreamHeaders(new Headers({ "x-kudo-client-ip": "6.6.6.6" }), "1.2.3.4", undefined, "h");
    expect(out.get("x-kudo-client-ip")).toBeNull();
    expect(out.get("x-kudo-gateway-secret")).toBeNull();
  });
});
