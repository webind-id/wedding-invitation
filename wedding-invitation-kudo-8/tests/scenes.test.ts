import { describe, expect, it } from "vitest";
import { MOUNTAINS } from "@/lib/mountains";
import { photoCredits, SCENES, SUMMIT_SCENE, trailScenes } from "@/lib/scenes";

describe("SCENES", () => {
  it("points every scene at a local image with an object-position focus", () => {
    for (const scene of Object.values(SCENES)) {
      expect(scene.src).toMatch(/^\/images\/.+\.webp$/);
      expect(scene.alt).not.toBe("");
      expect(scene.focus).toMatch(/%/);
      if (scene.mountain) expect(MOUNTAINS[scene.mountain]).toBeDefined();
      if (scene.wide) {
        expect(scene.wide.src).toMatch(/^\/images\/.+\.webp$/);
        expect(scene.wide.credit.license).toMatch(/^CC/);
      }
    }
  });

  it("gives the portrait-only owner photos a credited wide version for desktop", () => {
    expect(SCENES.prau.wide).toBeDefined();
    expect(SCENES.merbabu.wide).toBeDefined();
  });

  it("covers all six mountains across the film", () => {
    const covered = new Set(Object.values(SCENES).map((s) => s.mountain));
    for (const id of ["prau", "sindoro", "sumbing", "merbabu", "lawu", "slamet"] as const) expect(covered.has(id)).toBe(true);
  });
});

describe("trailScenes", () => {
  it("cycles the trail stops and always ends at the summit", () => {
    expect(trailScenes(4)).toEqual(["merbabu-trail", "merbabu-sabana", "merbabu", SUMMIT_SCENE]);
    expect(trailScenes(6)).toEqual(["merbabu-trail", "merbabu-sabana", "merbabu", "merbabu-trail", "merbabu-sabana", SUMMIT_SCENE]);
  });

  it("handles one and zero chapters", () => {
    expect(trailScenes(1)).toEqual([SUMMIT_SCENE]);
    expect(trailScenes(0)).toEqual([]);
  });
});

describe("photoCredits", () => {
  it("lists every credited photo once with an https source and a licence", () => {
    const credits = photoCredits();
    expect(credits.length).toBeGreaterThanOrEqual(10);
    expect(credits.some((c) => c.artist === "Van Monlak")).toBe(true);
    expect(new Set(credits.map((c) => c.source)).size).toBe(credits.length);
    for (const c of credits) {
      expect(c.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(c.license).toMatch(/^CC/);
      expect(c.artist).not.toBe("");
    }
  });
});
