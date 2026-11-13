"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, googleCalendarLink, mapsSearchLink } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { formatClock, formatLongDate } from "@/lib/datetime";
import { formatElevation, MOUNTAINS } from "@/lib/mountains";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { StickyScene } from "../film/StickyScene";

const LAWU = MOUNTAINS.lawu;

const UNITS = [
  ["days", "Hari"],
  ["hours", "Jam"],
  ["minutes", "Menit"],
  ["seconds", "Detik"],
] as const;

/** Hitung mundur bergaya timecode film: 213 : 06 : 29 : 53. */
function Timecode({ target }: { target: string }) {
  const left = useCountdown(target);
  if (left?.done) return <p className="text-center font-display text-3xl italic text-amber">Kita sudah tiba di puncak.</p>;
  return (
    <div data-reveal="fade" className="text-center">
      <p className="label text-seluloid/60">Estimasi tiba di tujuan</p>
      <dl className="mt-5 flex items-start justify-center gap-2 sm:gap-4">
        {UNITS.map(([key, label], i) => (
          <div key={key} className="flex items-start gap-2 sm:gap-4">
            {i > 0 && (
              <span aria-hidden className="font-mono text-3xl text-seluloid/30 sm:text-5xl">
                :
              </span>
            )}
            <div>
              <dd className="font-mono text-[2rem] font-medium tabular-nums leading-none text-seluloid sm:text-6xl">{left ? String(left[key]).padStart(2, "0") : "--"}</dd>
              <dt className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-amber">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Satu baris di papan informasi: tujuan, waktu, lokasi, dan tautan. */
function EventEntry({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const rows: [string, string, string?][] = [
    ["Tanggal", formatLongDate(event.start, content.timeZone)],
    ["Waktu", `${formatClock(event.start, content.timeZone)} – ${formatClock(event.end, content.timeZone)} ${timeZoneLabel}`],
    ["Lokasi", event.venue, event.address],
  ];

  return (
    <article data-reveal="up" className="flex h-full flex-col border-t border-seluloid/15 pt-7">
      <p className="label">Tujuan {String(index + 1).padStart(2, "0")}</p>
      <h3 className="credit mt-3 text-[clamp(1.9rem,5vw,2.6rem)] leading-tight">{event.name}</h3>

      <dl className="mt-6 space-y-4">
        {rows.map(([label, value, sub]) => (
          <div key={label} className="grid grid-cols-[5.2rem_1fr] gap-3">
            <dt className="pt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-seluloid/45">{label}</dt>
            <dd>
              <span className="text-[1.15rem] leading-snug text-seluloid">{value}</span>
              {sub && <span className="mt-0.5 block leading-relaxed text-seluloid/60">{sub}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {event.note && <p className="mt-5 font-display text-lg italic text-amber">{event.note}</p>}

      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <MapPin className="h-3.5 w-3.5" aria-hidden /> Lihat peta
        </a>
        <a href={googleCalendarLink(event, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <CalendarPlus className="h-3.5 w-3.5" aria-hidden /> Google Calendar
        </a>
      </div>
    </article>
  );
}

/** The Destination — Wedding Day. Fajar di puncak Lawu; papan informasi basecamp sebagai panel kaca gelap. */
export function Events() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="acara" aria-labelledby="events-title">
      <StickyScene scene="lawu" dim={0.5}>
        <div className="px-5 pb-28 pt-28 sm:px-10 sm:pb-40 sm:pt-36">
          <div data-reveal="fade" className="flex justify-center">
            <Slate scene={6} mountain="lawu" />
          </div>
          <TitleCard id="events-title" kicker="The Destination · Wedding Day" title="Hari Pernikahan" subtitle="tujuan akhir perjalanan kami" className="mt-6" />

          <div className="mt-16">
            <Timecode target={content.events[0].start} />
          </div>

          <div className="glass mx-auto mt-16 max-w-5xl px-6 pb-10 pt-6 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-6 font-mono text-[0.6rem] uppercase tracking-[0.26em]">
              <p className="text-amber">Papan informasi basecamp</p>
              <p className="text-seluloid/50">
                {LAWU.basecamp} · {formatElevation(LAWU.elevation)}
              </p>
            </div>
            <div className={cn("grid gap-12", content.events.length > 1 && "md:grid-cols-2 md:gap-14")}>
              {content.events.map((event, i) => (
                <EventEntry key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>

          <div data-reveal="up" className="mt-12 text-center">
            <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-film">
              <CalendarPlus className="h-4 w-4" aria-hidden /> Simpan ke kalender
            </button>
          </div>
        </div>
      </StickyScene>
    </section>
  );
}
