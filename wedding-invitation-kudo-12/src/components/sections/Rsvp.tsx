"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE, ATTENDANCE_LABEL, EMPTY_SUMMARY, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { ParangEdges } from "../jawa/Ornaments";
import { SectionHeading } from "../ui/SectionHeading";
import { RsvpForm } from "./RsvpForm";

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

  const summary = page?.summary ?? EMPTY_SUMMARY;
  const hasMore = page !== null && entries.length < page.total;
  const deadline = content.events[0] ? replyDeadline(content.events[0].start, content.timeZone) : "";

  return (
    <section ref={ref} id="ucapan" aria-labelledby="ucapan-title" className="sec bg-cream-100">
      <ParangEdges />
      <SectionHeading
        id="ucapan-title"
        title="Konfirmasi Kehadiran"
        variant="display"
        lead={
          <span className="small-ui">
            {deadline
              ? `Mohon konfirmasi sebelum ${deadline}, dan tuliskan doa terbaik untuk kami.`
              : "Mohon isi formulir di bawah ini dan tuliskan doa terbaik untuk kami."}
          </span>
        }
      />

      <div data-reveal="up">
        {slug ? (
          <RsvpForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
        ) : (
          <p className="small-ui mt-6 rounded-2xl border border-dashed border-gold-500/50 bg-ivory p-5">
            Buku tamu aktif otomatis setelah undangan diterbitkan.
          </p>
        )}
      </div>

      {slug && (
        <>
          <dl data-reveal="up" className="mt-[26px] flex justify-center gap-2.5">
            {ATTENDANCE.map((key) => (
              <div key={key} className="flex flex-1 flex-col-reverse rounded-xl bg-ivory px-1.5 py-2.5 font-sans text-[10px] text-sogan-500">
                <dt>{ATTENDANCE_LABEL[key]}</dt>
                <dd className="font-display text-xl text-sogan-800 tabular-nums">{summary[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="thin-scrollbar mt-4 grid max-h-[340px] gap-2.5 overflow-y-auto pr-1 text-left" aria-live="polite">
            {loadError && <p className="small-ui text-center">{loadError}</p>}
            {!loadError && entries.length === 0 && page && (
              <p className="small-ui text-center italic">Belum ada ucapan. Jadilah yang pertama mengirim doa restu.</p>
            )}
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-[14px] border-l-[3px] border-blush-deep bg-ivory px-4 py-3.5">
                <p className="flex flex-wrap items-center gap-1.5">
                  <span className="font-sans text-[12.5px] font-medium text-sogan-800">{entry.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-sans text-[9.5px]",
                      entry.attendance === "hadir" ? "bg-blush/40 text-blush-ink" : "bg-cream-200 text-sogan-700",
                    )}
                  >
                    {ATTENDANCE_LABEL[entry.attendance]}
                  </span>
                </p>
                {entry.message && <p className="mt-1 text-[15px] leading-normal text-sogan-700 [text-wrap:pretty]">{entry.message}</p>}
                <time dateTime={entry.created_at} className="mt-1 block font-sans text-[10px] text-sogan-500">
                  {relativeTime(entry.created_at)}
                </time>
              </article>
            ))}
            {hasMore && (
              <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-outline mx-auto mt-1 border-gold-600 text-sogan-700">
                {isLoadingMore ? "Memuat…" : "Muat ucapan lainnya"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
