import { describe, expect, it } from "vitest";
import { CHAPTERS, chapterIndex, toRoman } from "@/lib/chapters";

describe("toRoman", () => {
  it.each([
    [1, "I"],
    [4, "IV"],
    [8, "VIII"],
    [9, "IX"],
    [14, "XIV"],
    [39, "XXXIX"],
  ])("converts %i to %s", (n, roman) => {
    expect(toRoman(n)).toBe(roman);
  });

  it("returns an empty string for zero or negatives", () => {
    expect(toRoman(0)).toBe("");
    expect(toRoman(-3)).toBe("");
  });
});

describe("chapterIndex", () => {
  it("finds chapters by id and returns -1 otherwise", () => {
    expect(chapterIndex("pembuka")).toBe(0);
    expect(chapterIndex("penutup")).toBe(CHAPTERS.length - 1);
    expect(chapterIndex(null)).toBe(-1);
    expect(chapterIndex("tidak-ada")).toBe(-1);
  });

  it("has unique chapter ids", () => {
    expect(new Set(CHAPTERS.map((c) => c.id)).size).toBe(CHAPTERS.length);
  });
});
