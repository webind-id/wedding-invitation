import { describe, expect, it } from "vitest";
import { bamboo, bush, petalShower, plumTree, seededRandom } from "@/lib/scenery";

describe("seededRandom", () => {
  it("repeats the same sequence for the same seed", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe("plumTree", () => {
  it("is deterministic, so server and browser render the same tree", () => {
    expect(plumTree(3, 8)).toEqual(plumTree(3, 8));
  });

  it("grows from the bottom centre and thins out toward the twigs", () => {
    const tree = plumTree(3, 8);
    expect(tree.branches[0].d.startsWith("M150 600Q")).toBe(true);
    expect(tree.branches[0].width).toBe(17);
    expect(Math.min(...tree.branches.map((b) => b.width))).toBeGreaterThanOrEqual(1.2);
    expect(tree.branches.length).toBeGreaterThan(30);
  });

  it("puts blossoms on the tree, some of them red", () => {
    const { blossoms } = plumTree(8, 6);
    expect(blossoms.length).toBeGreaterThan(40);
    expect(blossoms.some((b) => b.isRed)).toBe(true);
    expect(blossoms.some((b) => !b.isRed)).toBe(true);
  });
});

describe("bamboo", () => {
  it("has five stalks rooted at the bottom, with nodes and leaves", () => {
    const grove = bamboo(4);
    expect(grove.stalks).toHaveLength(5);
    for (const stalk of grove.stalks) {
      expect(stalk.d).toMatch(/^M[\d.]+ 600 Q/);
      expect(stalk.nodes.length).toBeGreaterThan(0);
    }
    expect(grove.stalks.some((s) => s.leaves.length > 0)).toBe(true);
  });

  it("is deterministic", () => {
    expect(bamboo(12)).toEqual(bamboo(12));
  });
});

describe("bush", () => {
  it("puts more blossoms and flowers on foreground bushes", () => {
    expect(bush(5, "mid").dots).toHaveLength(320);
    expect(bush(14, "fg").dots).toHaveLength(520);
    expect(bush(5, "mid").flowers).toHaveLength(9);
    expect(bush(14, "fg").flowers).toHaveLength(16);
  });

  it("paints darker blossoms first so lighter ones sit on top", () => {
    const palette = ["#FBE3E3", "#F7C4C9", "#EA97A3", "#D9667A", "#B23A4E", "#7E1E2E"];
    const ranks = bush(9, "mid").dots.map((d) => palette.indexOf(d.color));
    expect(ranks.every((rank) => rank >= 0)).toBe(true);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
  });
});

describe("petalShower", () => {
  it("returns the requested number of drops with staggered delays", () => {
    const drops = petalShower(12, 1);
    expect(drops).toHaveLength(12);
    for (let i = 1; i < drops.length; i++) expect(drops[i].delay).toBeGreaterThan(drops[i - 1].delay);
    expect(new Set(drops.map((d) => d.kind)).size).toBe(2);
  });
});
