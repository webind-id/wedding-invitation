import { describe, expect, it } from "vitest";
import { guestNameFrom, metadataFor, previewFrom } from "@/lib/page-props";
import { sampleContent } from "@/shared/sample";

describe("guestNameFrom", () => {
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
