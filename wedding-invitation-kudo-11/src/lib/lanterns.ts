/**
 * Geometri & penempatan lampion 3D (Lampion Malam / kudo-11).
 * Fungsi murni dan deterministik — server & browser menghasilkan susunan yang sama
 * (tidak ada hydration mismatch), dan semuanya bisa diuji.
 */

export type LanternVariant = "amber" | "rose" | "crimson";

export const LANTERN_VARIANTS: readonly LanternVariant[] = ["amber", "rose", "crimson"] as const;

/** Warna kertas lampion: atas (paling terang), tengah, bawah, dan warna pendarnya. */
export const LANTERN_PALETTE: Record<LanternVariant, { top: string; mid: string; bottom: string; glow: string }> = {
  amber: { top: "#FFF1C9", mid: "#F8B23A", bottom: "#C9561F", glow: "rgba(248, 178, 58, 0.55)" },
  rose: { top: "#FFE2D2", mid: "#F08A6B", bottom: "#B5361E", glow: "rgba(240, 138, 107, 0.5)" },
  crimson: { top: "#FFC9A8", mid: "#E0442A", bottom: "#7E2214", glow: "rgba(224, 68, 42, 0.5)" },
};

/** PRNG kecil (mulberry32) — cukup untuk tata letak dekoratif yang stabil. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PrismFace {
  /** rotateY tiap sisi (derajat). */
  angle: number;
}

export interface LanternGeometry {
  sides: number;
  /** Lebar sisi di bagian atas (px). */
  faceWidth: number;
  /** Panjang miring sisi (px) — sedikit lebih panjang dari tinggi lampion karena sisi condong. */
  faceHeight: number;
  /** Jarak sisi dari sumbu putar, diukur di tengah tinggi (px). */
  translateZ: number;
  /** Kemiringan sisi ke dalam di bagian bawah (derajat, dipakai sebagai rotateX(-tilt)). */
  tilt: number;
  /** clip-path trapesium: atas lebar penuh, bawah menyempit sesuai taper. */
  clipPath: string;
  faces: PrismFace[];
}

/**
 * Lampion langit berbentuk prisma terpancung (frustum): sisi-sisi trapesium yang
 * condong ke dalam sehingga tepi atas & bawah tiap sisi bertemu dengan tetangganya.
 *
 * @param width  lebar lampion di bagian atas (px) — dua kali apotema atas
 * @param height tinggi tegak lampion (px)
 * @param taper  rasio lebar bawah terhadap atas (0 < taper ≤ 1)
 * @param sides  jumlah sisi (≥ 3)
 */
export function lanternGeometry(width: number, height: number, taper = 0.72, sides = 6): LanternGeometry {
  const n = Math.max(3, Math.round(sides));
  const k = Math.min(1, Math.max(0.1, taper));
  const rTop = width / 2;
  const rBottom = rTop * k;
  const halfAngle = Math.PI / n;
  const faceWidth = 2 * rTop * Math.tan(halfAngle);
  const faceBottom = 2 * rBottom * Math.tan(halfAngle);
  const drop = rTop - rBottom;
  const inset = round((((faceWidth - faceBottom) / 2) / faceWidth) * 100);

  return {
    sides: n,
    faceWidth: round(faceWidth),
    faceHeight: round(Math.hypot(height, drop)),
    translateZ: round((rTop + rBottom) / 2),
    tilt: round((Math.atan2(drop, height) * 180) / Math.PI),
    clipPath: `polygon(0 0, 100% 0, ${round(100 - inset)}% 100%, ${inset}% 100%)`,
    faces: Array.from({ length: n }, (_, i) => ({ angle: round((360 / n) * i) })),
  };
}

export interface SkyLantern {
  id: number;
  /** Posisi horizontal (% lebar wadah). */
  left: number;
  /** Posisi vertikal awal (% tinggi wadah) — dipakai mode "drift". */
  top: number;
  /** Lebar lampion (px). */
  size: number;
  /** 0 = paling jauh (kecil, buram, redup), 1 = paling dekat. */
  depth: number;
  /** Lama satu kali terbang / mengapung (detik). */
  duration: number;
  /** Delay negatif agar lampion sudah tersebar sejak awal (detik). */
  delay: number;
  /** Amplitudo goyangan kiri-kanan (px). */
  sway: number;
  variant: LanternVariant;
}

export interface SkyOptions {
  minSize?: number;
  maxSize?: number;
  /** Rentang durasi terbang (detik). */
  minDuration?: number;
  maxDuration?: number;
}

/**
 * Susunan lampion untuk satu langit. Lampion yang lebih dekat lebih besar dan
 * terbang lebih cepat (paralaks), lampion jauh kecil dan lambat.
 */
export function skyLanterns(count: number, seed = 11, options: SkyOptions = {}): SkyLantern[] {
  const { minSize = 14, maxSize = 46, minDuration = 18, maxDuration = 42 } = options;
  const rand = seededRandom(seed);
  const total = Math.max(0, Math.floor(count));
  // Sebar merata per kolom lalu acak di dalam kolom — tidak menumpuk di satu sisi.
  return Array.from({ length: total }, (_, i) => {
    const depth = round(rand());
    const column = (i + rand()) / Math.max(1, total);
    const duration = round(maxDuration - depth * (maxDuration - minDuration));
    return {
      id: i,
      left: round(2 + column * 96),
      top: round(4 + rand() * 88),
      size: Math.round(minSize + depth * (maxSize - minSize)),
      depth,
      duration,
      delay: round(-rand() * duration),
      sway: Math.round(6 + rand() * 18),
      variant: LANTERN_VARIANTS[Math.floor(rand() * LANTERN_VARIANTS.length)],
    };
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
