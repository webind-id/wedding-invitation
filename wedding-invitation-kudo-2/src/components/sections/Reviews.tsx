"use client";

import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";
import { ReviewForm } from "./ReviewForm";

/** Buku tamu sebagai "ulasan penonton": form di kiri, kutipan ucapan di kanan. */
export function Reviews({ guestName }: { guestName: string }) {
  const { slug } = useInvitation();
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
  const stats = page
    ? [
        { label: "Hadir", value: page.summary.hadir },
        { label: "Tamu", value: page.summary.heads },
        { label: "Ucapan", value: page.total },
      ]
    : [];

  return (
    <section id="ulasan" aria-labelledby="ulasan-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Title reel="06" label="Ulasan & RSVP" id="ulasan-title">
        Kirim <em className="text-gold">doa terbaik</em>
      </Title>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <Reveal>
          {slug ? (
            <ReviewForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
          ) : (
            <p className="border border-dashed border-gold/30 p-8 text-center text-sm leading-relaxed text-smoke">
              Buku tamu aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.
            </p>
          )}
        </Reveal>

        <div className="min-w-0">
          {stats.length > 0 && (
            <dl className="grid grid-cols-3 border-y border-gold/20">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse py-5 text-center">
                  <dt className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-smoke">{s.label}</dt>
                  <dd className="font-display text-4xl text-gold">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {loadError && !page && <p className="text-center text-xs text-smoke">{loadError}</p>}

          {entries.length > 0 && (
            <ul className="no-scrollbar mt-6 max-h-[34rem] divide-y divide-gold/10 overflow-y-auto pr-1" aria-label="Daftar ucapan">
              {entries.map((e) => (
                <li key={e.id} className="py-6">
                  {e.message && (
                    <blockquote className="font-display text-lg italic leading-relaxed text-ivory/90">
                      <span aria-hidden className="mr-1 text-gold">“</span>
                      <span className="whitespace-pre-line">{e.message}</span>
                      <span aria-hidden className="ml-1 text-gold">”</span>
                    </blockquote>
                  )}
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[0.62rem] uppercase tracking-[0.22em] text-smoke">
                    <span className="text-ivory">— {e.name}</span>
                    <span className="text-gold">{ATTENDANCE_LABEL[e.attendance]}</span>
                    <time dateTime={e.created_at}>{relativeTime(e.created_at)}</time>
                  </p>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-line">
                {isLoadingMore ? "Memuat…" : "Muat lebih banyak"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
