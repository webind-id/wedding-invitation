/**
 * Geometri bunga sculptural: beberapa cincin kelopak, tiap cincin di kedalaman berbeda
 * (lihat .bloom-ring di globals.css). Murni & deterministik — server dan browser
 * menghasilkan bunga yang sama, jadi tidak ada hydration mismatch.
 */

export type BloomPalette = "blush" | "pearl" | "champagne";

/** [warna tepi, warna pangkal] per cincin, dari luar ke dalam — makin dalam makin pekat. */
export const PALETTES: Record<BloomPalette, ReadonlyArray<readonly [string, string]>> = {
  blush: [
    ["#FBF1F0", "#E8C9CC"],
    ["#F6E2E3", "#DDB0B5"],
    ["#F1D5D7", "#CE9DA3"],
    ["#ECC9CC", "#BF8D93"],
    ["#E6BCC0", "#B07A81"],
  ],
  pearl: [
    ["#FFFDF9", "#E9E3DA"],
    ["#FAF6F0", "#DED5C8"],
    ["#F5EFE6", "#D2C7B7"],
    ["#F0E8DC", "#C6B8A4"],
    ["#EADFD0", "#B9A992"],
  ],
  champagne: [
    ["#FAF2E4", "#E4D0B0"],
    ["#F4E8D2", "#D7BE99"],
    ["#EEDDBF", "#CAAE84"],
    ["#E8D2AE", "#BB9E72"],
    ["#E1C79E", "#AB8E63"],
  ],
};

const RING_COUNTS = [8, 7, 6, 5, 4];
const RING_SCALES = [1, 0.8, 0.62, 0.45, 0.3];

export interface PetalRing {
  index: number;
  scale: number;
  /** Sudut tiap kelopak (derajat). */
  angles: number[];
  edge: string;
  base: string;
}

/** Cincin-cincin kelopak untuk satu bunga. `seed` memutar susunan agar tiap bunga sedikit berbeda. */
export function bloomRings(palette: BloomPalette, rings = 5, seed = 0): PetalRing[] {
  const count = Math.max(1, Math.min(rings, RING_COUNTS.length));
  return Array.from({ length: count }, (_, i) => {
    const petals = RING_COUNTS[i];
    const offset = (i * 23 + seed * 37) % 360;
    const [edge, base] = PALETTES[palette][i];
    return {
      index: i,
      scale: RING_SCALES[i],
      angles: Array.from({ length: petals }, (_, k) => Math.round((offset + (k * 360) / petals) * 100) / 100),
      edge,
      base,
    };
  });
}

/** Kelopak menghadap ke atas, pangkal di (0,0): ujung membulat seperti peony. */
export const PETAL_PATH = "M0 0 C-22 -8 -36 -40 -24 -64 C-15 -80 15 -80 24 -64 C36 -40 22 -8 0 0Z";
/** Kilau tipis di sisi kiri kelopak — kesan permukaan satin. */
export const PETAL_SHEEN = "M-4 -10 C-16 -18 -24 -40 -16 -60 C-12 -68 -6 -70 -2 -66 C-10 -48 -10 -28 -4 -10Z";
export const LEAF_PATH = "M0 0 C-14 -20 -14 -70 0 -96 C14 -70 14 -20 0 0Z";
