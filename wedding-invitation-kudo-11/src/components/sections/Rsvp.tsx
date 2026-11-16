"use client";

import { MessageSquare, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { requestJson } from "@/lib/api";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { replyDeadline } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { LanternSky } from "../lantern/LanternSky";
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
      className="night-sky-deep relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <LanternSky count={6} seed={64} options={{ maxSize: 30 }} />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          id="rsvp-title"
          badge="RSVP & Wishes"
          scriptTitle="Doa & Restu"
          title="Kirim Doa ke Langit"
          subtitle={
            deadline
              ? `Merupakan suatu kehormatan bagi kami atas kehadiran Anda. Mohon konfirmasi sebelum ${deadline}.`
              : "Titipkan doa tulus dan konfirmasi kehadiran Anda — setiap ucapan adalah lampion yang menerangi langkah kami."
          }
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Kolom Kiri: Form RSVP */}
          <div data-reveal="up" className="glass-night p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-semibold text-moon mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-ember-300" aria-hidden />
              <span>Formulir Kehadiran</span>
            </h3>

            {slug ? (
              <RsvpForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
            ) : (
              <div className="rounded-xl border border-dashed border-gold/30 bg-night-900/60 p-6 text-center text-xs text-moon-muted font-sans leading-relaxed">
                Buku tamu interaktif aktif secara otomatis saat tautan undangan diterbitkan.
              </div>
            )}
          </div>

          {/* Kolom Kanan: Daftar Ucapan Buku Tamu */}
          <div data-reveal="up" className="glass-night flex h-[540px] flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-4">
              <h3 className="font-serif text-2xl font-semibold text-moon flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-ember-300" aria-hidden />
                <span>Untaian Doa</span>
              </h3>
              {page && (
                <span className="badge-gold">
                  {page.total} Pesan
                </span>
              )}
            </div>

            <div className="thin-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
              {entries.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-xs italic text-moon-subtle">
                  Belum ada ucapan. Jadilah yang pertama mengirimkan doa restu!
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-gold/15 bg-night-900/60 p-4 transition-colors hover:border-ember/30"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="truncate font-serif text-base font-semibold text-gold-light">
                        {entry.name}
                      </p>
                      <span className="shrink-0 text-[0.68rem] text-moon-subtle">
                        {relativeTime(entry.created_at)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span
                        className={
                          entry.attendance === "hadir"
                            ? "inline-block rounded-full bg-ember/15 px-2.5 py-0.5 text-[0.68rem] font-semibold text-ember-200"
                            : entry.attendance === "tidak_hadir"
                            ? "inline-block rounded-full bg-vermilion/20 px-2.5 py-0.5 text-[0.68rem] font-semibold text-vermilion-300"
                            : "inline-block rounded-full bg-night-600/60 px-2.5 py-0.5 text-[0.68rem] font-semibold text-moon-muted"
                        }
                      >
                        {ATTENDANCE_LABEL[entry.attendance]}
                      </span>
                    </div>

                    <p className="text-sm text-moon/90 leading-relaxed [text-wrap:pretty]">
                      {entry.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {hasMore && (
              <div className="border-t border-gold/15 pt-4 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="btn-night w-full text-xs sm:text-xs"
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
