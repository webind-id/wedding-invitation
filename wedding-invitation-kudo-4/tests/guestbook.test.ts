import { describe, expect, it } from "vitest";
import { addToSummary, cleanText, LIMITS, truncate, validateGuestbookInput } from "@/lib/guestbook";

describe("validateGuestbookInput", () => {
  const valid = { name: "  Budi  ", attendance: "hadir", partySize: 2, message: "Selamat!" };

  it("accepts a valid attending entry and trims the name", () => {
    expect(validateGuestbookInput(valid)).toEqual({
      ok: true,
      value: { name: "Budi", attendance: "hadir", partySize: 2, message: "Selamat!" },
    });
  });

  it("rejects non-object bodies", () => {
    expect(validateGuestbookInput(null).ok).toBe(false);
    expect(validateGuestbookInput("x").ok).toBe(false);
  });

  it("requires a name", () => {
    expect(validateGuestbookInput({ ...valid, name: "   " })).toEqual({ ok: false, error: "Nama wajib diisi." });
  });

  it("rejects names over the limit", () => {
    const result = validateGuestbookInput({ ...valid, name: "a".repeat(LIMITS.nameMax + 1) });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown attendance values", () => {
    expect(validateGuestbookInput({ ...valid, attendance: "maybe" }).ok).toBe(false);
  });

  it("rejects out-of-range party size when attending", () => {
    expect(validateGuestbookInput({ ...valid, partySize: 0 }).ok).toBe(false);
    expect(validateGuestbookInput({ ...valid, partySize: LIMITS.partyMax + 1 }).ok).toBe(false);
    expect(validateGuestbookInput({ ...valid, partySize: 1.5 }).ok).toBe(false);
  });

  it("forces party size to 1 when not attending", () => {
    const result = validateGuestbookInput({ ...valid, attendance: "tidak_hadir", partySize: 99 });
    expect(result.ok && result.value.partySize).toBe(1);
  });

  it("stores an empty message as null", () => {
    const result = validateGuestbookInput({ ...valid, message: "   " });
    expect(result.ok && result.value.message).toBeNull();
  });

  it("rejects messages over the limit", () => {
    expect(validateGuestbookInput({ ...valid, message: "x".repeat(LIMITS.messageMax + 1) }).ok).toBe(false);
  });
});

describe("cleanText", () => {
  it("strips control characters and collapses whitespace but keeps line breaks", () => {
    expect(cleanText(" a\u0007b   c\n\n\n\nd ")).toBe("ab c\n\nd");
  });
});

describe("addToSummary", () => {
  const base = { hadir: 1, tidak_hadir: 0, ragu: 0, heads: 2 };

  it("adds heads only for attending entries", () => {
    expect(addToSummary(base, { attendance: "hadir", party_size: 3 })).toEqual({ ...base, hadir: 2, heads: 5 });
    expect(addToSummary(base, { attendance: "ragu", party_size: 1 })).toEqual({ ...base, ragu: 1 });
  });

  it("does not mutate the input", () => {
    addToSummary(base, { attendance: "tidak_hadir", party_size: 1 });
    expect(base.tidak_hadir).toBe(0);
  });
});

describe("truncate", () => {
  it("never splits a surrogate pair", () => {
    expect(truncate("ab😀c", 3)).toBe("ab😀");
    expect(truncate("abc", 5)).toBe("abc");
  });
});
