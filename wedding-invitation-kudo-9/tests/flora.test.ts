import { describe, expect, it } from "vitest";
import { FLOWERS, flowerRings, PALETTES, seedPod, wisteriaFlorets, wisteriaHeight } from "@/lib/flora";

describe("flowerRings", () => {
  it("builds one ring per requested level with the flower's petal counts", () => {
    const rings = flowerRings("dahlia", "plum", 5);
    expect(rings.map((r) => r.angles.length)).toEqual([...FLOWERS.dahlia.counts]);
    expect(rings.map((r) => r.scale)).toEqual([...FLOWERS.dahlia.scales]);
  });

  it("clamps the ring count to 1…available levels", () => {
    expect(flowerRings("lotus", "lilac", 0)).toHaveLength(1);
    expect(flowerRings("lotus", "lilac", 99)).toHaveLength(FLOWERS.lotus.counts.length);
  });

  it("takes colours from the palette, outer ring first", () => {
    const [outer, second] = flowerRings("lotus", "apricot", 2);
    expect([outer.tip, outer.base]).toEqual([...PALETTES.apricot[0]]);
    expect([second.tip, second.base]).toEqual([...PALETTES.apricot[1]]);
  });

  it("is deterministic and keeps every angle within 0…360", () => {
    const a = flowerRings("dahlia", "moon", 5, 3);
    expect(flowerRings("dahlia", "moon", 5, 3)).toEqual(a);
    const angles = a.flatMap((ring) => ring.angles);
    expect(Math.min(...angles)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...angles)).toBeLessThan(360);
  });

  it("offsets alternate rings by half a petal so inner petals fill the gaps", () => {
    const [outer, second] = flowerRings("lotus", "lilac", 2, 0);
    const step = 360 / FLOWERS.lotus.counts[1];
    expect(second.angles[0] - outer.angles[0]).toBeCloseTo(step / 2 + 11, 2);
  });

  it("rotates differently for a different seed", () => {
    expect(flowerRings("lotus", "lilac", 1, 1)[0].angles[0]).not.toBe(flowerRings("lotus", "lilac", 1, 2)[0].angles[0]);
  });
});

describe("seedPod", () => {
  it("places dots evenly on a circle, the first at the top", () => {
    const dots = seedPod(4, 10);
    expect(dots).toHaveLength(4);
    expect(dots[0]).toEqual({ x: 0, y: -10 });
    expect(dots[1].x).toBeCloseTo(10, 5);
  });

  it("returns nothing for zero dots", () => {
    expect(seedPod(0)).toEqual([]);
  });
});

describe("wisteriaFlorets", () => {
  it("tapers: florets get smaller and darker towards the tip", () => {
    const florets = wisteriaFlorets(12, 0);
    expect(florets).toHaveLength(12);
    expect(florets[0].r).toBeGreaterThan(florets[11].r);
    expect(florets[0].tone).toBe(0);
    expect(florets[11].tone).toBe(3);
    for (let k = 1; k < florets.length; k++) expect(florets[k].y).toBeGreaterThan(florets[k - 1].y);
  });

  it("stays inside the 60-wide viewBox and the computed height", () => {
    const florets = wisteriaFlorets(16, 5);
    const height = wisteriaHeight(16);
    for (const f of florets) {
      expect(Math.abs(f.x) + f.r).toBeLessThanOrEqual(30);
      expect(f.y + f.r).toBeLessThanOrEqual(height);
    }
  });

  it("handles a single floret", () => {
    expect(wisteriaFlorets(1)).toEqual([{ x: expect.any(Number), y: 8, r: 9, tone: 0 }]);
  });
});
