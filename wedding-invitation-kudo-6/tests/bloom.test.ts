import { describe, expect, it } from "vitest";
import { bloomRings, PALETTES } from "@/lib/bloom";

describe("bloomRings", () => {
  it("builds rings from outside in, each smaller with fewer petals", () => {
    const rings = bloomRings("blush");
    expect(rings).toHaveLength(5);
    for (let i = 1; i < rings.length; i++) {
      expect(rings[i].scale).toBeLessThan(rings[i - 1].scale);
      expect(rings[i].angles.length).toBeLessThan(rings[i - 1].angles.length);
    }
  });

  it("spaces petals evenly around the ring", () => {
    const [outer] = bloomRings("pearl");
    const step = 360 / outer.angles.length;
    outer.angles.slice(1).forEach((a, k) => expect(a - outer.angles[k]).toBeCloseTo(step, 1));
  });

  it("is deterministic per seed and varies between seeds", () => {
    expect(bloomRings("champagne", 5, 3)).toEqual(bloomRings("champagne", 5, 3));
    expect(bloomRings("champagne", 5, 3)[0].angles[0]).not.toBe(bloomRings("champagne", 5, 4)[0].angles[0]);
  });

  it("clamps the ring count and colours from the palette", () => {
    expect(bloomRings("blush", 99)).toHaveLength(5);
    expect(bloomRings("blush", 0)).toHaveLength(1);
    expect(bloomRings("blush", 3)[2].base).toBe(PALETTES.blush[2][1]);
  });
});
