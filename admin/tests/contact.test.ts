import { describe, expect, it } from "vitest";
import {
  displayContact,
  fillTemplate,
  instagramDmLink,
  normalizeInstagram,
  normalizePhone,
  parseContact,
  whatsappLink,
} from "@/lib/contact";

describe("normalizePhone", () => {
  it.each([
    ["0812-3456-7890", "6281234567890"],
    ["+62 812 3456 7890", "6281234567890"],
    ["81234567890", "6281234567890"],
  ])("normalises %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it("returns null for too-short numbers", () => {
    expect(normalizePhone("0812")).toBeNull();
  });
});

describe("normalizeInstagram", () => {
  it("handles @, URLs and casing", () => {
    expect(normalizeInstagram("@Cahya.Example")).toBe("cahya.example");
    expect(normalizeInstagram("https://www.instagram.com/Wahyu_p/?hl=id")).toBe("wahyu_p");
  });

  it("rejects invalid handles", () => {
    expect(normalizeInstagram("a..b")).toBeNull();
    expect(normalizeInstagram(".abc")).toBeNull();
    expect(normalizeInstagram("bad handle!")).toBeNull();
  });
});

describe("parseContact", () => {
  it("detects WhatsApp numbers", () => {
    expect(parseContact("0812 3456 7890")).toEqual({ channel: "whatsapp", value: "6281234567890" });
  });

  it("detects Instagram handles", () => {
    expect(parseContact("@Wahyu")).toEqual({ channel: "instagram", value: "wahyu" });
  });

  it("returns null for empty or invalid input", () => {
    expect(parseContact("  ")).toBeNull();
    expect(parseContact("123")).toBeNull();
    expect(parseContact("not valid!")).toBeNull();
  });
});

describe("links and templates", () => {
  it("formats contacts for display", () => {
    expect(displayContact({ channel: "whatsapp", value: "628123" })).toBe("+628123");
    expect(displayContact({ channel: "instagram", value: "Wahyu" })).toBe("@Wahyu");
  });

  it("fills every placeholder", () => {
    expect(fillTemplate("Hai {nama}, {link} — {pengundang}", { nama: "A", link: "L", pengundang: null })).toBe(
      "Hai A, L — ",
    );
  });

  it("builds chat links", () => {
    expect(whatsappLink("6281", "a b")).toBe("https://wa.me/6281?text=a%20b");
    expect(instagramDmLink("Wahyu")).toBe("https://ig.me/m/Wahyu");
  });
});
