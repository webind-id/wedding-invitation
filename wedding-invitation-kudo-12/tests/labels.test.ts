import { describe, expect, it } from "vitest";
import { ceremonyIcon, coupleHashtag, eventTimeLabel, panelNameSize, usesIslamicGreeting } from "@/lib/labels";

const content = { timeZone: "Asia/Jakarta" as const };

describe("eventTimeLabel", () => {
  it("shows start and end with the zone", () => {
    const event = { start: "2027-02-14T08:00:00+07:00", end: "2027-02-14T10:00:00+07:00", untilFinished: false };
    expect(eventTimeLabel(event, content, "WIB")).toBe("08.00 – 10.00 WIB");
  });

  it("shows 's.d. selesai' when the event runs until finished", () => {
    const event = { start: "2027-02-14T11:00:00+07:00", end: "2027-02-14T14:00:00+07:00", untilFinished: true };
    expect(eventTimeLabel(event, content, "WIB")).toBe("11.00 WIB s.d. selesai");
  });
});

describe("coupleHashtag", () => {
  it("joins the nicknames with the Javanese 'lan'", () => {
    expect(coupleHashtag("Sekar", "Bayu")).toBe("#SekarLanBayu");
  });

  it("drops spaces and punctuation", () => {
    expect(coupleHashtag("Ayu Sri", "Dimas-P.")).toBe("#AyuSriLanDimasP");
  });

  it("returns nothing when a name is empty", () => {
    expect(coupleHashtag("", "Bayu")).toBe("");
  });
});

describe("panelNameSize", () => {
  it("shrinks long names so they stay on one line", () => {
    expect(panelNameSize("Bayu")).toBe(30);
    expect(panelNameSize("Larasati")).toBe(25);
    expect(panelNameSize("Anastasiaa")).toBe(21);
    expect(panelNameSize("Kusumawardani")).toBe(18);
  });
});

describe("usesIslamicGreeting", () => {
  it("is on only when an Arabic verse is set", () => {
    expect(usesIslamicGreeting({ verse: { arabic: "وَمِنْ آيَاتِهِ", translation: "", source: "" } })).toBe(true);
    expect(usesIslamicGreeting({ verse: { arabic: "  ", translation: "Kasih itu sabar", source: "1 Korintus 13:4" } })).toBe(false);
  });
});

describe("ceremonyIcon", () => {
  it("matches well-known Javanese rites by name", () => {
    expect(ceremonyIcon("Siraman", 3)).toBe("water");
    expect(ceremonyIcon("Malam Midodareni", 0)).toBe("moon");
    expect(ceremonyIcon("Panggih", 0)).toBe("rings");
    expect(ceremonyIcon("Sungkeman", 0)).toBe("hand");
  });

  it("cycles through the icons for unknown names", () => {
    expect(ceremonyIcon("Pingitan", 0)).toBe("water");
    expect(ceremonyIcon("Seserahan", 5)).toBe("moon");
  });
});
