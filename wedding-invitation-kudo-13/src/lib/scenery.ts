/**
 * Pepohonan adegan klenteng (pohon mei, rumpun bambu, semak bunga), dibangkitkan dari seed.
 * Murni & deterministik: seed yang sama → bentuk yang sama di server dan browser, jadi tidak ada
 * hydration mismatch. Semua angka dibulatkan 1 desimal. Port dari undangan-klenteng.html.
 */

/** PRNG mulberry32 — cepat dan cukup acak untuk dekorasi. */
export function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => Number(n.toFixed(1));

export const TREE_VIEWBOX = { width: 300, height: 600 } as const;
export const BUSH_VIEWBOX = 400;

export interface Blossom {
  x: number;
  y: number;
  size: number;
  /** Bunga mei merah (sisanya merah muda). */
  isRed: boolean;
}

export interface PlumTree {
  branches: { d: string; width: number }[];
  blossoms: Blossom[];
}

const PLUM_DEPTH = 5;

/** Pohon mei: cabang rekursif berkelok, kuntum di ranting-ranting kecil. `lean` dalam derajat. */
export function plumTree(seed: number, lean: number): PlumTree {
  const r = seededRandom(seed);
  const branches: PlumTree["branches"] = [];
  const blossoms: Blossom[] = [];

  function grow(x: number, y: number, ang: number, len: number, width: number, depth: number) {
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    const bend = (r() - 0.5) * len * 0.5;
    const qx = (x + ex) / 2 + Math.cos(ang + Math.PI / 2) * bend;
    const qy = (y + ey) / 2 + Math.sin(ang + Math.PI / 2) * bend;
    branches.push({ d: `M${f1(x)} ${f1(y)}Q${f1(qx)} ${f1(qy)} ${f1(ex)} ${f1(ey)}`, width: f1(width) });
    if (depth <= 3) {
      const count = depth <= 1 ? 4 : 2;
      for (let i = 0; i < count; i++) {
        const t = 0.35 + r() * 0.65;
        const u = 1 - t;
        blossoms.push({
          x: f1(u * u * x + 2 * u * t * qx + t * t * ex + (r() - 0.5) * 14),
          y: f1(u * u * y + 2 * u * t * qy + t * t * ey + (r() - 0.5) * 14),
          size: f1(10 + r() * 10),
          isRed: r() < 0.18,
        });
      }
    }
    if (depth === 0) return;
    const kids = depth > 3 ? 2 : r() < 0.5 ? 2 : 3;
    for (let i = 0; i < kids; i++) {
      const spread = (i - (kids - 1) / 2) * (0.55 + r() * 0.3) + (r() - 0.5) * 0.3;
      grow(ex, ey, ang + spread, len * (0.68 + r() * 0.12), Math.max(1.2, width * 0.66), depth - 1);
    }
  }

  grow(TREE_VIEWBOX.width / 2, TREE_VIEWBOX.height, ((-90 + lean) * Math.PI) / 180, 150, 17, PLUM_DEPTH);
  return { branches, blossoms };
}

export interface Bamboo {
  /** `base` = x pangkal batang (titik putar saat bergoyang). */
  stalks: { d: string; base: number; width: number; color: string; nodes: string[]; leaves: string[] }[];
}

const STALK_COLORS = ["#3A2A1C", "#4A3A26", "#2E241A"];

/** Rumpun bambu: lima batang condong, ruas emas samar, daun di bagian atas. */
export function bamboo(seed: number): Bamboo {
  const r = seededRandom(seed);
  const base = TREE_VIEWBOX.height;
  const stalks: Bamboo["stalks"] = [];
  for (let i = 0; i < 5; i++) {
    const x0 = 40 + i * 48 + r() * 20;
    const top = 40 + r() * 140;
    const lean = (r() - 0.3) * 40;
    const width = 7 + r() * 4;
    const nodes: string[] = [];
    const leaves: string[] = [];
    for (let y = 560; y > top + 20; y -= 46 + r() * 12) {
      const t = (base - y) / (base - top);
      const nx = x0 + lean * t * t;
      nodes.push(`M${f1(nx - width / 2 - 1)} ${f1(y)} H${f1(nx + width / 2 + 1)}`);
      if (t > 0.45) {
        for (let k = 0; k < 4; k++) {
          const dir = r() < 0.5 ? -1 : 1;
          const a = (dir < 0 ? 200 : -20) + (r() - 0.5) * 40;
          const len = 34 + r() * 26;
          const rad = (a * Math.PI) / 180;
          const ex = nx + Math.cos(rad) * len;
          const ey = y + Math.sin(rad) * len + 14;
          const mx = (nx + ex) / 2;
          const my = (y + ey) / 2;
          leaves.push(`M${f1(nx)} ${f1(y)}Q${f1(mx)} ${f1(my - 6)} ${f1(ex)} ${f1(ey)}Q${f1(mx)} ${f1(my + 3)} ${f1(nx)} ${f1(y)}Z`);
        }
      }
    }
    stalks.push({
      base: f1(x0),
      d: `M${f1(x0)} ${base} Q${f1(x0 + lean * 0.3)} ${f1((base + top) / 2)} ${f1(x0 + lean)} ${f1(top)}`,
      width: f1(width),
      color: STALK_COLORS[i % STALK_COLORS.length],
      nodes,
      leaves,
    });
  }
  return { stalks };
}

export type BushTone = "mid" | "fg";

const BUSH_TONES: Record<BushTone, { blossom: string[]; dark: string }> = {
  mid: { blossom: ["#FBE3E3", "#F7C4C9", "#EA97A3", "#D9667A", "#B23A4E", "#7E1E2E"], dark: "#3A0A0A" },
  fg: { blossom: ["#FFF1EC", "#FBD3D3", "#F2A8B2", "#E07788", "#C2485C", "#952838", "#5E1420"], dark: "#2A0505" },
};

export interface Bush {
  dark: string;
  branches: { d: string; width: number }[];
  masses: { cx: number; cy: number; r: number }[];
  /** Kuntum, diurutkan dari paling gelap (belakang) ke terang (depan). */
  dots: { cx: number; cy: number; r: number; color: string }[];
  flowers: Blossom[];
}

/** Semak bunga mei: gumpalan, ratusan kuntum bergradasi (terang di kiri-atas), bunga mei. */
export function bush(seed: number, tone: BushTone): Bush {
  const r = seededRandom(seed);
  const T = BUSH_TONES[tone];
  const isBig = tone === "fg";
  const blobs = Array.from({ length: isBig ? 6 : 5 }, () => ({
    x: 200 + (r() - 0.5) * 220,
    y: 210 + (r() - 0.3) * 150,
    r: 85 + r() * 70,
  }));

  const branches = Array.from({ length: 6 }, (_, i) => {
    const b = blobs[i % blobs.length];
    return {
      d: `M${f1(150 + r() * 100)} 420 Q${f1(b.x + (r() - 0.5) * 60)} ${f1(b.y + 90)} ${f1(b.x)} ${f1(b.y)}`,
      width: f1(5 + r() * 6),
    };
  });
  const masses = blobs.map((b) => ({ cx: f1(b.x), cy: f1(b.y + 8), r: f1(b.r * 0.92) }));

  const raw: { cx: number; cy: number; r: number; ci: number }[] = [];
  for (let i = 0; i < (isBig ? 520 : 320); i++) {
    const b = blobs[Math.floor(r() * blobs.length)];
    const ang = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * b.r;
    const x = b.x + Math.cos(ang) * rad;
    const y = b.y + Math.sin(ang) * rad;
    const shade = ((y - (b.y - b.r)) / (2 * b.r)) * 0.75 + ((x - (b.x - b.r)) / (2 * b.r)) * 0.2 + (r() - 0.5) * 0.5;
    const ci = Math.max(0, Math.min(T.blossom.length - 1, Math.floor(shade * T.blossom.length)));
    raw.push({ cx: f1(x), cy: f1(y), r: f1((isBig ? 4 : 3.4) + r() * (isBig ? 6 : 4.5)), ci });
  }
  raw.sort((a, b) => b.ci - a.ci);

  const flowers = Array.from({ length: isBig ? 16 : 9 }, () => {
    const b = blobs[Math.floor(r() * blobs.length)];
    const ang = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * b.r * 0.9;
    const size = 14 + r() * 12;
    return { x: f1(b.x + Math.cos(ang) * rad - size / 2), y: f1(b.y + Math.sin(ang) * rad - size / 2), size: f1(size), isRed: r() < 0.3 };
  });

  return { dark: T.dark, branches, masses, dots: raw.map(({ ci, ...d }) => ({ ...d, color: T.blossom[ci] })), flowers };
}

export interface PetalDrop {
  left: number;
  size: number;
  dx: number;
  rot: number;
  duration: number;
  delay: number;
  opacity: number;
  /** Kelopak lepas atau satu bunga mei utuh. */
  kind: "petal" | "mei";
}

/** Hujan kelopak mei sekali jalan saat undangan dibuka — posisi dari seed agar stabil. */
export function petalShower(count: number, seed: number): PetalDrop[] {
  const r = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    left: f1(r() * 100),
    size: f1(8 + r() * 9),
    dx: Math.round(r() * 120 - 60),
    rot: Math.round(r() * 540 - 270),
    duration: f1(9 + r() * 7),
    delay: f1(i * 0.55 + r() * 0.4),
    opacity: f1(0.55 + r() * 0.4),
    kind: r() < 0.5 ? "petal" : "mei",
  }));
}
