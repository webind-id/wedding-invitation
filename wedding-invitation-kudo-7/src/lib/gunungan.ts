/**
 * Geometri gunungan (kayon) wayang kulit — murni & deterministik, tanpa DOM.
 *
 * Bidang gambar: 200 × 300 (lebar × tinggi). Puncak runcing di (100, 4),
 * badan melebar ke bawah, lalu alas datar tempat gapura berdiri. Semua bentuk
 * simetris kiri–kanan, seperti gunungan sungguhan.
 */

export const GUNUNGAN_WIDTH = 200;
export const GUNUNGAN_HEIGHT = 300;
const CENTER_X = GUNUNGAN_WIDTH / 2;

type Point = readonly [number, number];
type Segment = { kind: "M" | "L"; to: Point } | { kind: "C"; c1: Point; c2: Point; to: Point };

/** Lengkung sisi kanan dari puncak ke titik terlebar (dipakai juga untuk menghitung lebar). */
const RIGHT_CURVE: readonly [Point, Point, Point, Point] = [
  [100, 4],
  [116, 50],
  [168, 118],
  [189, 206],
];

const mirror = ([x, y]: Point): Point => [GUNUNGAN_WIDTH - x, y];

const OUTLINE: Segment[] = [
  { kind: "M", to: RIGHT_CURVE[0] },
  { kind: "C", c1: RIGHT_CURVE[1], c2: RIGHT_CURVE[2], to: RIGHT_CURVE[3] },
  { kind: "C", c1: [196, 236], c2: [190, 256], to: [172, 264] },
  { kind: "L", to: [152, 270] },
  { kind: "L", to: [152, 296] },
  { kind: "L", to: mirror([152, 296]) },
  { kind: "L", to: mirror([152, 270]) },
  { kind: "L", to: mirror([172, 264]) },
  { kind: "C", c1: mirror([190, 256]), c2: mirror([196, 236]), to: mirror(RIGHT_CURVE[3]) },
  { kind: "C", c1: mirror(RIGHT_CURVE[2]), c2: mirror(RIGHT_CURVE[1]), to: RIGHT_CURVE[0] },
];

const fmt = (n: number) => String(Number(n.toFixed(4)));

/**
 * Garis luar gunungan sebagai atribut `d`. Skala default = koordinat bidang 200 × 300;
 * `gununganOutline(1 / 200, 1 / 300)` menghasilkan versi 0–1 untuk
 * `clipPathUnits="objectBoundingBox"` (bingkai foto berbentuk gunungan).
 */
export function gununganOutline(scaleX = 1, scaleY = 1): string {
  const p = ([x, y]: Point) => `${fmt(x * scaleX)} ${fmt(y * scaleY)}`;
  const body = OUTLINE.map((s) => (s.kind === "C" ? `C${p(s.c1)} ${p(s.c2)} ${p(s.to)}` : `${s.kind}${p(s.to)}`));
  return `${body.join(" ")}Z`;
}

function bezier(t: number, a: number, b: number, c: number, d: number): number {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

/**
 * Setengah lebar badan gunungan pada ketinggian y (0 di puncak, maks. di y = 206).
 * Lengkung sisi monoton terhadap y, jadi cukup dicari dengan bagi dua.
 */
export function halfWidthAt(y: number): number {
  const [p0, p1, p2, p3] = RIGHT_CURVE;
  if (y <= p0[1]) return 0;
  if (y >= p3[1]) return p3[0] - CENTER_X;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bezier(mid, p0[1], p1[1], p2[1], p3[1]) < y) lo = mid;
    else hi = mid;
  }
  const t = (lo + hi) / 2;
  return bezier(t, p0[0], p1[0], p2[0], p3[0]) - CENTER_X;
}

export interface Branch {
  /** Dahan + sulur melingkar di ujungnya. */
  d: string;
  leaf: { cx: number; cy: number; rx: number; ry: number; rotate: number };
  bud: { cx: number; cy: number; r: number };
}

export interface TreeOfLife {
  /** Batang yang meruncing ke atas. */
  trunk: string;
  branches: Branch[];
  /** Kuncup di puncak pohon. */
  crown: { cx: number; cy: number; r: number };
}

const TREE_BASE_Y = 214;
const TREE_TOP_Y = 46;
const BRANCH_REACH = 0.8;

/**
 * Pohon hayat (kalpataru) di dalam gunungan: batang di tengah, dahan
 * berpasangan kiri–kanan yang memendek ke atas mengikuti badan gunungan.
 */
export function treeOfLife(levels = 6): TreeOfLife {
  const count = Math.max(1, Math.floor(levels));
  const step = (TREE_BASE_Y - 30 - (TREE_TOP_Y + 24)) / Math.max(1, count - 1);
  const branches: Branch[] = [];

  for (let i = 0; i < count; i++) {
    const y0 = TREE_BASE_Y - 30 - i * step;
    const reach = halfWidthAt(y0 - 12) * BRANCH_REACH;
    for (const side of [-1, 1] as const) {
      const cx = CENTER_X + side * reach * 0.45;
      const cy = y0 + 4;
      const ex = CENTER_X + side * reach;
      const ey = y0 - reach * 0.32;
      const curl = Math.max(4, reach * 0.12);
      const d =
        `M${fmt(CENTER_X)} ${fmt(y0)} Q${fmt(cx)} ${fmt(cy)} ${fmt(ex)} ${fmt(ey)} ` +
        `q${fmt(side * curl * 0.9)} ${fmt(-curl * 1.1)} ${fmt(-side * curl * 0.4)} ${fmt(-curl * 1.4)}`;
      // Titik di t = 0.55 pada lengkung kuadrat, tempat daun menempel.
      const t = 0.55;
      const u = 1 - t;
      const lx = u * u * CENTER_X + 2 * u * t * cx + t * t * ex;
      const ly = u * u * y0 + 2 * u * t * cy + t * t * ey;
      branches.push({
        d,
        leaf: { cx: lx, cy: ly - 5, rx: 3 + reach * 0.07, ry: 1.6 + reach * 0.025, rotate: side * -28 },
        bud: { cx: ex - side * curl * 0.4, cy: ey - curl * 1.4, r: 1.8 + reach * 0.035 },
      });
    }
  }

  const trunk = `M${CENTER_X - 4} ${TREE_BASE_Y} Q${CENTER_X - 1.6} ${(TREE_BASE_Y + TREE_TOP_Y) / 2} ${CENTER_X} ${TREE_TOP_Y} Q${CENTER_X + 1.6} ${(TREE_BASE_Y + TREE_TOP_Y) / 2} ${CENTER_X + 4} ${TREE_BASE_Y}Z`;
  return { trunk, branches, crown: { cx: CENTER_X, cy: TREE_TOP_Y - 5, r: 4.5 } };
}
