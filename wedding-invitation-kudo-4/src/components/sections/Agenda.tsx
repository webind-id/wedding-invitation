"use client";

import { ArrowUpRight, CalendarPlus, Download } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { downloadIcs, googleCalendarLink, mapsEmbedLink, mapsSearchLink } from "@/lib/calendar";
import { dateStub, formatClock, formatLongDate } from "@/lib/datetime";
import { weekdayMonthYear } from "@/lib/issue";
import { useInvitation } from "../InvitationContext";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";

/** Agenda gaya kalender majalah: tanggal raksasa di kiri, daftar acara bergaris rambut di kanan. */
export function Agenda() {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const tz = content.timeZone;
  const first = content.events[0];
  const stub = dateStub(first.start, tz);
  const left = useCountdown(first.start);
  const venues = Array.from(new Map(content.events.map((e) => [e.venue, e])).values());

  return (
    <section id="agenda" data-rubric="agenda" aria-labelledby="agenda-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
      <Opener id="agenda" titleId="agenda-title" deck={formatLongDate(first.start, tz)}>
        Simpan <em>tanggalnya</em>
      </Opener>

      <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="font-serif text-[clamp(9rem,26vw,19rem)] font-light leading-[0.75] tracking-[-0.06em]">{stub.day}</p>
          <p className="mt-4 font-serif text-3xl italic">
            {weekdayMonthYear(first.start, tz)}
          </p>
          <p className="rubric mt-8">
            {left === null ? " " : left.done ? "Hari bahagia telah tiba" : `Dalam ${left.days} hari ${left.hours} jam ${left.minutes} menit`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={googleCalendarLink(first, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-ink">
              <CalendarPlus className="h-4 w-4" aria-hidden /> Google Calendar
            </a>
            <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-outline">
              <Download className="h-4 w-4" aria-hidden /> .ics
            </button>
          </div>
        </Reveal>

        <ol className="lg:col-span-6 lg:col-start-7">
          {content.events.map((event, i) => (
            <Reveal as="li" key={event.id} delay={i * 0.1} className="border-t border-ink py-8 last:border-b">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-4xl font-light">{event.name}</h3>
                <p className="shrink-0 font-serif text-xl italic text-gold">
                  {formatClock(event.start, tz)}–{formatClock(event.end, tz)} <span className="rubric">{timeZoneLabel}</span>
                </p>
              </div>
              <p className="mt-4 font-serif text-lg">{event.venue}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone">{event.address}</p>
              {event.note && <p className="mt-3 font-serif text-sm italic text-stone">{event.note}</p>}
              <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="rubric link-underline mt-5 inline-flex items-center gap-1.5 text-ink">
                Petunjuk arah <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </Reveal>
          ))}
        </ol>
      </div>

      {venues.map((event, i) => (
        <Reveal key={event.venue} className="mt-16">
          <figure>
            <iframe
              title={`Peta ${event.venue}`}
              src={mapsEmbedLink(event)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Peta dibuat monokrom hangat agar menyatu dengan kertas ivory.
              className="block h-80 w-full [filter:grayscale(1)_sepia(0.25)_contrast(0.95)]"
            />
            <figcaption className="mt-3 flex gap-3 text-[0.72rem] text-stone">
              <span className="font-sans font-medium uppercase tracking-[0.18em] text-ink">Peta {String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif italic">
                {event.venue}, {event.address}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </section>
  );
}
