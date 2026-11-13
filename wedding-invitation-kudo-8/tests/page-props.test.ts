import { describe, expect, it } from "vitest";
import { guestNameFrom, metadataFor, previewFrom, verifiedGuestName } from "@/lib/page-props";
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

describe("metadataFor", () => {
  it("uses SEO fields and only https cover images", () => {
    const meta = metadataFor(sampleContent);
    expect(meta.title).toBe(sampleContent.seo.title);
    expect(meta.openGraph?.images).toBeUndefined();
    const withRemote = metadataFor({ ...sampleContent, coverPhoto: "https://cdn.test/c.jpg" });
    expect(withRemote.openGraph?.images).toEqual(["https://cdn.test/c.jpg"]);
  });

  it("falls back to the couple name", () => {
    const meta = metadataFor({ ...sampleContent, seo: { title: "", description: "" } });
    expect(meta.title).toBe("Cahya & Wahyu");
    expect(meta.description).toBe("Undangan pernikahan Cahya & Wahyu.");
  });
});
