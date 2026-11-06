"use client";

import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";
import { GuestbookForm } from "./GuestbookForm";

/** RSVP & ucapan di atas latar charcoal solid — panggung digelapkan agar teks mudah dibaca. */
export function GuestbookScene({ guestName }: { guestName: string }) {
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

  return (
    <Scene chapter="ucapan" photo={null} anchor label="Ucapan" fullscreen={false} className="bg-charcoal py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 sm:px-10 lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-20">
        <div>
          <ChapterHeading chapter="ucapan">
            Doa <em>& kabar</em>
          </ChapterHeading>
          <Reveal delay={0.2} effect="fade" className="mt-10">
            {slug ? (
              <GuestbookForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
            ) : (
              <p className="rounded-3xl border border-dashed border-cream/20 p-7 text-sm leading-relaxed text-cream/60">
                Buku tamu aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.
              </p>
            )}
          </Reveal>
        </div>

        <div className="min-w-0 lg:pt-24">
          {page && (
            <dl className="flex gap-10">
              {[
                { label: "akan hadir", value: page.summary.heads },
                { label: "ucapan", value: page.total },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="kicker mt-1">{s.label}</dt>
                  <dd className="font-serif text-6xl italic">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {loadError && !page && <p className="text-sm text-cream/50">{loadError}</p>}

          {entries.length > 0 && (
            <ul className="no-scrollbar mt-10 max-h-[36rem] space-y-8 overflow-y-auto pr-2" aria-label="Daftar ucapan">
              {entries.map((e) => (
                <li key={e.id} className="border-l border-bronze/50 pl-5">
                  {e.message && <p className="whitespace-pre-line font-serif text-xl italic leading-relaxed text-cream/90">{e.message}</p>}
                  <p className="mt-3 text-xs text-cream/50">
                    <span className="font-medium text-cream/80">{e.name}</span> · {ATTENDANCE_LABEL[e.attendance]} ·{" "}
                    <time dateTime={e.created_at}>{relativeTime(e.created_at)}</time>
                  </p>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-ghost mt-8">
              {isLoadingMore ? "Memuat…" : "Muat lebih banyak"}
            </button>
          )}
        </div>
      </div>
    </Scene>
  );
}
