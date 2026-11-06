"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { mapsEmbedLink, mapsSearchLink } from "@/lib/calendar";
import { dateStub, formatClock } from "@/lib/datetime";
import { reelNumber } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";

/** Jadwal tayang: satu baris per acara — jam besar, nama, tempat, tombol arah. */
export function Showtimes() {
  const { content, timeZoneLabel } = useInvitation();
  const tz = content.timeZone;
  const venues = Array.from(new Map(content.events.map((e) => [e.venue, e])).values());

  return (
    <section id="jadwal" aria-labelledby="jadwal-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Title reel="02" label="Jadwal tayang" id="jadwal-title">
        Hari yang kami <em className="text-gold">nantikan</em>
      </Title>

      <ol className="mt-16 border-t border-gold/20">
        {content.events.map((event, i) => {
          const stub = dateStub(event.start, tz);
          return (
            <Reveal as="li" key={event.id} delay={i * 0.08} className="group border-b border-gold/20">
              <div className="grid gap-x-8 gap-y-4 py-8 transition-colors group-hover:bg-onyx/60 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:px-4">
                <div className="flex items-baseline gap-3 sm:block">
                  <span className="font-display text-sm italic text-gold/70">{reelNumber(i + 1)}</span>
                  <p className="font-display text-5xl leading-none tabular-nums sm:mt-1">{formatClock(event.start, tz)}</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.25em] text-smoke sm:mt-2">
                    s/d {formatClock(event.end, tz)} {timeZoneLabel}
                  </p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                    {stub.weekday}, {stub.day} {stub.month}
                  </p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">{event.name}</h3>
                  <p className="mt-3 flex items-start gap-2 text-sm text-smoke">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" aria-hidden />
                    <span>
                      <span className="text-ivory/85">{event.venue}</span> — {event.address}
                    </span>
                  </p>
                  {event.note && <p className="mt-2 text-xs italic text-gold/70">{event.note}</p>}
                </div>
                <a
                  href={mapsSearchLink(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-line justify-self-start sm:justify-self-end"
                >
                  Arah <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </Reveal>
          );
        })}
      </ol>

      {venues.map((event) => (
        <Reveal key={event.venue} effect="iris" className="mt-12">
          <div className="gold-frame">
            <iframe
              title={`Peta ${event.venue}`}
              src={mapsEmbedLink(event)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Peta terang dibalik jadi gelap agar menyatu dengan tema noir.
              className="block h-72 w-full [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)] sm:h-96"
            />
          </div>
        </Reveal>
      ))}
    </section>
  );
}
