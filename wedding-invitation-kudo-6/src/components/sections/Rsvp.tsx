"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { SectionHeading } from "../ui/SectionHeading";
import { RsvpForm } from "./RsvpForm";

/** Konfirmasi kehadiran + buku tamu. Form melayang di depan bunga (lapisan kedalaman berbeda). */
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
    <section ref={ref} id="rsvp" aria-labelledby="rsvp-title" className="relative overflow-hidden px-6 py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
        <div data-depth="-50" className="preserve-3d absolute -left-16 top-[30%] sm:left-[4%]">
          <div data-spin="-70" className="preserve-3d">
            <Bloom palette="pearl" size="clamp(9rem,22vw,15rem)" seed={11} leaves={3} />
          </div>
        </div>
        <div data-depth="90" className="preserve-3d absolute -right-10 bottom-[18%] sm:right-[6%]">
          <div data-spin="60" className="preserve-3d">
            <Bloom palette="blush" size="clamp(7rem,16vw,11rem)" seed={13} />
          </div>
        </div>
      </div>

      <SectionHeading
        id="rsvp-title"
        label="Konfirmasi kehadiran"
        title="Akankah Anda datang?"
        intro={`Mohon konfirmasi sebelum ${replyDeadline(content.events[0].start, content.timeZone)}.`}
      />

      <div data-reveal="up" className="relative mx-auto mt-14 max-w-xl">
        <div className="pearl-card rounded-[2rem] px-6 py-9 sm:px-10">
          {slug ? (
            <RsvpForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
          ) : (
            <p className="text-center text-ink/65">Formulir konfirmasi aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.</p>
          )}
        </div>
      </div>

      {(page || loadError) && (
        <div className="relative mx-auto mt-20 max-w-2xl">
          <p className="label text-center">Ucapan &amp; doa</p>
          {page && (
            <p className="mt-2 text-center font-display text-lg italic text-ink/70">
              {page.summary.hadir} keluarga akan hadir · {page.summary.heads} tamu · {page.total} ucapan
            </p>
          )}
          {loadError && !page && <p className="mt-2 text-center text-ink/60">{loadError}</p>}

          {entries.length > 0 && (
            <ul aria-label="Ucapan tamu" className="no-scrollbar mt-8 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
              {entries.map((e) => (
                <li key={e.id} className="pearl-card rounded-[1.5rem] px-6 py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-xl italic">{e.name}</p>
                    <time dateTime={e.created_at} className="shrink-0 text-xs text-ink/45">
                      {relativeTime(e.created_at)}
                    </time>
                  </div>
                  <p className="label mt-1 text-[0.58rem]">{ATTENDANCE_LABEL[e.attendance]}</p>
                  {e.message && <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">{e.message}</p>}
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-ghost">
                {isLoadingMore ? "Memuat…" : "Ucapan lainnya"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
