import { describe, expect, it } from "vitest";
import { swayStyle, swayTiming } from "@/lib/sway";

describe("swayTiming", () => {
  it("is deterministic, so server and browser render the same style", () => {
    expect(swayTiming(7, 2, 8, 2)).toEqual(swayTiming(7, 2, 8, 2));
  });

  it("starts somewhere inside the cycle and keeps the duration in range", () => {
    for (let seed = 1; seed < 40; seed++) {
      const t = swayTiming(seed, seed % 5, 8, 2);
      expect(t.delay).toBeLessThanOrEqual(0);
      expect(t.delay).toBeGreaterThanOrEqual(-8);
      expect(t.duration).toBeGreaterThanOrEqual(8);
      expect(t.duration).toBeLessThanOrEqual(10);
    }
  });

  it("desynchronises different trees", () => {
    const delays = new Set([3, 8, 11, 23, 31].map((seed) => swayTiming(seed, 0, 8).delay));
    expect(delays.size).toBeGreaterThan(3);
  });
});

describe("swayStyle", () => {
  it("sets the pivot in viewBox units and the timing variables", () => {
    const style = swayStyle({ x: 150, y: 600 }, { delay: -2.5, duration: 8 }) as Record<string, string>;
    expect(style.transformOrigin).toBe("150px 600px");
    expect(style["--sway-delay"]).toBe("-2.5s");
    expect(style["--sway-dur"]).toBe("8s");
  });
});
