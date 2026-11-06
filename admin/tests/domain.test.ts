import { describe, expect, it } from "vitest";
import {
  checkSlugLocally,
  isValidRootDomain,
  normalizeRootDomain,
  parseReservedList,
  splitPattern,
  subdomainPattern,
  withoutBuiltIn,
} from "@/lib/domain";
import { domainSettingsSchema } from "@/lib/forms";

describe("root domain", () => {
  it("normalises what people paste", () => {
    expect(normalizeRootDomain("  https://KudoStack.com/ ")).toBe("kudostack.com");
    expect(normalizeRootDomain("*.kudostack.com")).toBe("kudostack.com");
    expect(normalizeRootDomain("kudostack.com.")).toBe("kudostack.com");
    expect(normalizeRootDomain("http://localhost:8787/x?y")).toBe("localhost:8787");
  });

  it("accepts hostnames with an optional port and rejects anything else", () => {
    for (const ok of ["kudostack.com", "undangan.kudostack.co.id", "localhost", "localhost:8787"]) expect(isValidRootDomain(ok)).toBe(true);
    for (const bad of ["", "-kudo.com", "kudo..com", "kudo com", "kudo.com/path", "a.b:99999999", "x@y.com"]) expect(isValidRootDomain(bad)).toBe(false);
  });
});

describe("subdomain pattern", () => {
  it("is null until enabled with a domain", () => {
    expect(subdomainPattern({ enabled: false, scheme: "https", rootDomain: "kudostack.com" })).toBeNull();
    expect(subdomainPattern({ enabled: true, scheme: "https", rootDomain: "" })).toBeNull();
    expect(subdomainPattern({ enabled: true, scheme: "https", rootDomain: "kudostack.com" })).toBe("https://{slug}.kudostack.com");
    expect(subdomainPattern({ enabled: true, scheme: "http", rootDomain: "localhost:8787" })).toBe("http://{slug}.localhost:8787");
  });

  it("splits around the slug for the input addon", () => {
    expect(splitPattern("https://{slug}.kudostack.com")).toEqual({ prefix: "https://", suffix: ".kudostack.com" });
  });
});

describe("reserved names", () => {
  it("parses comma, space and newline separated lists without duplicates", () => {
    expect(parseReservedList("Blog, promo\nshop  blog")).toEqual(["blog", "promo", "shop"]);
    expect(withoutBuiltIn(["blog", "www", "tpl-x"])).toEqual(["blog"]);
  });

  it("checks slugs locally before asking the database", () => {
    expect(checkSlugLocally("cahya-wahyu", [])).toBe("available");
    expect(checkSlugLocally("admin", [])).toBe("reserved");
    expect(checkSlugLocally("blog", ["blog"])).toBe("reserved");
    expect(checkSlugLocally("Bad Slug", [])).toBe("invalid");
  });
});

describe("domainSettingsSchema", () => {
  const base = { scheme: "https", root_domain: "https://KudoStack.com/", reserved: "blog, www, Promo", enabled: true };

  it("normalises the domain and drops built-in names", () => {
    const parsed = domainSettingsSchema.parse(base);
    expect(parsed).toEqual({ enabled: true, scheme: "https", root_domain: "kudostack.com", reserved: ["blog", "promo"] });
  });

  it("requires a domain only when enabled", () => {
    expect(domainSettingsSchema.safeParse({ ...base, root_domain: "" }).success).toBe(false);
    expect(domainSettingsSchema.safeParse({ ...base, root_domain: "", enabled: false }).success).toBe(true);
  });

  it("rejects bad domains, schemes and reserved names", () => {
    expect(domainSettingsSchema.safeParse({ ...base, root_domain: "kudo..com" }).success).toBe(false);
    expect(domainSettingsSchema.safeParse({ ...base, scheme: "ftp" }).success).toBe(false);
    expect(domainSettingsSchema.safeParse({ ...base, reserved: "ok, bad_name" }).success).toBe(false);
  });
});
