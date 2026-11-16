"use client";

import { CalendarPlus, Clock, Compass, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, mapsSearchLink } from "@/lib/calendar";
import { dateStub, formatClock, formatLongDate } from "@/lib/datetime";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { LanternSky } from "../lantern/LanternSky";
import { SectionHeading } from "../ui/SectionHeading";

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const stub = dateStub(event.start, content.timeZone);

  return (
    <article data-reveal="up" className="glass-night glass-night-hover flex flex-col overflow-hidden p-0 md:flex-row md:p-0">
      {/* Kolom tanggal berbentuk kertas lampion yang menyala */}
      <div className="relative flex shrink-0 flex-row items-center justify-between gap-2 bg-gradient-to-b from-ember-200 via-ember-400 to-vermilion-600 p-5 text-night-950 md:w-44 md:flex-col md:justify-center md:p-8">
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_22%,rgba(110,35,10,0.14)_22%_23%)]" />
        <span className="relative font-sans text-xs font-semibold uppercase tracking-[0.25em]">{stub.weekday}</span>
        <span className="relative my-1 font-serif text-5xl font-bold leading-none">{stub.day}</span>
        <span className="relative font-sans text-xs font-semibold uppercase tracking-[0.25em]">{stub.month}</span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="badge-gold">Acara {String(index + 1).padStart(2, "0")}</span>
            <span className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-ember-200">
              <Clock className="h-4 w-4" aria-hidden />
              {formatClock(event.start, content.timeZone)} – {event.end ? formatClock(event.end, content.timeZone) : "Selesai"} {timeZoneLabel}
            </span>
          </div>

          <h3 className="mt-4 font-serif text-3xl font-semibold text-moon">{event.name}</h3>
          <p className="mt-1 text-sm text-moon-muted">{formatLongDate(event.start, content.timeZone)}</p>

          <div className="mt-5 flex items-start gap-2.5 border-t border-gold/15 pt-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ember-300" aria-hidden />
            <div>
              <p className="font-serif text-lg font-semibold text-moon">{event.venue}</p>
              {event.address && <p className="mt-1 text-sm leading-relaxed text-moon-muted">{event.address}</p>}
              {event.note && (
                <p className="mt-2 inline-block rounded-md border border-ember/25 bg-ember/10 px-2.5 py-1 text-xs italic text-ember-100">
                  * {event.note}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-ember text-xs sm:text-xs">
            <Compass className="h-4 w-4" aria-hidden />
            <span>Buka Peta</span>
          </a>
          <button type="button" onClick={() => downloadIcs([event], coupleLabel)} className="btn-night text-xs sm:text-xs">
            <CalendarPlus className="h-4 w-4" aria-hidden />
            <span>Simpan ke Kalender</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function Events() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="events" aria-labelledby="events-title" className="night-sky relative overflow-hidden px-4 py-20 sm:py-28">
      <LanternSky count={8} seed={58} options={{ maxSize: 34 }} />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          id="events-title"
          badge="Save the Date"
          scriptTitle="Waktu & Tempat"
          title="Rangkaian Acara"
          subtitle="Dengan penuh sukacita kami menantikan kehadiran Anda untuk bersama-sama menerbangkan doa di malam bahagia kami."
        />

        <div className="mt-10 space-y-8">
          {content.events.map((event, i) => (
            <EventCard key={event.id || i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
