import { describe, expect, it } from "vitest";
import { LANTERN_PALETTE, LANTERN_VARIANTS, lanternGeometry, seededRandom, skyLanterns } from "@/lib/lanterns";

describe("seededRandom", () => {
  it("deterministik dan berada di [0, 1)", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    for (let i = 0; i < 200; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it("seed berbeda menghasilkan urutan berbeda", () => {
    expect(seededRandom(1)()).not.toBe(seededRandom(2)());
  });
});

describe("lanternGeometry", () => {
  it("membuat satu sisi per sudut yang tersebar rata", () => {
    const g = lanternGeometry(60, 78, 0.7, 6);
    expect(g.sides).toBe(6);
    expect(g.faces.map((f) => f.angle)).toEqual([0, 60, 120, 180, 240, 300]);
  });

  it("lebar sisi atas = 2·r·tan(π/n) sehingga tepi bertemu", () => {
    const g = lanternGeometry(100, 130, 0.7, 6);
    expect(g.faceWidth).toBeCloseTo(2 * 50 * Math.tan(Math.PI / 6), 1);
  });

  it("sisi condong ke dalam sesuai taper", () => {
    const g = lanternGeometry(100, 130, 0.7, 6);
    const drop = 50 - 35;
    expect(g.tilt).toBeCloseTo((Math.atan2(drop, 130) * 180) / Math.PI, 1);
    expect(g.faceHeight).toBeCloseTo(Math.hypot(130, drop), 1);
    expect(g.translateZ).toBeCloseTo(42.5, 1);
    expect(g.clipPath).toBe("polygon(0 0, 100% 0, 85% 100%, 15% 100%)");
  });

  it("taper 1 = prisma tegak tanpa kemiringan", () => {
    const g = lanternGeometry(80, 100, 1, 4);
    expect(g.tilt).toBe(0);
    expect(g.clipPath).toBe("polygon(0 0, 100% 0, 100% 100%, 0% 100%)");
  });

  it("menjaga batas masukan (minimal 3 sisi, taper dibatasi)", () => {
    expect(lanternGeometry(50, 60, 0.7, 1).sides).toBe(3);
    expect(lanternGeometry(50, 60, 5).tilt).toBe(0);
  });
});

describe("skyLanterns", () => {
  it("deterministik untuk seed yang sama", () => {
    expect(skyLanterns(10, 7)).toEqual(skyLanterns(10, 7));
    expect(skyLanterns(10, 7)).not.toEqual(skyLanterns(10, 8));
  });

  it("nilai berada dalam batas yang aman untuk tata letak", () => {
    const list = skyLanterns(30, 3, { minSize: 10, maxSize: 40, minDuration: 10, maxDuration: 30 });
    expect(list).toHaveLength(30);
    for (const l of list) {
      expect(l.left).toBeGreaterThanOrEqual(2);
      expect(l.left).toBeLessThanOrEqual(98);
      expect(l.top).toBeGreaterThanOrEqual(4);
      expect(l.top).toBeLessThanOrEqual(92);
      expect(l.size).toBeGreaterThanOrEqual(10);
      expect(l.size).toBeLessThanOrEqual(40);
      expect(l.duration).toBeGreaterThanOrEqual(10);
      expect(l.duration).toBeLessThanOrEqual(30);
      expect(l.delay).toBeLessThanOrEqual(0);
      expect(l.delay).toBeGreaterThanOrEqual(-l.duration);
      expect(LANTERN_VARIANTS).toContain(l.variant);
    }
  });

  it("lampion dekat lebih besar dan lebih cepat (paralaks)", () => {
    const list = skyLanterns(40, 5);
    const near = list.reduce((a, b) => (b.depth > a.depth ? b : a));
    const far = list.reduce((a, b) => (b.depth < a.depth ? b : a));
    expect(near.size).toBeGreaterThan(far.size);
    expect(near.duration).toBeLessThan(far.duration);
  });

  it("tersebar ke seluruh lebar, kiri ke kanan", () => {
    const lefts = skyLanterns(12, 9).map((l) => l.left);
    expect(Math.min(...lefts)).toBeLessThan(15);
    expect(Math.max(...lefts)).toBeGreaterThan(85);
  });

  it("jumlah nol atau negatif menghasilkan langit kosong", () => {
    expect(skyLanterns(0)).toEqual([]);
    expect(skyLanterns(-3)).toEqual([]);
  });

  it("setiap varian punya palet lengkap", () => {
    for (const v of LANTERN_VARIANTS) {
      expect(Object.keys(LANTERN_PALETTE[v]).sort()).toEqual(["bottom", "glow", "mid", "top"]);
    }
  });
});
