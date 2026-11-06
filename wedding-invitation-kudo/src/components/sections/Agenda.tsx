"use client";

import { Clock, MapPin, Navigation } from "lucide-react";
import type { CSSProperties } from "react";
import { mapsEmbedLink, mapsSearchLink } from "@/lib/calendar";
import { dateStub, formatClock } from "@/lib/datetime";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";

const STUB_WIDTH = "5.25rem";

function EventTicket({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, timeZoneLabel } = useInvitation();
  const tz = content.timeZone;
  const stub = dateStub(event.start, tz);
  const time = `${formatClock(event.start, tz)} – ${formatClock(event.end, tz)} ${timeZoneLabel}`;

  return (
    <FadeIn as="article" delay={index * 0.08}>
      <div
        className="ticket flex overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-28px_rgba(31,58,46,0.6)]"
        style={{ "--seam": STUB_WIDTH } as CSSProperties}
      >
        <div
          className="flex shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-linen bg-clay py-6 text-linen"
          style={{ width: STUB_WIDTH }}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-80">{stub.weekday}</span>
          <span className="font-display text-4xl leading-none">{stub.day}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em]">{stub.month}</span>
        </div>
        <div className="min-w-0 flex-1 px-5 py-5">
          <h3 className="font-display text-2xl italic text-forest">{event.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-bark/80">
            <Clock className="h-3.5 w-3.5 text-clay" aria-hidden />
            {time}
          </p>
          <p className="mt-1.5 flex items-start gap-2 text-xs text-bark/70">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay" aria-hidden />
            <span>
              <span className="font-semibold text-bark">{event.venue}</span>
              <br />
              {event.address}
            </span>
          </p>
          {event.note && <p className="mt-3 text-[0.7rem] italic text-moss">{event.note}</p>}
          <a
            href={mapsSearchLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-clay underline-offset-4 hover:underline"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden />
            Petunjuk arah
          </a>
        </div>
      </div>
    </FadeIn>
  );
}

export function Agenda() {
  // Peta hanya sekali bila semua acara di tempat yang sama.
  const { events } = useInvitation().content;
  const venues = Array.from(new Map(events.map((e) => [e.venue, e])).values());

  return (
    <section id="acara" aria-labelledby="acara-title" className="grain px-5 py-20">
      <Heading eyebrow="Rangkaian acara" id="acara-title">
        Hari yang kami nanti
      </Heading>

      <div className="mt-10 space-y-5">
        {events.map((event, i) => (
          <EventTicket key={event.id} event={event} index={i} />
        ))}
      </div>

      {venues.map((event) => (
        <FadeIn key={event.venue} className="mt-8">
          <div className="overflow-hidden rounded-[1.75rem] border-4 border-white shadow-[0_20px_40px_-28px_rgba(31,58,46,0.6)]">
            <iframe
              title={`Peta ${event.venue}`}
              src={mapsEmbedLink(event)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-60 w-full grayscale-[40%] sepia-[20%]"
            />
          </div>
        </FadeIn>
      ))}
    </section>
  );
}
