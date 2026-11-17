/**
 * Pepohonan adegan pembuka (pohon kelapa & semak berbunga), dibangkitkan dari seed.
 * Murni & deterministik: seed yang sama → bentuk yang sama di server dan browser,
 * jadi tidak ada hydration mismatch. Semua angka dibulatkan 1 desimal.
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

export type PalmTone = "far" | "near";
export type BushTone = "mid" | "fg";

const PALM_TONES: Record<PalmTone, { trunk: string; leaf: string[] }> = {
  far: { trunk: "#7A5636", leaf: ["#7A5A3E", "#9C7450", "#7A5636"] },
  near: { trunk: "#3A2618", leaf: ["#44301F", "#4E3421", "#3A2618", "#6B4529"] },
};

const BUSH_TONES: Record<BushTone, { blossom: string[]; dark: string }> = {
  mid: { blossom: ["#FDEEF2", "#F4B8C8", "#EC97AF", "#D95B82", "#B4466B", "#7E2F4C"], dark: "#3A2618" },
  fg: { blossom: ["#FFF3F6", "#F8CCD8", "#F4B8C8", "#E57E9D", "#D95B82", "#A63C62", "#6E2440"], dark: "#22160D" },
};

export const PALM_VIEWBOX = { width: 300, height: 600 } as const;
export const BUSH_VIEWBOX = 400;

export interface Frond {
  /** Pelepah utama (kurva kuadrat). */
  rib: string;
  /** Semua anak daun sebagai satu path. */
  leaflets: string;
  color: string;
}

export interface Palm {
  trunk: string;
  trunkColor: string;
  crown: { x: number; y: number };
  fronds: Frond[];
}

const FROND_COUNT = 12;

/** Pohon kelapa: batang melengkung ke arah `lean`, 12 pelepah terkulai dengan anak daun. */
export function palm(seed: number, tone: PalmTone, lean: number): Palm {
  const r = seededRandom(seed);
  const T = PALM_TONES[tone];
  const bx = PALM_VIEWBOX.width / 2;
  const by = PALM_VIEWBOX.height;
  const cx = bx + lean;
  const cy = 120 + r() * 40;

  const fronds: Frond[] = [];
  for (let i = 0; i < FROND_COUNT; i++) {
    const a = ((-178 + (176 / (FROND_COUNT - 1)) * i + (r() - 0.5) * 10) * Math.PI) / 180;
    const side = Math.abs(Math.cos(a));
    const length = 105 + side * 55 + r() * 30;
    const droop = length * (0.25 + side * 0.55);
    const ex = cx + length * Math.cos(a);
    const ey = cy + length * Math.sin(a) + droop;
    const qx = cx + length * 0.6 * Math.cos(a);
    const qy = cy + length * 0.6 * Math.sin(a) - 8;
    const color = T.leaf[Math.floor(r() * T.leaf.length)];

    let leaflets = "";
    for (let t = 0.07; t <= 1; t += 0.042) {
      const u = 1 - t;
      const px = u * u * cx + 2 * u * t * qx + t * t * ex;
      const py = u * u * cy + 2 * u * t * qy + t * t * ey;
      let tx = 2 * u * (qx - cx) + 2 * t * (ex - qx);
      let ty = 2 * u * (qy - cy) + 2 * t * (ey - qy);
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const ll = (30 - 20 * t) * (0.85 + r() * 0.3);
      for (const s of [-1, 1]) {
        let dx = -ty * s * 0.85 + tx * 0.5;
        let dy = tx * s * 0.85 + ty * 0.5 + 0.55;
        const dl = Math.hypot(dx, dy);
        dx /= dl;
        dy /= dl;
        leaflets += `M${f1(px)} ${f1(py)}L${f1(px + dx * ll)} ${f1(py + dy * ll)}`;
      }
    }
    fronds.push({ rib: `M${f1(cx)} ${f1(cy)}Q${f1(qx)} ${f1(qy)} ${f1(ex)} ${f1(ey)}`, leaflets, color });
  }

  return {
    trunk: `M${bx} ${by} Q${f1(bx + lean * 0.15)} ${f1(by * 0.55)} ${f1(cx)} ${f1(cy)}`,
    trunkColor: T.trunk,
    crown: { x: f1(cx), y: f1(cy) },
    fronds,
  };
}

export interface Bush {
  dark: string;
  branches: { d: string; width: number }[];
  masses: { cx: number; cy: number; r: number }[];
  /** Kuntum bunga, sudah diurutkan dari yang paling gelap (belakang) ke terang (depan). */
  dots: { cx: number; cy: number; r: number; color: string }[];
  /** Posisi bunga melati/kanthil (kiri-atas & ukuran) dalam viewBox 400. */
  flowers: { x: number; y: number; size: number }[];
}

const BRANCHES = 6;

/** Semak bunga: beberapa gumpalan, ratusan kuntum bergradasi (terang di kiri-atas), dan bunga melati. */
export function bush(seed: number, tone: BushTone): Bush {
  const r = seededRandom(seed);
  const T = BUSH_TONES[tone];
  const isBig = tone === "fg";
  const blobs = Array.from({ length: isBig ? 6 : 5 }, () => ({
    x: 200 + (r() - 0.5) * 220,
    y: 210 + (r() - 0.3) * 150,
    r: 85 + r() * 70,
  }));

  const branches = Array.from({ length: BRANCHES }, (_, i) => {
    const b = blobs[i % blobs.length];
    return {
      d: `M${f1(150 + r() * 100)} 420 Q${f1(b.x + (r() - 0.5) * 60)} ${f1(b.y + 90)} ${f1(b.x)} ${f1(b.y)}`,
      width: f1(5 + r() * 6),
    };
  });

  const masses = blobs.map((b) => ({ cx: f1(b.x), cy: f1(b.y + 8), r: f1(b.r * 0.92) }));

  const count = isBig ? 520 : 320;
  const raw: { cx: number; cy: number; r: number; ci: number }[] = [];
  for (let i = 0; i < count; i++) {
    const b = blobs[Math.floor(r() * blobs.length)];
    const ang = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * b.r;
    const x = b.x + Math.cos(ang) * rad;
    const y = b.y + Math.sin(ang) * rad;
    // Lebih terang di kiri-atas, lebih gelap ke bawah.
    const shade = ((y - (b.y - b.r)) / (2 * b.r)) * 0.75 + ((x - (b.x - b.r)) / (2 * b.r)) * 0.2 + (r() - 0.5) * 0.5;
    const ci = Math.max(0, Math.min(T.blossom.length - 1, Math.floor(shade * T.blossom.length)));
    raw.push({ cx: f1(x), cy: f1(y), r: f1((isBig ? 4 : 3.4) + r() * (isBig ? 6 : 4.5)), ci });
  }
  raw.sort((a, b) => b.ci - a.ci);

  const flowers = Array.from({ length: isBig ? 14 : 8 }, () => {
    const b = blobs[Math.floor(r() * blobs.length)];
    const ang = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * b.r * 0.9;
    const size = 12 + r() * 10;
    return { x: f1(b.x + Math.cos(ang) * rad - size / 2), y: f1(b.y + Math.sin(ang) * rad - size / 2), size: f1(size) };
  });

  return {
    dark: T.dark,
    branches,
    masses,
    dots: raw.map(({ ci, ...d }) => ({ ...d, color: T.blossom[ci] })),
    flowers,
  };
}

export interface MelatiDrop {
  left: number;
  size: number;
  dx: number;
  rot: number;
  duration: number;
  delay: number;
  opacity: number;
}

/** Hujan melati sekali jalan saat undangan dibuka — posisi dari seed agar stabil. */
export function melatiShower(count: number, seed: number): MelatiDrop[] {
  const r = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    left: f1(r() * 100),
    size: f1(9 + r() * 9),
    dx: Math.round(r() * 120 - 60),
    rot: Math.round(r() * 540 - 270),
    duration: f1(9 + r() * 7),
    delay: f1(i * 0.55 + r() * 0.4),
    opacity: f1(0.55 + r() * 0.4),
  }));
}
