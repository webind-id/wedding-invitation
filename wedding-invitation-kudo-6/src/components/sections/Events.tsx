"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, googleCalendarLink, mapsSearchLink } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { dateStub, formatClock, formatLongDate } from "@/lib/datetime";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Petal } from "../three/Petal";
import { SectionHeading } from "../ui/SectionHeading";

const UNITS = [
  ["days", "Hari"],
  ["hours", "Jam"],
  ["minutes", "Menit"],
  ["seconds", "Detik"],
] as const;

function Countdown({ target }: { target: string }) {
  const left = useCountdown(target);
  if (left?.done) return <p className="text-center font-display text-2xl italic">Hari bahagia telah tiba.</p>;
  return (
    <dl data-reveal-group className="mx-auto grid max-w-md grid-cols-4 gap-3 sm:gap-4">
      {UNITS.map(([key, label]) => (
        <div key={key} data-reveal-item className="pearl-card rounded-[1.25rem] py-4 text-center">
          <dd className="font-display text-3xl font-light tabular-nums sm:text-4xl">{left ? String(left[key]).padStart(2, "0") : "—"}</dd>
          <dt className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-mauve">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const stub = dateStub(event.start, content.timeZone);

  return (
    // Kartu berbalik menghadap pengunjung saat mendekati tengah layar.
    <div className="[perspective:1200px]">
      <div data-turn={index % 2 ? -22 : 22} className="preserve-3d">
        <article data-reveal="up" className="pearl-card flex h-full flex-col rounded-[2rem] p-7 sm:p-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="label">Acara {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-3xl italic leading-tight sm:text-4xl">{event.name}</h3>
            </div>
            <div className="shrink-0 text-center" aria-hidden>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mauve">{stub.weekday}</p>
              <p className="font-display text-5xl font-light leading-none text-champagne-deep">{stub.day}</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mauve">{stub.month}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-1 border-t border-champagne/50 pt-6">
            <dt className="sr-only">Tanggal</dt>
            <dd className="font-display text-xl">{formatLongDate(event.start, content.timeZone)}</dd>
            <dt className="sr-only">Waktu</dt>
            <dd className="text-ink/70">
              {formatClock(event.start, content.timeZone)} – {formatClock(event.end, content.timeZone)} {timeZoneLabel}
            </dd>
            <dt className="sr-only">Tempat</dt>
            <dd className="pt-4 font-display text-lg leading-snug">{event.venue}</dd>
            <dd className="text-sm leading-relaxed text-ink/65">{event.address}</dd>
            {event.note && <dd className="pt-2 text-sm italic text-mauve">{event.note}</dd>}
          </dl>

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Lihat peta
            </a>
            <a href={googleCalendarLink(event, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <CalendarPlus className="h-3.5 w-3.5" aria-hidden /> Google Calendar
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

export function Events() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="acara" aria-labelledby="events-title" className="pearl-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-depth="120" className="absolute left-[6%] top-[22%]">
          <Petal size="2.2rem" rotate={-20} />
        </div>
        <div data-depth="-60" className="absolute right-[8%] top-[40%]">
          <Petal size="1.6rem" rotate={70} tone="#EAD9BF" />
        </div>
        <div data-depth="160" className="absolute bottom-[12%] right-[14%]">
          <Petal size="2.6rem" rotate={20} />
        </div>
      </div>

      <SectionHeading id="events-title" label="Detail acara" title="Simpan tanggalnya" />

      <div className="relative mt-14">
        <Countdown target={content.events[0].start} />
      </div>

      <div className={cn("relative mx-auto mt-16 grid max-w-5xl gap-8", content.events.length > 1 && "md:grid-cols-2")}>
        {content.events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      <div data-reveal="up" className="relative mt-12 text-center">
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-pearl">
          <CalendarPlus className="h-4 w-4" aria-hidden /> Simpan semua ke kalender
        </button>
      </div>
    </section>
  );
}
