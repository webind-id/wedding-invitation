import { describe, expect, it } from "vitest";
import { photoAt, photoPool, reelNumber } from "@/lib/photos";
import { sampleContent } from "@/shared/sample";

describe("photoPool", () => {
  it("collects gallery first, then main photos, without blanks or duplicates", () => {
    const pool = photoPool({
      ...sampleContent,
      moments: [
        { src: "/a.jpg", alt: "", shape: "square" },
        { src: "/a.jpg", alt: "", shape: "tall" },
      ],
      coverPhoto: "/cover.jpg",
      posterPhoto: "",
      bride: { ...sampleContent.bride, photo: "/cover.jpg" },
      groom: { ...sampleContent.groom, photo: "/groom.jpg" },
    });
    expect(pool).toEqual(["/a.jpg", "/cover.jpg", "/groom.jpg"]);
  });

  it("is empty when there are no photos", () => {
    const pool = photoPool({
      ...sampleContent,
      moments: [],
      coverPhoto: "",
      posterPhoto: "",
      bride: { ...sampleContent.bride, photo: "" },
      groom: { ...sampleContent.groom, photo: "" },
    });
    expect(pool).toEqual([]);
  });
});

describe("photoAt", () => {
  it("cycles through the pool, including negative indexes", () => {
    expect(photoAt(["a", "b", "c"], 4)).toBe("b");
    expect(photoAt(["a", "b", "c"], -1)).toBe("c");
    expect(photoAt([], 3)).toBe("");
  });
});

describe("reelNumber", () => {
  it("pads to two digits", () => {
    expect(reelNumber(1)).toBe("01");
    expect(reelNumber(12)).toBe("12");
  });
});
