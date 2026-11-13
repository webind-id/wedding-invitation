import { describe, expect, it } from "vitest";
import { altitudeAt, trailCheckpoints } from "@/lib/trail";

describe("trailCheckpoints", () => {
  it("starts at basecamp, numbers the posts, and ends at the summit", () => {
    const cps = trailCheckpoints(4, { base: 1800, summit: 3145, summitName: "Kenteng Songo" });
    expect(cps.map((c) => c.label)).toEqual(["Basecamp", "Pos 1", "Pos 2", "Kenteng Songo"]);
    expect(cps[0].elevation).toBe(1800);
    expect(cps[3].elevation).toBe(3145);
    expect(cps.map((c) => c.isSummit)).toEqual([false, false, false, true]);
  });

  it("climbs monotonically and rounds intermediate posts to 10 m", () => {
    const cps = trailCheckpoints(6, { base: 1500, summit: 3428, summitName: "Puncak" });
    for (let i = 1; i < cps.length; i++) expect(cps[i].elevation).toBeGreaterThan(cps[i - 1].elevation);
    for (const c of cps.slice(1, -1)) expect(c.elevation % 10).toBe(0);
  });

  it("treats a single chapter as the summit and zero chapters as an empty trail", () => {
    expect(trailCheckpoints(1, { base: 1500, summit: 3000, summitName: "Puncak" })).toEqual([
      { label: "Puncak", elevation: 3000, isSummit: true },
    ]);
    expect(trailCheckpoints(0, { base: 1500, summit: 3000, summitName: "Puncak" })).toEqual([]);
  });
});

describe("altitudeAt", () => {
  it("interpolates between base and summit and clamps progress", () => {
    expect(altitudeAt(0, 1000, 3000)).toBe(1000);
    expect(altitudeAt(0.5, 1000, 3000)).toBe(2000);
    expect(altitudeAt(2, 1000, 3000)).toBe(3000);
    expect(altitudeAt(-1, 1000, 3000)).toBe(1000);
  });
});
