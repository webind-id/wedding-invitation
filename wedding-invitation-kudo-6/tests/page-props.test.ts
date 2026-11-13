import { describe, expect, it } from "vitest";
import { guestCodeFrom, guestNameFrom, metadataFor, previewFrom, resolveGuestName, verifiedGuestName } from "@/lib/page-props";
import { signGuestName } from "@/shared/guest-token";
import { sampleContent } from "@/shared/sample";

const SECRET = "s".repeat(40);
const SLUG = "cahya-wahyu";

describe("guestNameFrom (demo page)", () => {
  it("uses the first trimmed ?to value, capped at 80 chars", () => {
    expect(guestNameFrom("  Pak Budi  ", "Tamu")).toBe("Pak Budi");
    expect(guestNameFrom(["A", "B"], "Tamu")).toBe("A");
    expect(guestNameFrom("x".repeat(100), "Tamu")).toHaveLength(80);
  });

  it("falls back when empty", () => {
    expect(guestNameFrom(undefined, "Tamu")).toBe("Tamu");
    expect(guestNameFrom("   ", "Tamu")).toBe("Tamu");
  });

  it("reads the preview token", () => {
    expect(previewFrom(["t1", "t2"])).toBe("t1");
    expect(previewFrom(undefined)).toBeUndefined();
  });
});

describe("verifiedGuestName (real invitation)", () => {
  const k = signGuestName(SLUG, "Pak Budi & Keluarga", SECRET);

  it("shows the name only when the admin signature matches", () => {
    expect(verifiedGuestName(SLUG, "Pak Budi & Keluarga", k, "Tamu", SECRET)).toBe("Pak Budi & Keluarga");
    expect(verifiedGuestName(SLUG, ["  Pak Budi & Keluarga ", "x"], [k], "Tamu", SECRET)).toBe("Pak Budi & Keluarga");
  });

  it("falls back to the default greeting for typed, edited or foreign names", () => {
    expect(verifiedGuestName(SLUG, "Nama Palsu", undefined, "Tamu", SECRET)).toBe("Tamu");
    expect(verifiedGuestName(SLUG, "Nama Palsu", k, "Tamu", SECRET)).toBe("Tamu");
    expect(verifiedGuestName("arini-andra", "Pak Budi & Keluarga", k, "Tamu", SECRET)).toBe("Tamu");
  });

  it("fails closed without a secret, and stays on the greeting without ?to", () => {
    expect(verifiedGuestName(SLUG, "Pak Budi & Keluarga", k, "Tamu", undefined)).toBe("Tamu");
    expect(verifiedGuestName(SLUG, undefined, k, "Tamu", SECRET)).toBe("Tamu");
  });
});

describe("guestCodeFrom (?untuk=)", () => {
  it("accepts well-formed guest codes only", () => {
    expect(guestCodeFrom("pak-budi-keluarga-k7q2")).toBe("pak-budi-keluarga-k7q2");
    expect(guestCodeFrom(["budi-k7q2", "x"])).toBe("budi-k7q2");
  });

  it("rejects anything that is not a lowercase slug of sane length", () => {
    for (const bad of [undefined, "", "Budi", "budi k7q2", "budi--k7q2", "-budi", "budi%27", "a".repeat(65), "x,y"]) {
      expect(guestCodeFrom(bad)).toBeUndefined();
    }
  });
});

describe("resolveGuestName", () => {
  const k = signGuestName(SLUG, "Pak Budi & Keluarga", SECRET);

  it("prefers the name found for ?untuk=, normalized for display", () => {
    expect(resolveGuestName({ invitedName: "  Pak Budi & Keluarga ", slug: SLUG, fallback: "Tamu", secret: SECRET })).toBe("Pak Budi & Keluarga");
  });

  it("falls back to the default when a code was given but not found — never to ?to=", () => {
    expect(resolveGuestName({ invitedName: null, hasCode: true, slug: SLUG, to: "Pak Budi & Keluarga", k, fallback: "Tamu", secret: SECRET })).toBe("Tamu");
  });

  it("still honours legacy signed ?to=&k= links when no code is present", () => {
    expect(resolveGuestName({ invitedName: null, slug: SLUG, to: "Pak Budi & Keluarga", k, fallback: "Tamu", secret: SECRET })).toBe("Pak Budi & Keluarga");
    expect(resolveGuestName({ invitedName: null, slug: SLUG, to: "Nama Palsu", k, fallback: "Tamu", secret: SECRET })).toBe("Tamu");
  });
});

describe("metadataFor", () => {
  const imageUrl = "https://wedding6.kudostack.my.id/cahya-wahyu/og?v=abc";

  it("uses the generated 1200×630 preview image with a large card", () => {
    const meta = metadataFor(sampleContent, { imageUrl, pageUrl: "https://cahya-wahyu.kudostack.my.id/" });
    expect(meta.openGraph).toMatchObject({
      url: "https://cahya-wahyu.kudostack.my.id/",
      locale: "id_ID",
      siteName: "Cahya & Wahyu",
      images: [{ url: imageUrl, width: 1200, height: 630, type: "image/jpeg" }],
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: [imageUrl] });
  });

  it("personalises the description for the guest and keeps the SEO title", () => {
    const meta = metadataFor(sampleContent, { guestName: "Pak Budi" });
    expect(meta.title).toBe(sampleContent.seo.title);
    expect(meta.description).toMatch(/^Kepada Yth\. Pak Budi — /);
  });

  it("falls back to a text-only card without an image", () => {
    const meta = metadataFor({ ...sampleContent, seo: { title: "", description: "" } });
    expect(meta.title).toBe("Undangan Pernikahan Cahya & Wahyu");
    expect(meta.openGraph?.images).toBeUndefined();
    expect(meta.twitter).toMatchObject({ card: "summary" });
  });
});
