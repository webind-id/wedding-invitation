import "server-only";
import { EMPTY_SUMMARY, type GuestbookEntry, type GuestbookSummary } from "../guestbook";
import { db, dbFail } from "../supabase";

export const GUESTBOOK_PAGE_SIZE = 50;

export interface GuestbookPage {
  entries: GuestbookEntry[];
  total: number;
  summary: GuestbookSummary;
}

export async function guestbookPage(invitationId: string, page: number): Promise<GuestbookPage> {
  const from = Math.max(0, page - 1) * GUESTBOOK_PAGE_SIZE;
  const [list, summary] = await Promise.all([
    db()
      .from("guestbook")
      .select("id, name, attendance, party_size, message, created_at", { count: "exact" })
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false })
      .range(from, from + GUESTBOOK_PAGE_SIZE - 1),
    db()
      .from("guestbook_summary")
      .select("hadir, tidak_hadir, ragu, heads")
      .eq("invitation_id", invitationId)
      .maybeSingle(),
  ]);
  if (list.error) dbFail("memuat ucapan", list.error);
  if (summary.error) dbFail("memuat rekap", summary.error);

  return {
    entries: (list.data ?? []) as GuestbookEntry[],
    total: list.count ?? 0,
    summary: (summary.data as GuestbookSummary | null) ?? EMPTY_SUMMARY,
  };
}

/** Semua entri (untuk ekspor CSV), dibaca per 1000 baris. */
export async function allGuestbookEntries(invitationId: string): Promise<GuestbookEntry[]> {
  const BATCH = 1000;
  const all: GuestbookEntry[] = [];
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await db()
      .from("guestbook")
      .select("id, name, attendance, party_size, message, created_at")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: true })
      .range(from, from + BATCH - 1);
    if (error) dbFail("mengekspor ucapan", error);
    all.push(...((data ?? []) as GuestbookEntry[]));
    if (!data || data.length < BATCH) return all;
  }
}

export async function deleteGuestbookEntry(invitationId: string, id: string): Promise<void> {
  const { error } = await db().from("guestbook").delete().eq("invitation_id", invitationId).eq("id", id);
  if (error) dbFail("menghapus ucapan", error);
}
