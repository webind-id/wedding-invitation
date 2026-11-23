import type { InvitationContent } from "@/shared/contract";

/**
 * Semua foto yang tersedia di konten (tanpa duplikat & yang kosong), dengan
 * urutan prioritas: galeri dulu, lalu foto utama & mempelai. Template ini
 * banyak memadukan foto, jadi setiap bagian mengambil dari kumpulan ini.
 */
export function photoPool(content: InvitationContent): string[] {
  const all = [
    ...content.moments.map((m) => m.src),
    content.coverPhoto,
    content.posterPhoto,
    content.bride.photo,
    content.groom.photo,
  ];
  return Array.from(new Set(all.filter(Boolean)));
}

/** Foto ke-i secara berputar; string kosong bila tidak ada foto sama sekali. */
export function photoAt(pool: string[], index: number): string {
  return pool.length === 0 ? "" : pool[((index % pool.length) + pool.length) % pool.length];
}

/** Dua angka: "1" → "01". */
export function reelNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/** Kumpulan foto tanpa foto-foto tertentu (mis. foto utama yang sudah tampil di tengah). */
export function photosExcept(pool: string[], exclude: string[]): string[] {
  const skip = new Set(exclude.filter(Boolean));
  const rest = pool.filter((src) => !skip.has(src));
  return rest.length > 0 ? rest : pool;
}
