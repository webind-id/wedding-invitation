"use client";

import { MessageSquare, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
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

  const hasMore = page !== null && entries.length < page.total;
  const deadline = content.events[0] ? replyDeadline(content.events[0].start, content.timeZone) : "";

  return (
    <section
      ref={ref}
      id="rsvp"
      aria-labelledby="rsvp-title"
      className="rustic-paper-warm relative overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Latar ──────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="30" className="absolute -left-6 top-[15%] opacity-65">
          <EucalyptusStem size={140} color="#6B7A5C" opacity={0.6} />
        </div>
        <div data-depth="-30" className="absolute -right-6 bottom-[10%] opacity-65">
          <DriedPalm size={150} color="#C86D51" opacity={0.5} mirror />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          badge="RSVP &amp; WISHES"
          scriptTitle="Doa &amp; Restu"
          title="Konfirmasi Kehadiran &amp; Ucapan"
          subtitle={
            deadline
              ? `Merupakan suatu kehormatan bagi kami atas kehadiran Anda. Mohon konfirmasi sebelum ${deadline}.`
              : "Kirimkan doa tulus dan konfirmasi kehadiran Anda untuk melengkapi kebahagiaan kami."
          }
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Kolom Kiri: Form RSVP */}
          <div data-reveal="up" className="rustic-card p-6 sm:p-8 bg-white/95 border border-sand-deep/60">
            <h3 className="font-serif text-xl font-bold text-earth-ink mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-terracotta" aria-hidden />
              <span>Formulir Kehadiran</span>
            </h3>

            {slug ? (
              <RsvpForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
            ) : (
              <div className="rounded-xl border border-dashed border-sand-deep/70 bg-cream-50 p-6 text-center text-xs text-earth-muted font-sans leading-relaxed">
                Buku tamu interaktif aktif secara otomatis saat tautan undangan diterbitkan.
              </div>
            )}
          </div>

          {/* Kolom Kanan: Daftar Ucapan Buku Tamu */}
          <div data-reveal="up" className="rustic-card p-6 sm:p-8 bg-white/95 border border-sand-deep/60 flex flex-col h-[540px]">
            <div className="flex items-center justify-between border-b border-dashed border-sand-deep/60 pb-4 mb-4">
              <h3 className="font-serif text-xl font-bold text-earth-ink flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-olive" aria-hidden />
                <span>Untaian Doa</span>
              </h3>
              {page && (
                <span className="badge-olive">
                  {page.total} Pesan
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {entries.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-xs text-earth-muted font-sans italic">
                  Belum ada ucapan. Jadilah yang pertama mengirimkan doa restu!
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-sand-deep/40 bg-cream-50/70 p-4 transition-all hover:bg-cream-50"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="font-serif text-sm font-bold text-earth-ink truncate">
                        {entry.name}
                      </p>
                      <span className="text-[0.68rem] text-earth-muted shrink-0">
                        {relativeTime(entry.created_at)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span
                        className={
                          entry.attendance === "hadir"
                            ? "inline-block rounded-full bg-olive-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-olive-800"
                            : entry.attendance === "tidak_hadir"
                            ? "inline-block rounded-full bg-terracotta-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-terracotta-800"
                            : "inline-block rounded-full bg-sand-soft px-2.5 py-0.5 text-[0.68rem] font-semibold text-earth-ink"
                        }
                      >
                        {ATTENDANCE_LABEL[entry.attendance]}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-earth-ink/90 leading-relaxed [text-wrap:pretty]">
                      {entry.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {hasMore && (
              <div className="pt-4 border-t border-dashed border-sand-deep/60 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="btn-rustic-ghost text-xs w-full justify-center"
                >
                  {isLoadingMore ? "Memuat..." : "Muat Ucapan Lainnya"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
