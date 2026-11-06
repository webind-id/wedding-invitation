"use client";

import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/datetime";
import { addToSummary, ATTENDANCE_LABEL, type GuestbookEntry, type GuestbookPage, type GuestbookSummary } from "@/lib/guestbook";
import { useInvitation } from "../InvitationContext";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";
import { GuestbookForm } from "./GuestbookForm";

const BADGE: Record<GuestbookEntry["attendance"], string> = {
  hadir: "bg-moss/15 text-moss",
  tidak_hadir: "bg-clay/10 text-clay",
  ragu: "bg-bark/10 text-bark/70",
};

function SummaryStrip({ summary }: { summary: GuestbookSummary }) {
  const items = [
    { label: "Hadir", value: summary.hadir, hint: `${summary.heads} orang` },
    { label: "Berhalangan", value: summary.tidak_hadir },
    { label: "Belum pasti", value: summary.ragu },
  ];
  return (
    <dl className="grid grid-cols-3 divide-x divide-forest/10 rounded-2xl bg-white/50 py-3 text-center">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col-reverse">
          <dt className="text-[0.65rem] uppercase tracking-[0.15em] text-bark/60">
            {it.label}
            {it.hint && <span className="block normal-case tracking-normal text-moss">{it.hint}</span>}
          </dt>
          <dd className="font-display text-3xl text-forest">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Guestbook({ guestName }: { guestName: string }) {
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
        // Ucapan baru dari tamu lain menggeser offset — buang entri yang sudah tampil.
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
    <section id="ucapan" aria-labelledby="ucapan-title" className="grain px-5 py-20">
      <Heading eyebrow="Buku tamu" id="ucapan-title">
        Kirim doa & kabar
      </Heading>

      <FadeIn className="mt-10">
        {slug ? (
          <GuestbookForm slug={slug} defaultName={guestName} onSubmitted={handleSubmitted} />
        ) : (
          <p className="rounded-3xl border-2 border-dashed border-forest/15 p-6 text-center text-sm text-bark/60">
            Buku tamu aktif pada undangan yang dibuat lewat admin. Halaman ini hanya contoh tampilan.
          </p>
        )}
      </FadeIn>

      <div className="mt-10 space-y-4">
        {page && <SummaryStrip summary={page.summary} />}
        {loadError && !page && <p className="text-center text-xs text-bark/50">{loadError}</p>}

        {entries.length > 0 && (
          <ul className="no-scrollbar max-h-[28rem] space-y-3 overflow-y-auto pr-1" aria-label="Daftar ucapan">
            {entries.map((e) => (
              <li key={e.id} className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-lg italic leading-tight text-forest">{e.name}</p>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold", BADGE[e.attendance])}>
                    {ATTENDANCE_LABEL[e.attendance]}
                  </span>
                </div>
                {e.message && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-bark/80">{e.message}</p>}
                <time dateTime={e.created_at} className="mt-2 block text-[0.65rem] text-bark/45">
                  {relativeTime(e.created_at)}
                </time>
              </li>
            ))}
          </ul>
        )}

        {hasMore && (
          <div className="text-center">
            <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-ghost">
              {isLoadingMore ? "Memuat…" : "Muat lebih banyak"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
