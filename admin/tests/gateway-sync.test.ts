import { describe, expect, it } from "vitest";
import { DEFAULT_RESERVED, RESERVED_PREFIX } from "../../gateway/src/routing";
import { RESERVED_PREFIX as ADMIN_PREFIX, RESERVED_SUBDOMAINS, SLUG_PATTERN } from "@/lib/slug";
import { matchHost } from "../../gateway/src/routing";

/**
 * Admin (yang menolak slug) dan gateway (yang meneruskan subdomain sistem)
 * harus sepakat soal nama terlindung — kalau tidak, slug bisa dibuat tapi
 * tidak pernah bisa dibuka, atau subdomain sistem tertimpa undangan.
 */
describe("admin ↔ gateway agreement", () => {
  it("uses the same reserved names and prefix", () => {
    expect([...RESERVED_SUBDOMAINS].sort()).toEqual([...DEFAULT_RESERVED].sort());
    expect(ADMIN_PREFIX).toBe(RESERVED_PREFIX);
  });

  it("routes every valid, non-reserved admin slug to an invitation", () => {
    for (const slug of ["cahya-wahyu", "arini-andra", "nayla-mike", "abc", "a1-b2"]) {
      expect(SLUG_PATTERN.test(slug)).toBe(true);
      expect(matchHost(`${slug}.kudostack.com`, "kudostack.com")).toEqual({ kind: "invitation", slug });
    }
  });
});
