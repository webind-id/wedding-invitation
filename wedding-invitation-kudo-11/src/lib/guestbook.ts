/**
 * Model + validasi "Buku Tamu" (RSVP & ucapan). Dipakai bersama oleh form di
 * browser dan route /api/ucapan, jadi aturan yang sama berlaku di dua sisi.
 * Batas yang sama juga dipasang sebagai CHECK di supabase/schema.sql.
 */

export const ATTENDANCE = ["hadir", "tidak_hadir", "ragu"] as const;
export type Attendance = (typeof ATTENDANCE)[number];

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak_hadir: "Berhalangan",
  ragu: "Belum pasti",
};

export const LIMITS = {
  nameMax: 80,
  messageMax: 500,
  partyMin: 1,
  partyMax: 5,
} as const;

export interface GuestbookEntry {
  id: string;
  name: string;
  attendance: Attendance;
  party_size: number;
  message: string | null;
  created_at: string;
}

export interface GuestbookInput {
  name: string;
  attendance: Attendance;
  partySize: number;
  message: string | null;
}

export interface GuestbookSummary {
  hadir: number;
  tidak_hadir: number;
  ragu: number;
  /** Total orang yang akan hadir (jumlah party_size dari yang "hadir"). */
  heads: number;
}

export const EMPTY_SUMMARY: GuestbookSummary = { hadir: 0, tidak_hadir: 0, ragu: 0, heads: 0 };

export interface GuestbookPage {
  entries: GuestbookEntry[];
  summary: GuestbookSummary;
  total: number;
  pageSize: number;
}

export type ValidationResult =
  | { ok: true; value: GuestbookInput }
  | { ok: false; error: string };

function isAttendance(value: unknown): value is Attendance {
  return typeof value === "string" && (ATTENDANCE as readonly string[]).includes(value);
}

/** Rapikan spasi dan buang karakter kontrol (selain baris baru). */
export function cleanText(value: string): string {
  return value
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateGuestbookInput(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Data tidak valid." };
  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? cleanText(body.name) : "";
  if (!name) return { ok: false, error: "Nama wajib diisi." };
  if (name.length > LIMITS.nameMax) return { ok: false, error: `Nama maksimal ${LIMITS.nameMax} karakter.` };

  if (!isAttendance(body.attendance)) return { ok: false, error: "Pilih konfirmasi kehadiran." };

  const message = typeof body.message === "string" ? cleanText(body.message) : "";
  if (message.length > LIMITS.messageMax) {
    return { ok: false, error: `Ucapan maksimal ${LIMITS.messageMax} karakter.` };
  }

  let partySize = 1;
  if (body.attendance === "hadir") {
    const n = Number(body.partySize);
    if (!Number.isInteger(n) || n < LIMITS.partyMin || n > LIMITS.partyMax) {
      return { ok: false, error: `Jumlah tamu antara ${LIMITS.partyMin}–${LIMITS.partyMax} orang.` };
    }
    partySize = n;
  }

  return { ok: true, value: { name, attendance: body.attendance, partySize, message: message || null } };
}

/** Rekap baru setelah satu entri ditambahkan (untuk update lokal tanpa memuat ulang). */
export function addToSummary(
  summary: GuestbookSummary,
  entry: Pick<GuestbookEntry, "attendance" | "party_size">,
): GuestbookSummary {
  return {
    ...summary,
    [entry.attendance]: summary[entry.attendance] + 1,
    heads: entry.attendance === "hadir" ? summary.heads + entry.party_size : summary.heads,
  };
}

/** Potong teks per code point agar emoji/surrogate pair tidak terbelah. */
export function truncate(value: string, max: number): string {
  const chars = Array.from(value);
  return chars.length > max ? chars.slice(0, max).join("") : value;
}
