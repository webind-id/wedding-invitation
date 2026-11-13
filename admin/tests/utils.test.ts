import { describe, expect, it } from "vitest";
import { attempt, failure, success } from "@/lib/action";
import { formToObject, invitationMetaSchema, messageTemplateSchema, templateInputSchema } from "@/lib/forms";
import { getIn, moveItem, pathKey, removeItem, setIn } from "@/lib/immutable";
import { checkMedia } from "@/lib/media";
import { invitationUrl, isReservedSlug, isValidSlug, publicUrl, slugify } from "@/lib/slug";
import { cleanText, truncate } from "@/lib/text";
import { sanitizeSearch } from "@/lib/search";

describe("slug", () => {
  it("slugifies titles", () => {
    expect(slugify("Cahya & Wahyu — 2027!")).toBe("cahya-wahyu-2027");
    expect(slugify("Ésa Çinta")).toBe("esa-cinta");
    expect(slugify("a".repeat(70)).length).toBe(60);
  });

  it("validates slugs", () => {
    expect(isValidSlug("cahya-wahyu")).toBe(true);
    for (const bad of ["ab", "-cahya", "cahya-", "na--dia", "Cahya", "na dia"]) expect(isValidSlug(bad)).toBe(false);
  });

  it("builds public URLs", () => {
    expect(invitationUrl("https://kudo.test/", "cahya-wahyu")).toBe("https://kudo.test/cahya-wahyu");
  });
});

describe("immutable helpers", () => {
  const obj = { a: { list: [{ x: 1 }, { x: 2 }] } };

  it("reads and writes nested paths without mutation", () => {
    const next = setIn(obj, ["a", "list", 1, "x"], 9);
    expect(getIn(next, ["a", "list", 1, "x"])).toBe(9);
    expect(obj.a.list[1].x).toBe(2);
    expect(next.a.list[0]).toBe(obj.a.list[0]);
    expect(Array.isArray(next.a.list)).toBe(true);
    expect(getIn(obj, ["missing", "deep"])).toBeUndefined();
    expect(setIn(obj, [], 5)).toBe(5);
  });

  it("moves and removes list items", () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(removeItem([1, 2, 3], 1)).toEqual([1, 3]);
    expect(pathKey(["events", 0, "name"])).toBe("events.0.name");
  });
});

describe("media check", () => {
  const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  const mp3 = new Uint8Array([0x49, 0x44, 0x33, 0x04]);

  it("accepts files whose bytes match the declared type", () => {
    expect(checkMedia("image/jpeg", 100, jpg, "image")).toEqual({ ok: true, ext: "jpg", mime: "image/jpeg" });
    expect(checkMedia("image/png", 100, png, "image").ok).toBe(true);
    expect(checkMedia("image/webp", 100, webp, "image").ok).toBe(true);
    expect(checkMedia("audio/mpeg", 100, mp3, "audio").ok).toBe(true);
    expect(checkMedia("audio/mpeg", 100, new Uint8Array([0xff, 0xfb]), "audio").ok).toBe(true);
  });

  it("rejects spoofed, oversized, empty, or wrong-kind files", () => {
    expect(checkMedia("image/png", 100, jpg, "image").ok).toBe(false);
    // Foto dikompres ke WebP setelah diunggah, jadi foto HP sampai 10 MB diterima.
    expect(checkMedia("image/jpeg", 9 * 1024 * 1024, jpg, "image").ok).toBe(true);
    expect(checkMedia("image/jpeg", 11 * 1024 * 1024, jpg, "image").ok).toBe(false);
    expect(checkMedia("image/jpeg", 0, jpg, "image").ok).toBe(false);
    expect(checkMedia("image/svg+xml", 100, jpg, "image").ok).toBe(false);
    expect(checkMedia("audio/mpeg", 100, mp3, "image").ok).toBe(false);
  });
});

describe("forms", () => {
  it("normalises template input", () => {
    const r = templateInputSchema.safeParse({
      code: " Kudo ",
      name: "Kudo",
      description: "",
      base_url: "https://kudo.test/",
      preview_image: "",
      is_active: true,
    });
    expect(r.success && r.data).toMatchObject({ code: "kudo", base_url: "https://kudo.test" });
  });

  it("rejects base URLs with a path and non-https previews", () => {
    const base = { code: "kudo", name: "K", description: "", preview_image: "", is_active: true };
    expect(templateInputSchema.safeParse({ ...base, base_url: "https://kudo.test/app" }).success).toBe(false);
    expect(templateInputSchema.safeParse({ ...base, base_url: "https://kudo.test", preview_image: "http://x" }).success).toBe(false);
  });

  it("validates invitation meta", () => {
    const id = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
    expect(invitationMetaSchema.safeParse({ title: "N & A", slug: "Cahya-Wahyu", template_id: id }).success).toBe(true);
    expect(invitationMetaSchema.safeParse({ title: "N", slug: "x", template_id: id }).success).toBe(false);
    expect(invitationMetaSchema.safeParse({ title: "N", slug: "Cahya", template_id: "nope" }).success).toBe(false);
    expect(messageTemplateSchema.safeParse("x".repeat(2001)).success).toBe(false);
  });

  it("reads FormData with checkbox booleans", () => {
    const form = new FormData();
    form.set("name", "Kudo");
    form.set("is_active", "on");
    expect(formToObject(form, ["is_active", "missing"])).toEqual({ name: "Kudo", is_active: true, missing: false });
  });
});

describe("text & search", () => {
  it("cleans and truncates safely", () => {
    expect(cleanText(" a\u0007b   c\n\n\n\nd ")).toBe("ab c\n\nd");
    expect(truncate("ab😀c", 3)).toBe("ab😀");
  });

  it("strips PostgREST filter syntax from search", () => {
    expect(sanitizeSearch("Cahya,status.eq.draft)")).toBe("Cahyastatuseqdraft");
    expect(sanitizeSearch("  Ésa  ")).toBe("Ésa");
  });
});

describe("action helpers", () => {
  it("wraps results and hides unexpected errors", async () => {
    expect(success(1)).toEqual({ ok: true, data: 1 });
    expect(failure("x", { a: "b" })).toEqual({ ok: false, error: "x", fieldErrors: { a: "b" } });
    const original = console.error;
    console.error = () => undefined;
    try {
      expect(await attempt(async () => { throw new Error("boom: secret detail"); })).toEqual({
        ok: false,
        error: "Terjadi kesalahan. Coba lagi.",
        fieldErrors: undefined,
      });
      expect(await attempt(async () => { throw new Error("Gagal memuat undangan."); })).toMatchObject({
        error: "Gagal memuat undangan.",
      });
    } finally {
      console.error = original;
    }
  });

  it("rethrows Next.js redirect errors", async () => {
    const redirectError = Object.assign(new Error("NEXT_REDIRECT"), { digest: "NEXT_REDIRECT;replace;/x" });
    await expect(attempt(async () => { throw redirectError; })).rejects.toBe(redirectError);
  });
});

describe("subdomain URLs", () => {
  it("builds subdomain URLs from a pattern, falling back to the template domain", () => {
    expect(publicUrl("https://{slug}.kudostack.com", "https://tpl-kudo3.kudostack.com", "cahya-wahyu")).toBe("https://cahya-wahyu.kudostack.com");
    expect(publicUrl("https://{slug}.kudostack.com/", "x", "a-b-c")).toBe("https://a-b-c.kudostack.com");
    expect(publicUrl(null, "https://tpl-kudo3.kudostack.com/", "cahya-wahyu")).toBe("https://tpl-kudo3.kudostack.com/cahya-wahyu");
  });

  it("reserves system subdomains and the tpl- prefix", () => {
    for (const slug of ["www", "admin", "api", "tpl-kudo3", "tpl-anything"]) expect(isReservedSlug(slug)).toBe(true);
    expect(isReservedSlug("promo", ["promo"])).toBe(true);
    expect(isReservedSlug("cahya-wahyu")).toBe(false);
  });
});
