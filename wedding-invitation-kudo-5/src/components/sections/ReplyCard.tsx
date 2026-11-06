"use client";

import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { SectionTitle } from "../ui/Frames";
import { EngravedCard } from "../ui/Ornaments";
import { Reveal } from "../ui/Reveal";
import { ReplyForm } from "./ReplyForm";

/** Kartu balasan R.S.V.P. + buku tamu bergaya buku besar bergaris. */
export function ReplyCard({ guestName }: { guestName: string }) {
  const { content, slug } = useInvitation();
  const [page, setPage] = useState<GuestbookPage | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    load(0).catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Gagal memuat buku tamu."));
  }, [load]);

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      await load(entries.length);
    } catch {
      setLoadError("Gagal memuat halaman berikutnya.");
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
    <section id="rsvp" aria-labelledby="rsvp-title" className="px-4 py-20 sm:py-28">
      <SectionTitle label="Mohon balasan" id="rsvp-title">
        R.S.V.P.
      </SectionTitle>

      <Reveal className="mx-auto mt-12 max-w-xl">
        <EngravedCard innerClassName="px-6 py-10 sm:px-12">
          <p className="text-center font-serif text-lg italic text-umber">
            Mohon kesediaan untuk membalas sebelum <span className="not-italic text-burgundy">{replyDeadline(content.events[0].start, content.timeZone)}</span>
          </p>
          <div className="mt-8">
            {slug ? (
              <ReplyForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
            ) : (
              <p className="text-center font-serif italic text-umber">
                Kartu balasan aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.
              </p>
            )}
          </div>
        </EngravedCard>
      </Reveal>

      {(page || loadError) && (
        <Reveal className="mx-auto mt-16 max-w-2xl">
          <p className="smallcaps text-center">Buku tamu</p>
          {page && (
            <p className="mt-2 text-center font-fell italic text-umber">
              {page.summary.hadir} keluarga akan hadir · {page.summary.heads} tamu · {page.total} ucapan
            </p>
          )}
          {loadError && !page && <p className="mt-2 text-center font-serif italic text-umber">{loadError}</p>}

          {entries.length > 0 && (
            <ul className="no-scrollbar mt-8 max-h-[36rem] overflow-y-auto border-y-[3px] border-double border-burgundy/40" aria-label="Isi buku tamu">
              {entries.map((e) => (
                <li key={e.id} className="border-b border-umber/20 px-2 py-5 last:border-b-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-fell text-xl text-burgundy">{e.name}</p>
                    <time dateTime={e.created_at} className="shrink-0 font-serif text-sm italic text-sepia">
                      {relativeTime(e.created_at)}
                    </time>
                  </div>
                  <p className="smallcaps text-xs">{ATTENDANCE_LABEL[e.attendance]}</p>
                  {e.message && <p className="mt-2 whitespace-pre-line font-serif text-lg italic leading-relaxed text-ink/85">{e.message}</p>}
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-plain">
                {isLoadingMore ? "Memuat…" : "Halaman berikutnya"}
              </button>
            </div>
          )}
        </Reveal>
      )}
    </section>
  );
}
