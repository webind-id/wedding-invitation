import { describe, expect, it } from "vitest";
import { guestLink, guestLinkNotice, withGuestLinks } from "@/lib/guest-link";
import type { Invitee } from "@/lib/invitee";
import { GUEST_NAME_MAX, normalizeGuestName, signGuestName, verifyGuestName } from "@/shared/guest-token";

const SECRET = "s".repeat(40);
const SLUG = "cahya-wahyu";

describe("guest token", () => {
  it("is short, url-safe and deterministic", () => {
    const token = signGuestName(SLUG, "Budi", SECRET);
    expect(token).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(signGuestName(SLUG, "Budi", SECRET)).toBe(token);
  });

  it("binds the name, the invitation and the secret", () => {
    const token = signGuestName(SLUG, "Budi", SECRET);
    expect(signGuestName(SLUG, "Budi Santoso", SECRET)).not.toBe(token);
    expect(signGuestName("arini-andra", "Budi", SECRET)).not.toBe(token);
    expect(signGuestName(SLUG, "Budi", "t".repeat(40))).not.toBe(token);
  });

  it("verifies only the exact pair it signed", () => {
    const token = signGuestName(SLUG, "Bapak Budi & Keluarga", SECRET);
    expect(verifyGuestName(SLUG, "Bapak Budi & Keluarga", token, SECRET)).toBe(true);
    expect(verifyGuestName(SLUG, "Bapak Budi", token, SECRET)).toBe(false);
    expect(verifyGuestName("arini-andra", "Bapak Budi & Keluarga", token, SECRET)).toBe(false);
    expect(verifyGuestName(SLUG, "Bapak Budi & Keluarga", `${token.slice(0, -1)}x`, SECRET)).toBe(false);
    expect(verifyGuestName(SLUG, "Bapak Budi & Keluarga", `${token}x`, SECRET)).toBe(false);
  });

  it("fails closed without a token, a secret or a name", () => {
    const token = signGuestName(SLUG, "Budi", SECRET);
    expect(verifyGuestName(SLUG, "Budi", undefined, SECRET)).toBe(false);
    expect(verifyGuestName(SLUG, "Budi", "", SECRET)).toBe(false);
    expect(verifyGuestName(SLUG, "Budi", token, undefined)).toBe(false);
    expect(verifyGuestName(SLUG, "   ", signGuestName(SLUG, "   ", SECRET), SECRET)).toBe(false);
  });

  it("normalizes the name the same way on both sides (trim, NFC, max length)", () => {
    expect(normalizeGuestName("  Budi  ")).toBe("Budi");
    expect(normalizeGuestName("x".repeat(100))).toHaveLength(GUEST_NAME_MAX);
    // "é" tersusun vs "e" + aksen terpisah
    expect(normalizeGuestName("André")).toBe(normalizeGuestName("André"));
    const token = signGuestName(SLUG, "  Budi ", SECRET);
    expect(verifyGuestName(SLUG, "Budi", token, SECRET)).toBe(true);
  });

  it("cannot be swapped with a preview token (separate purpose prefix)", () => {
    // Token pratinjau menandatangani "preview:<slug>:<exp>"; nama "preview:..." tetap tidak cocok.
    const guest = signGuestName(SLUG, "1800000000", SECRET);
    expect(verifyGuestName(SLUG, "1800000000", guest, SECRET)).toBe(true);
    expect(verifyGuestName(SLUG, "preview", guest, SECRET)).toBe(false);
  });
});

describe("guestLink", () => {
  it("uses the short guest code when the invitee has one (?untuk=…)", () => {
    const guest = { name: "Pak Budi & Keluarga", code: "pak-budi-keluarga-k7q2" };
    expect(guestLink("https://wahyu-cahya.kudostack.my.id", SLUG, guest, SECRET)).toBe(
      "https://wahyu-cahya.kudostack.my.id/?untuk=pak-budi-keluarga-k7q2",
    );
    expect(guestLink("https://wedding6.kudostack.my.id/wahyu-cahya", SLUG, guest, undefined)).toBe(
      "https://wedding6.kudostack.my.id/wahyu-cahya?untuk=pak-budi-keluarga-k7q2",
    );
  });

  it("joins with & when the base already has a query", () => {
    expect(guestLink("https://x.test/a?ref=1", SLUG, { name: "Budi", code: "budi-k7q2" }, SECRET)).toBe("https://x.test/a?ref=1&untuk=budi-k7q2");
  });

  it("falls back to the signed ?to=&k= link before migration 003 adds codes", () => {
    const link = guestLink("https://cahya-wahyu.kudostack.my.id", SLUG, { name: "Pak Budi & Keluarga" }, SECRET);
    const url = new URL(link);
    expect(url.searchParams.get("to")).toBe("Pak Budi & Keluarga");
    expect(url.searchParams.get("k")).toBe(signGuestName(SLUG, "Pak Budi & Keluarga", SECRET));
    expect(guestLink("https://x.test/a", SLUG, { name: "Budi", code: null }, undefined)).toBe("https://x.test/a?to=Budi");
  });
});

describe("withGuestLinks", () => {
  it("adds each invitee's link without touching the rest", () => {
    const invitee: Invitee = {
      id: "1",
      invitation_id: "inv",
      name: "Budi",
      contact: "628",
      channel: "whatsapp",
      inviter: null,
      is_sent: false,
      sent_at: null,
      created_at: "2027-01-01T00:00:00Z",
      code: "budi-k7q2",
    };
    const [linked] = withGuestLinks([invitee], "https://x.test/a", SLUG, SECRET);
    expect(linked).toEqual({ ...invitee, link: "https://x.test/a?untuk=budi-k7q2" });
  });
});

describe("guestLinkNotice", () => {
  const withCode = { name: "A", code: "a-k7q2" };
  const withoutCode = { name: "B", code: null };

  it("is silent when every guest has a short code", () => {
    expect(guestLinkNotice([withCode], undefined)).toBeNull();
    expect(guestLinkNotice([], undefined)).toBeNull();
  });

  it("asks for migration 003 when codes are missing, and warns harder without a secret", () => {
    expect(guestLinkNotice([withCode, withoutCode], SECRET)).toMatch(/003/);
    expect(guestLinkNotice([withoutCode], undefined)).toMatch(/PREVIEW_SECRET/);
  });
});
