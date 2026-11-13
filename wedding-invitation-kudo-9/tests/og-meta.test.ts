import { describe, expect, it } from "vitest";
import { ogText, ogVersion, publicPageUrl, requestOrigin } from "@/lib/og-meta";
import { sampleContent } from "@/shared/sample";

const noSeo = { ...sampleContent, seo: { title: "", description: "" } };

describe("ogText", () => {
  it("greets the guest by name when the link is personal", () => {
    const { title, description } = ogText(noSeo, "Pak Budi & Keluarga");
    expect(title).toBe("Undangan Pernikahan Cahya & Wahyu");
    expect(description).toMatch(/^Kepada Yth\. Pak Budi & Keluarga — /);
    expect(description).toContain("Sabtu, 12 Juni 2027");
    expect(description).toContain(sampleContent.events[0].venue);
  });

  it("uses a general invitation line without a guest", () => {
    const { description } = ogText(noSeo, null);
    expect(description).toMatch(/^Dengan hormat kami mengundang Anda ke pernikahan Cahya & Wahyu\./);
  });

  it("prefers the admin's SEO title & description, still personalised", () => {
    const content = { ...sampleContent, seo: { title: "Cahya ♡ Wahyu", description: "Rayakan bersama kami." } };
    const { title, description } = ogText(content, "Rina");
    expect(title).toBe("Cahya ♡ Wahyu");
    expect(description).toBe("Kepada Yth. Rina — Rayakan bersama kami.");
  });

  it("keeps descriptions short enough for chat previews", () => {
    const content = { ...noSeo, events: [{ ...sampleContent.events[0], venue: "V".repeat(300) }] };
    expect(ogText(content, "x".repeat(80)).description.length).toBeLessThanOrEqual(200);
  });
});

describe("ogVersion", () => {
  it("changes when what the image shows changes, and only then", () => {
    const v = ogVersion(sampleContent);
    expect(v).toMatch(/^[0-9a-f]{10}$/);
    expect(ogVersion({ ...sampleContent, closing: { message: "lain", signature: "" } })).toBe(v);
    expect(ogVersion({ ...sampleContent, coverPhoto: "/images/lain.webp" })).not.toBe(v);
    expect(ogVersion({ ...sampleContent, bride: { ...sampleContent.bride, nickname: "Ayu" } })).not.toBe(v);
  });
});

describe("requestOrigin / publicPageUrl", () => {
  const h = (init: Record<string, string>) => new Headers(init);

  it("uses the template's own host, https unless localhost", () => {
    expect(requestOrigin(h({ host: "wedding6.kudostack.my.id", "x-forwarded-proto": "https" }))).toBe("https://wedding6.kudostack.my.id");
    expect(requestOrigin(h({ host: "wedding6.kudostack.my.id" }))).toBe("https://wedding6.kudostack.my.id");
    expect(requestOrigin(h({ host: "localhost:3006" }))).toBe("http://localhost:3006");
  });

  it("points og:url at the invitation subdomain only for verified gateway requests", () => {
    const viaGateway = h({ host: "wedding6.kudostack.my.id", "x-forwarded-host": "cahya-wahyu.kudostack.my.id" });
    expect(publicPageUrl(viaGateway, "cahya-wahyu", true)).toBe("https://cahya-wahyu.kudostack.my.id/");
    expect(publicPageUrl(viaGateway, "cahya-wahyu", false)).toBe("https://wedding6.kudostack.my.id/cahya-wahyu");
  });
});
