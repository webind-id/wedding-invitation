"use client";

import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { useInvitation } from "../InvitationContext";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";
import { LetterForm } from "./LetterForm";

/** "Surat pembaca": form RSVP di kiri, surat-surat dari tamu tersusun seperti kolom majalah. */
export function Letters({ guestName }: { guestName: string }) {
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
    load(0).catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Gagal memuat surat."));
  }, [load]);

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      await load(entries.length);
    } catch {
      setLoadError("Gagal memuat surat berikutnya.");
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
    <section id="surat" data-rubric="surat" aria-labelledby="surat-title" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <Opener id="surat" titleId="surat-title" deck="Konfirmasikan kehadiran Anda, dan titipkan sepucuk doa untuk kami.">
          Surat <em>pembaca</em>
        </Opener>

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            {slug ? (
              <LetterForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
            ) : (
              <p className="border-y border-ink py-8 font-serif text-lg italic text-stone">
                Rubrik ini aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.
              </p>
            )}
          </Reveal>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            {page && (
              <p className="rubric border-b border-ink pb-3">
                {page.summary.hadir} konfirmasi hadir · {page.summary.heads} tamu · {page.total} surat
              </p>
            )}
            {loadError && !page && <p className="font-serif italic text-stone">{loadError}</p>}

            {entries.length > 0 && (
              <ul className="no-scrollbar max-h-[40rem] divide-y divide-rule overflow-y-auto" aria-label="Surat dari tamu">
                {entries.map((e) => (
                  <li key={e.id} className="py-7">
                    {e.message && <p className="font-serif text-xl font-light leading-relaxed text-ink/90">“{e.message}”</p>}
                    <p className="mt-3 font-serif italic text-stone">
                      — <span className="not-italic text-ink">{e.name}</span>, {ATTENDANCE_LABEL[e.attendance].toLowerCase()} ·{" "}
                      <time dateTime={e.created_at}>{relativeTime(e.created_at)}</time>
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {hasMore && (
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-outline mt-6">
                {isLoadingMore ? "Memuat…" : "Surat lainnya"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
