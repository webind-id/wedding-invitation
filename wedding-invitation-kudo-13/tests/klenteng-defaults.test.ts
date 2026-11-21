import { describe, expect, it } from "vitest";
import { isStockVerse, klentengDemoContent, withKlentengDefaults } from "@/lib/klenteng-defaults";
import { sampleContent } from "@/shared/sample";

describe("withKlentengDefaults", () => {
  it("drops the untouched stock QS. Ar-Rum verse and Islamic intro", () => {
    const out = withKlentengDefaults(sampleContent);
    expect(out.verse).toEqual({ arabic: "", translation: "", source: "" });
    expect(out.invitationIntro).toBe("");
    expect(isStockVerse(sampleContent.verse)).toBe(true);
  });

  it("keeps texts the admin wrote", () => {
    const verse = { arabic: "", translation: "Kasih itu sabar", source: "1 Korintus 13:4" };
    const out = withKlentengDefaults({ ...sampleContent, verse, invitationIntro: "Dengan sukacita kami mengundang Anda." });
    expect(out.verse).toEqual(verse);
    expect(out.invitationIntro).toBe("Dengan sukacita kami mengundang Anda.");
    // Ayat Ar-Rum yang terjemahannya diubah admin tetap dianggap bawaan hanya bila teks Arab & sumber sama persis.
    expect(isStockVerse({ ...sampleContent.verse, source: "Ar-Rum 21" })).toBe(false);
  });

  it("does not mutate the shared sample", () => {
    withKlentengDefaults(sampleContent);
    expect(sampleContent.verse.source).toBe("QS. Ar-Rum : 21");
  });
});

describe("klentengDemoContent", () => {
  it("uses klenteng wording for the demo", () => {
    expect(klentengDemoContent.verse.arabic).toBe("");
    expect(klentengDemoContent.events.map((e) => e.name)).not.toContain("Akad Nikah");
    expect(klentengDemoContent.events[0].name).toBe("Pemberkatan Pernikahan");
  });
});
