import { describe, expect, it } from "vitest";
import { GUNUNGAN_HEIGHT, GUNUNGAN_WIDTH, gununganOutline, halfWidthAt, treeOfLife } from "@/lib/gunungan";

const numbersIn = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("gununganOutline", () => {
  it("returns a closed path that starts at the peak", () => {
    const d = gununganOutline();
    expect(d.startsWith("M100 4")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
  });

  it("stays inside the 200 × 300 canvas", () => {
    const nums = numbersIn(gununganOutline());
    for (let i = 0; i < nums.length; i += 2) {
      expect(nums[i]).toBeGreaterThanOrEqual(0);
      expect(nums[i]).toBeLessThanOrEqual(GUNUNGAN_WIDTH);
      expect(nums[i + 1]).toBeGreaterThanOrEqual(0);
      expect(nums[i + 1]).toBeLessThanOrEqual(GUNUNGAN_HEIGHT);
    }
  });

  it("normalises to 0–1 for objectBoundingBox clip paths", () => {
    const nums = numbersIn(gununganOutline(1 / GUNUNGAN_WIDTH, 1 / GUNUNGAN_HEIGHT));
    expect(Math.max(...nums)).toBeLessThanOrEqual(1);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(0);
  });

  it("is symmetric left to right", () => {
    const nums = numbersIn(gununganOutline());
    const xs = nums.filter((_, i) => i % 2 === 0);
    const mirrored = xs.map((x) => GUNUNGAN_WIDTH - x).sort((a, b) => a - b);
    expect(mirrored).toEqual([...xs].sort((a, b) => a - b));
  });
});

describe("halfWidthAt", () => {
  it("is zero at the peak and widest at the shoulder", () => {
    expect(halfWidthAt(0)).toBe(0);
    expect(halfWidthAt(4)).toBe(0);
    expect(halfWidthAt(206)).toBeCloseTo(89, 5);
    expect(halfWidthAt(280)).toBeCloseTo(89, 5);
  });

  it("grows monotonically from top to shoulder", () => {
    let previous = 0;
    for (let y = 10; y <= 206; y += 8) {
      const w = halfWidthAt(y);
      expect(w).toBeGreaterThanOrEqual(previous);
      previous = w;
    }
  });
});

describe("treeOfLife", () => {
  it("creates a mirrored pair of branches per level", () => {
    const tree = treeOfLife(6);
    expect(tree.branches).toHaveLength(12);
    for (let i = 0; i < tree.branches.length; i += 2) {
      const [left, right] = [tree.branches[i], tree.branches[i + 1]];
      expect(left.bud.cx + right.bud.cx).toBeCloseTo(GUNUNGAN_WIDTH, 5);
      expect(left.bud.cy).toBeCloseTo(right.bud.cy, 5);
      expect(left.leaf.rotate).toBe(-right.leaf.rotate);
    }
  });

  it("shortens branches toward the top", () => {
    const tree = treeOfLife(5);
    const reach = tree.branches.filter((_, i) => i % 2 === 1).map((b) => b.bud.cx - 100);
    for (let i = 1; i < reach.length; i++) expect(reach[i]).toBeLessThan(reach[i - 1]);
  });

  it("keeps every bud inside the gunungan body", () => {
    for (const b of treeOfLife(6).branches) {
      expect(Math.abs(b.bud.cx - 100)).toBeLessThan(halfWidthAt(b.bud.cy + 12) + 1);
    }
  });

  it("is deterministic and tolerates odd input", () => {
    expect(treeOfLife(4)).toEqual(treeOfLife(4));
    expect(treeOfLife(0).branches).toHaveLength(2);
    expect(treeOfLife(3.7).branches).toHaveLength(6);
  });
});
