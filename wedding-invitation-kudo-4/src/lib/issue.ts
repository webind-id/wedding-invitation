/**
 * Struktur "edisi majalah": rubrik berurutan dengan nomor halaman fiktif
 * untuk daftar isi & header berjalan.
 */
export const RUBRICS = [
  { id: "pengantar", label: "Surat Pengantar", page: 4 },
  { id: "mempelai", label: "Profil Mempelai", page: 8 },
  { id: "agenda", label: "Agenda", page: 16 },
  { id: "kisah", label: "Kisah Utama", page: 22 },
  { id: "portofolio", label: "Portofolio", page: 34 },
  { id: "registri", label: "Registri Hadiah", page: 46 },
  { id: "surat", label: "Surat Pembaca", page: 50 },
  { id: "kolofon", label: "Kolofon", page: 56 },
] as const;

export type RubricId = (typeof RUBRICS)[number]["id"];

export function rubric(id: RubricId) {
  return RUBRICS.find((r) => r.id === id)!;
}

/** Nomor halaman dua digit: 4 → "04". */
export function folio(page: number): string {
  return String(page).padStart(2, "0");
}

/** Nomor gambar: 3 → "Gbr. 03". */
export function figureLabel(n: number): string {
  return `Gbr. ${folio(n)}`;
}

/** "Sabtu · Juni 2027" — hari & bulan untuk tanggal raksasa di Agenda. */
export function weekdayMonthYear(iso: string, timeZone: string): string {
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { ...o, timeZone }).format(new Date(iso));
  return `${fmt({ weekday: "long" })} · ${fmt({ month: "long", year: "numeric" })}`;
}

/** "Edisi Juni 2027" dari ISO tanggal acara pertama. */
export function issueLabel(iso: string, timeZone: string): string {
  const month = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone }).format(new Date(iso));
  return `Edisi ${month}`;
}
