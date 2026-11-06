import { describe, expect, it } from "vitest";
import { INVITEE_LIMITS, isUuid, prepareInvitees } from "@/lib/invitee";

describe("prepareInvitees", () => {
  it("normalises valid rows and counts invalid ones", () => {
    const result = prepareInvitees([
      { name: " Budi ", contact: "0812-3456-7890", inviter: "Cahya" },
      { name: "Siti", contact: "@Siti.R", inviter: "" },
      { name: "", contact: "0812345678" },
      { name: "Tanpa kontak", contact: "??" },
      "bukan objek",
    ]);
    expect(result.valid).toEqual([
      { name: "Budi", contact: "6281234567890", channel: "whatsapp", inviter: "Cahya" },
      { name: "Siti", contact: "siti.r", channel: "instagram", inviter: null },
    ]);
    expect(result.invalid).toBe(3);
  });

  it("drops duplicates within the same batch", () => {
    const result = prepareInvitees([
      { name: "A", contact: "081234567890" },
      { name: "B", contact: "+62 812 3456 7890" },
    ]);
    expect(result.valid).toHaveLength(1);
    expect(result.invalid).toBe(1);
  });

  it("returns nothing for non-array input and caps batch size", () => {
    expect(prepareInvitees(null)).toEqual({ valid: [], invalid: 0 });
    const many = Array.from({ length: INVITEE_LIMITS.batchMax + 5 }, (_, i) => ({
      name: `T${i}`,
      contact: `0812${String(i).padStart(8, "0")}`,
    }));
    expect(prepareInvitees(many).valid).toHaveLength(INVITEE_LIMITS.batchMax);
  });
});

describe("isUuid", () => {
  it("accepts UUIDs only", () => {
    expect(isUuid("3f2504e0-4f89-11d3-9a0c-0305e82c3301")).toBe(true);
    expect(isUuid("1; drop table")).toBe(false);
  });
});
