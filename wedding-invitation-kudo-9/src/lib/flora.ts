/**
 * Geometri bunga "Teratai Senja": teratai (kelopak runcing, bertumpuk seperti cawan),
 * dahlia (banyak kelopak ramping), daun teratai, dan untaian wisteria yang menjuntai.
 * Tiap cincin kelopak berada di kedalaman berbeda (lihat .flower-ring di globals.css).
 * Murni & deterministik — server dan browser menghasilkan bunga yang sama.
 */

export type FlowerKind = "lotus" | "dahlia";
export type FloraPalette = "lilac" | "plum" | "moon" | "apricot";

/** [warna ujung, warna pangkal] per cincin, dari luar ke dalam. Teratai: pangkal pucat, ujung berwarna. */
export const PALETTES: Record<FloraPalette, ReadonlyArray<readonly [string, string]>> = {
  lilac: [
    ["#C9B6DC", "#F6F1FA"],
    ["#BCA6D3", "#F1E9F6"],
    ["#AE96C9", "#EBE0F2"],
    ["#A088BF", "#E4D6EC"],
    ["#9279B3", "#DCCBE6"],
  ],
  plum: [
    ["#9C7AA8", "#E7D8EA"],
    ["#8C6899", "#DFCBE2"],
    ["#7C578A", "#D5BCD9"],
    ["#6C487A", "#CAADCF"],
    ["#5E3D6B", "#BF9FC6"],
  ],
  moon: [
    ["#E4DBEC", "#FFFFFF"],
    ["#DCD1E6", "#FDFBFE"],
    ["#D3C6E0", "#F9F6FB"],
    ["#CABBD9", "#F5F1F8"],
    ["#C1B0D2", "#F0EBF4"],
  ],
  apricot: [
    ["#EBB892", "#FCEFE4"],
    ["#E3A981", "#F9E6D6"],
    ["#DA9A70", "#F5DCC8"],
    ["#D08C62", "#F0D1BA"],
    ["#C57E55", "#EBC6AC"],
  ],
};

interface FlowerShape {
  /** Jumlah kelopak per cincin, dari luar ke dalam. */
  counts: readonly number[];
  scales: readonly number[];
  /** Kelopak menghadap ke atas, pangkal di (0,0). */
  petal: string;
  /** Urat/kilau di tengah kelopak. */
  vein: string;
}

export const FLOWERS: Record<FlowerKind, FlowerShape> = {
  // Kelopak teratai: lebar di tengah, meruncing ke ujung.
  lotus: {
    counts: [8, 8, 7, 6, 5],
    scales: [1, 0.84, 0.68, 0.53, 0.39],
    petal: "M0 0 C-22 -12 -30 -44 -10 -72 C-5 -79 -2 -84 0 -88 C2 -84 5 -79 10 -72 C30 -44 22 -12 0 0Z",
    vein: "M0 -6 C-3 -30 -3 -56 0 -80",
  },
  // Kelopak dahlia: ramping, ujung membulat.
  dahlia: {
    counts: [16, 14, 12, 10, 8],
    scales: [1, 0.84, 0.68, 0.53, 0.38],
    petal: "M0 0 C-9 -10 -12 -50 -8 -70 C-5 -79 5 -79 8 -70 C12 -50 9 -10 0 0Z",
    vein: "M0 -8 L0 -70",
  },
};

export interface PetalRing {
  index: number;
  scale: number;
  /** Sudut tiap kelopak (derajat). */
  angles: number[];
  tip: string;
  base: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Cincin-cincin kelopak untuk satu bunga. Cincin bergantian digeser setengah jarak kelopak
 * sehingga kelopak dalam mengisi celah kelopak luar; `seed` memutar susunan agar tiap bunga berbeda.
 */
export function flowerRings(kind: FlowerKind, palette: FloraPalette, rings = 5, seed = 0): PetalRing[] {
  const shape = FLOWERS[kind];
  const count = Math.max(1, Math.min(Math.round(rings), shape.counts.length));
  return Array.from({ length: count }, (_, i) => {
    const petals = shape.counts[i];
    const step = 360 / petals;
    const offset = (((i % 2) * step) / 2 + i * 11 + seed * 37) % 360;
    const [tip, base] = PALETTES[palette][i];
    return {
      index: i,
      scale: shape.scales[i],
      angles: Array.from({ length: petals }, (_, k) => round2((offset + k * step) % 360)),
      tip,
      base,
    };
  });
}

/** Daun teratai: lingkaran dengan celah berbentuk baji di atas. */
export const PAD_PATH = "M0 0 L14 -94 A95 95 0 1 1 -14 -94 Z";

/** Bakal biji teratai: titik-titik di lingkaran dalam (koordinat dibulatkan). */
export function seedPod(dots = 7, radius = 18): Array<{ x: number; y: number }> {
  const n = Math.max(0, Math.round(dots));
  return Array.from({ length: n }, (_, k) => {
    const a = (k * 2 * Math.PI) / n - Math.PI / 2;
    return { x: round2(Math.cos(a) * radius), y: round2(Math.sin(a) * radius) };
  });
}

export interface Floret {
  x: number;
  y: number;
  r: number;
  /** 0 (pangkal, pucat) … 3 (ujung, pekat). */
  tone: 0 | 1 | 2 | 3;
}

/**
 * Satu untaian wisteria: kuntum-kuntum kecil yang mengecil & makin pekat ke bawah,
 * berayun lembut ke kiri-kanan. Koordinat dalam viewBox lebar 60 (x = −30…30), y mulai 0.
 */
export function wisteriaFlorets(length = 14, seed = 0): Floret[] {
  const n = Math.max(1, Math.round(length));
  return Array.from({ length: n }, (_, k) => {
    const t = n === 1 ? 0 : k / (n - 1);
    const sway = Math.sin(k * 1.35 + seed * 2.1) * 14 * (1 - t * 0.7);
    return {
      x: round2(sway),
      y: round2(8 + k * 11),
      r: round2(9 - t * 5.5),
      tone: Math.min(3, Math.floor(t * 4)) as Floret["tone"],
    };
  });
}

/** Tinggi viewBox yang dibutuhkan satu untaian wisteria. */
export function wisteriaHeight(length = 14): number {
  const n = Math.max(1, Math.round(length));
  return 8 + (n - 1) * 11 + 12;
}

/** Warna kuntum wisteria per tingkat `tone`. */
export const WISTERIA_TONES = ["#E9E0F1", "#CDBCDD", "#A893C2", "#82699E"] as const;
