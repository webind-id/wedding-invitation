/** Bab-bab undangan, berurutan. Dipakai indikator bab, menu, dan atribut data-chapter pada scene. */
export const CHAPTERS = [
  { id: "pembuka", label: "Pembuka" },
  { id: "mempelai", label: "Mempelai" },
  { id: "waktu", label: "Waktu" },
  { id: "acara", label: "Acara" },
  { id: "kisah", label: "Kisah" },
  { id: "galeri", label: "Galeri" },
  { id: "hadiah", label: "Hadiah" },
  { id: "ucapan", label: "Ucapan" },
  { id: "penutup", label: "Penutup" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** 1 → "I", 8 → "VIII". Cukup untuk 1–39. */
export function toRoman(n: number): string {
  let rest = Math.max(0, Math.floor(n));
  let out = "";
  for (const [value, symbol] of ROMAN) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

export function chapterIndex(id: string | null): number {
  return CHAPTERS.findIndex((c) => c.id === id);
}
