/** Tipe buku tamu (RSVP). Kolom & batasnya sama dengan supabase/schema.sql. */

export const ATTENDANCE = ["hadir", "tidak_hadir", "ragu"] as const;
export type Attendance = (typeof ATTENDANCE)[number];

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak_hadir: "Berhalangan",
  ragu: "Belum pasti",
};

export interface GuestbookEntry {
  id: string;
  name: string;
  attendance: Attendance;
  party_size: number;
  message: string | null;
  created_at: string;
}

export interface GuestbookSummary {
  hadir: number;
  tidak_hadir: number;
  ragu: number;
  /** Total orang yang akan hadir (jumlah party_size dari yang "hadir"). */
  heads: number;
}

export const EMPTY_SUMMARY: GuestbookSummary = { hadir: 0, tidak_hadir: 0, ragu: 0, heads: 0 };
