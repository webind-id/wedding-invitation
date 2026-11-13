import { describe, expect, it } from "vitest";
import {
  CLIENT_DRAFT_MAX_BYTES,
  CLIENT_FORM_TTL_DAYS,
  clientFormAvailability,
  clientFormExpiry,
  clientFormLink,
  isClientFormToken,
  newClientFormToken,
  prepareClientSubmission,
  readClientPayload,
  restoreDraft,
  submissionSummary,
} from "@/lib/client-form";
import { sampleContent } from "@/shared/sample";

const NOW = Date.parse("2027-01-10T00:00:00Z");
const DAY = 86_400_000;

describe("token", () => {
  it("is a 32-char url-safe random string, different every time", () => {
    const a = newClientFormToken();
    const b = newClientFormToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{32}$/);
    expect(a).not.toBe(b);
    expect(isClientFormToken(a)).toBe(true);
  });

  it("rejects anything that is not a well-formed token", () => {
    for (const bad of ["", "abc", "x".repeat(31), "x".repeat(33), "a".repeat(31) + "/", undefined, 42]) {
      expect(isClientFormToken(bad)).toBe(false);
    }
  });

  it("builds the public link on the admin origin", () => {
    expect(clientFormLink("https://undangan.kudostack.my.id/", "t".repeat(32))).toBe(`https://undangan.kudostack.my.id/isi/${"t".repeat(32)}`);
  });
});

describe("availability", () => {
  const base = { status: "open" as const, revoked_at: null, expires_at: new Date(NOW + DAY).toISOString() };

  it("is open while active, also after the client submitted (they may still revise)", () => {
    expect(clientFormAvailability(base, NOW)).toBe("open");
    expect(clientFormAvailability({ ...base, status: "submitted" }, NOW)).toBe("open");
  });

  it("closes when revoked, expired or already imported — revoked wins", () => {
    expect(clientFormAvailability({ ...base, expires_at: new Date(NOW - 1).toISOString() }, NOW)).toBe("expired");
    expect(clientFormAvailability({ ...base, status: "imported" }, NOW)).toBe("imported");
    expect(clientFormAvailability({ ...base, status: "imported", revoked_at: new Date(NOW).toISOString() }, NOW)).toBe("revoked");
  });

  it("expires after the configured number of days", () => {
    expect(Date.parse(clientFormExpiry(NOW)) - NOW).toBe(CLIENT_FORM_TTL_DAYS * DAY);
  });
});

describe("readClientPayload (before any zod parsing)", () => {
  it("accepts an object content plus a guest list, trimming and capping guest fields", () => {
    const payload = readClientPayload({ name: "x" }, [{ name: "  Budi ", contact: " 0812 3456 7890 ", inviter: "", extra: 1 }, "junk"]);
    expect(payload).toEqual({ content: { name: "x" }, guests: [{ name: "Budi", contact: "0812 3456 7890", inviter: "" }] });
  });

  it("rejects non-object content and oversized payloads", () => {
    expect(readClientPayload(null, [])).toBeNull();
    expect(readClientPayload([], [])).toBeNull();
    expect(readClientPayload({ big: "x".repeat(CLIENT_DRAFT_MAX_BYTES) }, [])).toBeNull();
  });

  it("caps the guest list length", () => {
    const many = Array.from({ length: 1500 }, (_, i) => ({ name: `T${i}`, contact: "0812345678", inviter: "" }));
    expect(readClientPayload({}, many)?.guests).toHaveLength(1000);
  });
});

describe("prepareClientSubmission", () => {
  it("validates content with the shared contract and normalizes guests", () => {
    const result = prepareClientSubmission(sampleContent, [
      { name: "Budi", contact: "0812-3456-7890", inviter: "" },
      { name: "Budi lagi", contact: "+62 812 3456 7890", inviter: "" },
      { name: "", contact: "0812", inviter: "" },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.content.bride.nickname).toBe(sampleContent.bride.nickname);
    expect(result.guests.valid).toEqual([{ name: "Budi", contact: "6281234567890", channel: "whatsapp", inviter: null }]);
    expect(result.guests.invalid).toBe(2);
  });

  it("returns per-field errors for incomplete content", () => {
    const result = prepareClientSubmission({ ...sampleContent, bride: { ...sampleContent.bride, fullName: "" } }, []);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors["bride.fullName"]).toBeTruthy();
  });
});

describe("restoreDraft", () => {
  it("resumes a saved draft that has the full content shape (even with empty values)", () => {
    const draft = { ...sampleContent, bride: { ...sampleContent.bride, fullName: "" }, story: [] };
    expect(restoreDraft(draft, sampleContent)).toBe(draft);
  });

  it("falls back to the invitation content when the draft is missing or malformed", () => {
    expect(restoreDraft(null, sampleContent)).toBe(sampleContent);
    expect(restoreDraft({ bride: {} }, sampleContent)).toBe(sampleContent);
    expect(restoreDraft({ ...sampleContent, events: "rusak" }, sampleContent)).toBe(sampleContent);
    expect(restoreDraft({ ...sampleContent, gift: [] }, sampleContent)).toBe(sampleContent);
  });
});

describe("submissionSummary", () => {
  it("counts what the client filled in", () => {
    const summary = submissionSummary(sampleContent, 3);
    expect(summary).toMatchObject({
      couple: "Cahya & Wahyu",
      events: sampleContent.events.length,
      story: sampleContent.story.length,
      gallery: sampleContent.moments.length,
      accounts: sampleContent.gift.accounts.length,
      hasMusic: false,
      guests: 3,
    });
    expect(summary.firstEvent).toBe(sampleContent.events[0].start);
  });
});
