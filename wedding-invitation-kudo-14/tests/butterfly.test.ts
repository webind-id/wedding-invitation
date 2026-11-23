import { describe, expect, it } from "vitest";
import { headingDeg, legSeconds, nextPoint, seededRandom, startPoint, type FlightArea } from "@/lib/butterfly";

const AREA: FlightArea = { x0: 0.1, x1: 0.9, y0: 0.3, y1: 0.8 };

const inside = (p: { x: number; y: number }, a: FlightArea) => p.x >= a.x0 && p.x <= a.x1 && p.y >= a.y0 && p.y <= a.y1;

describe("seededRandom", () => {
  it("returns the same sequence for the same seed", () => {
    const a = seededRandom(7);
    const b = seededRandom(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const r = seededRandom(3);
    for (let i = 0; i < 500; i++) {
      const n = r();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe("startPoint", () => {
  it("is deterministic and inside the area", () => {
    expect(startPoint(5, AREA)).toEqual(startPoint(5, AREA));
    for (let seed = 1; seed < 50; seed++) expect(inside(startPoint(seed, AREA), AREA)).toBe(true);
  });

  it("differs between seeds", () => {
    expect(startPoint(1, AREA)).not.toEqual(startPoint(2, AREA));
  });
});

describe("nextPoint", () => {
  it("always stays inside the area", () => {
    const r = seededRandom(11);
    let p = startPoint(11, AREA);
    for (let i = 0; i < 200; i++) {
      p = nextPoint(r, p, AREA);
      expect(inside(p, AREA)).toBe(true);
    }
  });

  it("usually moves a visible but bounded distance", () => {
    const r = seededRandom(21);
    let p = startPoint(21, AREA);
    let bounded = 0;
    for (let i = 0; i < 100; i++) {
      const q = nextPoint(r, p, AREA);
      const hop = Math.hypot(q.x - p.x, q.y - p.y);
      if (hop >= 0.11 && hop <= 0.43) bounded++;
      p = q;
    }
    expect(bounded).toBeGreaterThan(90);
  });

  it("still returns a point inside a tiny area", () => {
    const tiny: FlightArea = { x0: 0.5, x1: 0.52, y0: 0.5, y1: 0.52 };
    const q = nextPoint(seededRandom(1), { x: 0.51, y: 0.51 }, tiny);
    expect(inside(q, tiny)).toBe(true);
  });
});

describe("headingDeg", () => {
  const o = { x: 0, y: 0 };
  it("points the head (image top) along the flight direction", () => {
    expect(headingDeg(o, { x: 0, y: -1 })).toBe(0); // ke atas
    expect(headingDeg(o, { x: 1, y: 0 })).toBe(90); // ke kanan
    expect(headingDeg(o, { x: 0, y: 1 })).toBe(180); // ke bawah
    expect(headingDeg(o, { x: -1, y: 0 })).toBe(270); // ke kiri (setara -90°)
  });

  it("returns 0 when not moving", () => {
    expect(headingDeg(o, o)).toBe(0);
  });
});

describe("legSeconds", () => {
  it("scales with distance and is clamped", () => {
    expect(legSeconds(0)).toBe(1.4);
    expect(legSeconds(140)).toBe(2);
    expect(legSeconds(10_000)).toBe(4.2);
  });
});
