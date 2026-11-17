import { describe, expect, it } from "vitest";
import {
  couplePair,
  DEFAULT_MUSIC,
  GAMELAN_MUSIC,
  coupleLabel,
  fieldErrors,
  fromLocalInput,
  invitationContentSchema,
  musicSource,
  toLocalInput,
  withContentDefaults,
  type InvitationContent,
  withHonorific,
} from "@/shared/contract";
import { sampleContent } from "@/shared/sample";

function withPatch(patch: (c: InvitationContent) => InvitationContent) {
  return invitationContentSchema.safeParse(patch(structuredClone(sampleContent)));
}

function errorsOf(result: ReturnType<typeof withPatch>) {
  return result.success ? {} : fieldErrors(result.error);
}

describe("invitationContentSchema", () => {
  it("accepts the sample content", () => {
    expect(invitationContentSchema.safeParse(sampleContent).success).toBe(true);
  });

  it("reports nested field paths", () => {
    const result = withPatch((c) => ({ ...c, bride: { ...c.bride, nickname: "  " } }));
    expect(errorsOf(result)).toMatchObject({ "bride.nickname": "Wajib diisi" });
  });

  it("handles optional person address and enforces max length", () => {
    expect(withPatch((c) => ({ ...c, bride: { ...c.bride, address: "" } })).success).toBe(true);
    expect(withPatch((c) => ({ ...c, groom: { ...c.groom, address: "Jl. Merdeka No. 12" } })).success).toBe(true);
    const tooLong = withPatch((c) => ({ ...c, bride: { ...c.bride, address: "a".repeat(301) } }));
    expect(errorsOf(tooLong)).toHaveProperty("bride.address");
  });

  it("requires at least one event and end after start", () => {
    expect(errorsOf(withPatch((c) => ({ ...c, events: [] })))).toHaveProperty("events");
    const backwards = withPatch((c) => ({
      ...c,
      events: [{ ...c.events[0], end: "2027-06-12T07:00:00+07:00" }],
    }));
    expect(errorsOf(backwards)).toHaveProperty("events.0.end");
  });

  it("allows one event to start when another event ends", () => {
    const result = withPatch((c) => ({
      ...c,
      events: [
        { ...c.events[0], end: "2027-06-12T10:00:00+07:00" },
        { ...c.events[1], start: "2027-06-12T10:00:00+07:00" },
      ],
    }));
    expect(result.success).toBe(true);
  });

  it("rejects unsafe media URLs", () => {
    for (const bad of ["javascript:alert(1)", "//evil.test/x.jpg", "http://plain.test/x.jpg", "/\\evil.test/x.jpg", "/a b.jpg"]) {
      expect(errorsOf(withPatch((c) => ({ ...c, coverPhoto: bad })))).toHaveProperty("coverPhoto");
    }
    for (const ok of ["", "/images/a.jpg", "https://cdn.test/a.jpg"]) {
      expect(withPatch((c) => ({ ...c, coverPhoto: ok })).success).toBe(true);
    }
  });

  it("validates instagram handles and account numbers", () => {
    expect(errorsOf(withPatch((c) => ({ ...c, groom: { ...c.groom, instagram: "@Bad Handle" } })))).toHaveProperty(
      "groom.instagram",
    );
    const badNumber = withPatch((c) => ({
      ...c,
      gift: { ...c.gift, accounts: [{ ...c.gift.accounts[0], number: "12ab" }] },
    }));
    expect(errorsOf(badNumber)).toHaveProperty("gift.accounts.0.number");
  });

  it("allows hiding shipping with null", () => {
    expect(withPatch((c) => ({ ...c, gift: { ...c.gift, shipping: null } })).success).toBe(true);
  });

  it("rejects malformed event dates", () => {
    const result = withPatch((c) => ({ ...c, events: [{ ...c.events[0], start: "12/06/2027" }] }));
    expect(errorsOf(result)).toHaveProperty("events.0.start");
  });

  it("accepts custom cover greeting or defaults to Kepada Yth.", () => {
    expect(withPatch((c) => ({ ...c, coverGreeting: "Invitation to" })).success).toBe(true);
    expect(withPatch((c) => ({ ...c, coverGreeting: "" })).success).toBe(true);
  });
});

describe("helpers", () => {
  it("orders the couple by headline order", () => {
    expect(coupleLabel(sampleContent)).toBe("Cahya & Wahyu");
    expect(couplePair({ ...sampleContent, headlineOrder: "groom-first" })[0].nickname).toBe("Wahyu");
  });

  it("converts between ISO and local wall-clock input", () => {
    expect(toLocalInput("2027-06-12T08:00:00+07:00", "Asia/Jakarta")).toBe("2027-06-12T08:00");
    expect(toLocalInput("2027-06-12T08:00:00+07:00", "Asia/Jayapura")).toBe("2027-06-12T10:00");
    expect(fromLocalInput("2027-06-12T08:00", "Asia/Makassar")).toBe("2027-06-12T08:00:00+08:00");
    expect(toLocalInput("bukan tanggal", "Asia/Jakarta")).toBe("");
    expect(fromLocalInput("", "Asia/Jakarta")).toBe("");
  });

  it("keeps only the first error per path", () => {
    const result = invitationContentSchema.safeParse({ ...sampleContent, defaultGuest: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).defaultGuest).toBe("Wajib diisi");
  });
});

describe("music and ceremonies", () => {
  it("plays the template's default song when no song is uploaded", () => {
    expect(musicSource({ music: "", musicOff: false })).toBe(DEFAULT_MUSIC);
  });

  it("plays the uploaded song", () => {
    expect(musicSource({ music: "https://x.supabase.co/lagu.mp3", musicOff: false })).toBe("https://x.supabase.co/lagu.mp3");
  });

  it("plays nothing when music is turned off, even with an uploaded song", () => {
    expect(musicSource({ music: "https://x.supabase.co/lagu.mp3", musicOff: true })).toBe("");
  });

  it("accepts content saved before musicOff and ceremonies existed", () => {
    const { musicOff: _musicOff, ceremonies: _ceremonies, ...legacy } = sampleContent;
    const parsed = invitationContentSchema.parse(legacy);
    expect(parsed.musicOff).toBe(false);
    expect(parsed.ceremonies).toEqual([]);
  });

  it("fills the new keys on raw database content", () => {
    const { musicOff: _musicOff, ceremonies: _ceremonies, ...legacy } = sampleContent;
    const filled = withContentDefaults(legacy as InvitationContent);
    expect(filled.musicOff).toBe(false);
    expect(filled.ceremonies).toEqual([]);
    expect(withContentDefaults(sampleContent).ceremonies).toBe(sampleContent.ceremonies);
  });

  it("requires a name for each ceremony", () => {
    const result = invitationContentSchema.safeParse({ ...sampleContent, ceremonies: [{ name: "", description: "x" }] });
    expect(result.success).toBe(false);
  });
});

describe("template default song", () => {
  it("lets Javanese templates fall back to gamelan instead of the general song", () => {
    expect(musicSource({ music: "", musicOff: false }, GAMELAN_MUSIC)).toBe(GAMELAN_MUSIC);
    expect(musicSource({ music: "https://x.supabase.co/lagu.mp3", musicOff: false }, GAMELAN_MUSIC)).toBe("https://x.supabase.co/lagu.mp3");
    expect(musicSource({ music: "", musicOff: true }, GAMELAN_MUSIC)).toBe("");
  });
});

describe("withHonorific", () => {
  it("adds Bapak/Ibu to a bare name", () => {
    expect(withHonorific("Hendra Wijaya", "Bapak")).toBe("Bapak Hendra Wijaya");
    expect(withHonorific("  Ratna Sari ", "Ibu")).toBe("Ibu Ratna Sari");
  });

  it("keeps a title the admin already typed", () => {
    for (const name of ["Bapak Hendra", "bpk. Hendra", "Alm. Hendra", "Almh. Ratna", "H. Hendra", "Hj. Ratna", "Ny. Ratna", "Dr. Hendra", "Ibu Ratna"]) {
      expect(withHonorific(name, "Bapak")).toBe(name);
    }
  });

  it("does not mistake names that merely start with the same letters", () => {
    expect(withHonorific("Haris", "Bapak")).toBe("Bapak Haris");
    expect(withHonorific("Ibnu", "Bapak")).toBe("Bapak Ibnu");
    expect(withHonorific("Drajat", "Bapak")).toBe("Bapak Drajat");
  });

  it("leaves an empty name empty", () => {
    expect(withHonorific("", "Ibu")).toBe("");
  });
});
