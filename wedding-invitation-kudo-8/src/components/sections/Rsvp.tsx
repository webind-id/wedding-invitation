"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { RsvpForm } from "./RsvpForm";

/** Buku registrasi pendaki (RSVP) + pesan-pesan yang ditinggalkan di perkemahan (ucapan). */
export function Rsvp({ guestName }: { guestName: string }) {
  const { content, slug } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const [page, setPage] = useState<GuestbookPage | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  useScrollScene(ref);

  const load = useCallback(
    async (offset: number) => {
      if (!slug) return;
      const data = await requestJson<GuestbookPage>(`/api/ucapan?slug=${encodeURIComponent(slug)}&offset=${offset}`);
      setPage(data);
      setEntries((prev) => {
        if (offset === 0) return data.entries;
        // Ucapan baru dari tamu lain menggeser offset — buang yang sudah tampil.
        const shown = new Set(prev.map((e) => e.id));
        return [...prev, ...data.entries.filter((e) => !shown.has(e.id))];
      });
    },
    [slug],
  );

  useEffect(() => {
    load(0).catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Gagal memuat ucapan."));
  }, [load]);

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      await load(entries.length);
    } catch {
      setLoadError("Gagal memuat ucapan berikutnya.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleSubmitted(entry: GuestbookEntry | null) {
    if (!entry) return;
    setEntries((prev) => [entry, ...prev]);
    setPage((p) => p && { ...p, total: p.total + 1, summary: addToSummary(p.summary, entry) });
  }

  const hasMore = page !== null && entries.length < page.total;

  return (
    <section ref={ref} id="rsvp" aria-labelledby="rsvp-title" className="relative bg-film px-6 py-28 sm:py-36">
      <div data-reveal="fade" className="flex justify-center">
        <Slate scene={9} />
      </div>
      <TitleCard
        id="rsvp-title"
        kicker="Buku registrasi pendaki"
        title="Ikut Mendaki?"
        subtitle="isi buku registrasi di basecamp"
        intro={`Mohon konfirmasi kehadiran sebelum ${replyDeadline(content.events[0].start, content.timeZone)}.`}
        className="mt-6"
      />

      <div data-reveal="up" className="mx-auto mt-14 max-w-xl border border-seluloid/12 bg-film-soft">
        <div className="flex items-center justify-between border-b border-seluloid/10 px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] sm:px-10">
          <span className="text-amber">Formulir registrasi</span>
          <span className="text-seluloid/45">Basecamp</span>
        </div>
        <div className="px-6 py-9 sm:px-10">
          {slug ? (
            <RsvpForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
          ) : (
            <p className="text-center text-seluloid/65">Formulir konfirmasi aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.</p>
          )}
        </div>
      </div>

      {(page || loadError) && (
        <div className="mx-auto mt-20 max-w-2xl">
          <p className="label text-center">Pesan dari para pendaki</p>
          {page && (
            <p className="mt-2 text-center font-display text-lg italic text-seluloid/65">
              {page.summary.hadir} rombongan ikut mendaki · {page.summary.heads} pendaki · {page.total} pesan
            </p>
          )}
          {loadError && !page && <p className="mt-2 text-center text-seluloid/55">{loadError}</p>}

          {entries.length > 0 && (
            <ul aria-label="Ucapan tamu" className="no-scrollbar mt-8 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
              {entries.map((e) => (
                <li key={e.id} className="border-l-2 border-amber/60 bg-film-soft px-6 py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-xl italic">{e.name}</p>
                    <time dateTime={e.created_at} className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-seluloid/40">
                      {relativeTime(e.created_at)}
                    </time>
                  </div>
                  <p className="label mt-1 text-[0.58rem] text-amber/80">{ATTENDANCE_LABEL[e.attendance]}</p>
                  {e.message && <p className="mt-3 whitespace-pre-line leading-relaxed text-seluloid/80">{e.message}</p>}
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-ghost">
                {isLoadingMore ? "Memuat…" : "Pesan lainnya"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
