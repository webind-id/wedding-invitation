import { describe, expect, it } from "vitest";
import { bush, melatiShower, palm, seededRandom } from "@/lib/scenery";

describe("seededRandom", () => {
  it("repeats the same sequence for the same seed", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const r = seededRandom(7);
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("palm", () => {
  it("is deterministic, so server and browser render the same tree", () => {
    expect(palm(3, "near", 34)).toEqual(palm(3, "near", 34));
  });

  it("has 12 fronds rooted at the crown, which leans toward `lean`", () => {
    const tree = palm(11, "far", -26);
    expect(tree.fronds).toHaveLength(12);
    expect(tree.crown.x).toBe(150 - 26);
    for (const frond of tree.fronds) expect(frond.rib.startsWith(`M${tree.crown.x} ${tree.crown.y}Q`)).toBe(true);
    expect(tree.trunk.startsWith("M150 600 Q")).toBe(true);
  });

  it("uses the far palette for far trees", () => {
    expect(palm(11, "far", 0).trunkColor).toBe("#7A5636");
    expect(palm(11, "near", 0).trunkColor).toBe("#3A2618");
  });
});

describe("bush", () => {
  it("is deterministic", () => {
    expect(bush(5, "mid")).toEqual(bush(5, "mid"));
  });

  it("puts more blossoms and flowers on foreground bushes", () => {
    const mid = bush(5, "mid");
    const fg = bush(14, "fg");
    expect(mid.dots).toHaveLength(320);
    expect(fg.dots).toHaveLength(520);
    expect(mid.flowers).toHaveLength(8);
    expect(fg.flowers).toHaveLength(14);
    expect(mid.masses).toHaveLength(5);
    expect(fg.masses).toHaveLength(6);
  });

  it("paints darker blossoms first so lighter ones sit on top", () => {
    const { dots } = bush(9, "mid");
    const palette = ["#FDEEF2", "#F4B8C8", "#EC97AF", "#D95B82", "#B4466B", "#7E2F4C"];
    const ranks = dots.map((d) => palette.indexOf(d.color));
    expect(ranks.every((rank) => rank >= 0)).toBe(true);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
  });
});

describe("melatiShower", () => {
  it("returns the requested number of drops with staggered delays", () => {
    const drops = melatiShower(10, 1);
    expect(drops).toHaveLength(10);
    for (let i = 1; i < drops.length; i++) expect(drops[i].delay).toBeGreaterThan(drops[i - 1].delay);
    for (const d of drops) {
      expect(d.left).toBeGreaterThanOrEqual(0);
      expect(d.left).toBeLessThanOrEqual(100);
    }
  });
});
