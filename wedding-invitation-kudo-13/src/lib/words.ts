/**
 * Penulisan tanggal & jam dengan kata-kata, seperti pada undangan resmi
 * bercetak: "Sabtu, dua belas Juni, dua ribu dua puluh tujuh".
 */

const UNITS = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

/** Angka 0–999.999 ke kata (terbilang). */
export function terbilang(n: number): string {
  const value = Math.floor(Math.abs(n));
  if (value === 0) return "nol";
  if (value < 12) return UNITS[value];
  if (value < 20) return `${UNITS[value - 10]} belas`;
  if (value < 100) return join(`${UNITS[Math.floor(value / 10)]} puluh`, value % 10);
  if (value < 200) return join("seratus", value - 100);
  if (value < 1000) return join(`${UNITS[Math.floor(value / 100)]} ratus`, value % 100);
  if (value < 2000) return join("seribu", value - 1000);
  if (value < 1_000_000) return join(`${terbilang(Math.floor(value / 1000))} ribu`, value % 1000);
  return String(value);
}

function join(head: string, rest: number): string {
  return rest === 0 ? head : `${head} ${terbilang(rest)}`;
}

function parts(iso: string, timeZone: string) {
  const get = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { ...o, timeZone }).format(new Date(iso));
  return {
    weekday: get({ weekday: "long" }),
    day: Number(get({ day: "numeric" })),
    month: get({ month: "long" }),
    year: Number(get({ year: "numeric" })),
    hour: Number(get({ hour: "numeric", hourCycle: "h23" })),
    minute: Number(get({ minute: "numeric" })),
  };
}

/** "Sabtu, dua belas Juni, dua ribu dua puluh tujuh" */
export function dateInWords(iso: string, timeZone: string): string {
  const p = parts(iso, timeZone);
  return `${p.weekday}, ${terbilang(p.day)} ${p.month}, ${terbilang(p.year)}`;
}

function periodOf(hour: number): string {
  if (hour < 11) return "pagi";
  if (hour < 15) return "siang";
  if (hour < 18) return "sore";
  return "malam";
}

/** "pukul delapan pagi", "pukul sebelas lewat tiga puluh menit siang" */
export function timeInWords(iso: string, timeZone: string): string {
  const { hour, minute } = parts(iso, timeZone);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const minutes = minute === 0 ? "" : minute === 30 ? " tiga puluh" : ` lewat ${terbilang(minute)} menit`;
  return `pukul ${terbilang(h12)}${minutes} ${periodOf(hour)}`;
}

export interface MonthGrid {
  monthLabel: string;
  /** Minggu-minggu berisi nomor hari; null = sel kosong. Senin di kolom pertama. */
  weeks: (number | null)[][];
  /** Hari yang ditandai (tanggal acara). */
  day: number;
}

/** Kalender satu bulan untuk tanggal ISO, dihitung di zona waktu acara. */
export function monthGrid(iso: string, timeZone: string): MonthGrid {
  const p = parts(iso, timeZone);
  const monthIndex = new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone }).format(new Date(iso));
  const m = Number(monthIndex) - 1;
  const daysInMonth = new Date(Date.UTC(p.year, m + 1, 0)).getUTCDate();
  // getUTCDay: 0 = Minggu. Geser agar Senin = 0.
  const lead = (new Date(Date.UTC(p.year, m, 1)).getUTCDay() + 6) % 7;

  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return { monthLabel: `${p.month} ${p.year}`, weeks, day: p.day };
}

/** Tenggat balasan R.S.V.P.: sekian hari sebelum acara, sebagai tanggal panjang. */
export function replyDeadline(iso: string, timeZone: string, daysBefore = 14): string {
  const d = new Date(new Date(iso).getTime() - daysBefore * 86_400_000);
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone }).format(d);
}
