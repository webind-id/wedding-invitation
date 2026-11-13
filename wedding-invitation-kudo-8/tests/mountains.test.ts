import { describe, expect, it } from "vitest";
import { formatCoordinate, formatElevation, MOUNTAIN_ORDER, MOUNTAINS, mountainAt } from "@/lib/mountains";

describe("MOUNTAINS", () => {
  it("covers the six Central/East Java peaks in display order", () => {
    expect(MOUNTAIN_ORDER).toEqual(["prau", "sindoro", "sumbing", "merbabu", "lawu", "slamet"]);
    for (const id of MOUNTAIN_ORDER) {
      const m = MOUNTAINS[id];
      expect(m.id).toBe(id);
      expect(m.elevation).toBeGreaterThan(2000);
      expect(m.lat).toBeLessThan(0);
      expect(m.basecamp).not.toBe("");
      expect(m.summit).not.toBe("");
    }
  });

  it("knows Slamet is the highest and Prau the lowest", () => {
    const sorted = [...MOUNTAIN_ORDER].sort((a, b) => MOUNTAINS[a].elevation - MOUNTAINS[b].elevation);
    expect(sorted[0]).toBe("prau");
    expect(sorted.at(-1)).toBe("slamet");
  });
});

describe("formatCoordinate", () => {
  it("writes degrees and minutes with Indonesian hemisphere letters", () => {
    expect(formatCoordinate(-7.187, 109.923)).toBe("7°11′ LS · 109°55′ BT");
  });

  it("handles the northern/western hemispheres and rounds minutes up to the next degree", () => {
    expect(formatCoordinate(1.5, -0.25)).toBe("1°30′ LU · 0°15′ BB");
    expect(formatCoordinate(-6.9999, 110)).toBe("7°00′ LS · 110°00′ BT");
  });
});

describe("formatElevation", () => {
  it("uses Indonesian thousand separators", () => {
    expect(formatElevation(3428)).toBe("3.428 mdpl");
    expect(formatElevation(980.4)).toBe("980 mdpl");
  });
});

describe("mountainAt", () => {
  it("cycles through the order, including negative indexes", () => {
    expect(mountainAt(0).id).toBe("prau");
    expect(mountainAt(7).id).toBe("sindoro");
    expect(mountainAt(-1).id).toBe("slamet");
  });
});
