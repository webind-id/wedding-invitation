"use client";

import { ArrowUpRight } from "lucide-react";
import { mapsEmbedLink, mapsSearchLink } from "@/lib/calendar";
import { formatClock } from "@/lib/datetime";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

/** Acara sebagai panel kaca cokelat di atas panggung foto. */
export function EventsScene() {
  const { content, timeZoneLabel, photos } = useInvitation();
  const tz = content.timeZone;
  const venues = Array.from(new Map(content.events.map((e) => [e.venue, e])).values());

  return (
    <Scene chapter="acara" photo={photoAt(photos, 5)} anchor label="Acara">
      <div className="mx-auto w-full max-w-6xl px-6 py-32 sm:px-10">
        <ChapterHeading chapter="acara">
          Rangkaian <em>hari bahagia</em>
        </ChapterHeading>

        <ol className="mt-14 grid gap-5 md:grid-cols-2">
          {content.events.map((event, i) => (
            <Reveal as="li" key={event.id} delay={i * 0.2} effect="rise">
              <article className="glass flex h-full flex-col rounded-3xl p-7 sm:p-9">
                <p className="kicker">{event.note || `Acara ${i + 1}`}</p>
                <h3 className="mt-3 font-serif text-4xl">{event.name}</h3>
                <p className="mt-6 font-serif text-3xl italic text-cream/90">
                  {formatClock(event.start, tz)} <span className="text-cream/40">—</span> {formatClock(event.end, tz)}
                  <span className="ml-2 font-sans text-xs not-italic tracking-[0.2em] text-cream/50">{timeZoneLabel}</span>
                </p>
                <div className="my-6 h-px bg-cream/10" />
                <p className="font-medium">{event.venue}</p>
                <p className="mt-1 text-sm leading-relaxed text-cream/60">{event.address}</p>
                <a
                  href={mapsSearchLink(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-cream/80 transition duration-500 hover:text-cream"
                >
                  Petunjuk arah <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </article>
            </Reveal>
          ))}
        </ol>

        {venues.map((event) => (
          <Reveal key={event.venue} effect="fade" className="mt-5">
            <div className="glass overflow-hidden rounded-3xl p-1.5">
              <iframe
                title={`Peta ${event.venue}`}
                src={mapsEmbedLink(event)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                // Peta terang dibalik & diberi rona sepia agar serasi dengan palet cokelat.
                className="block h-72 w-full rounded-[1.25rem] [filter:grayscale(1)_invert(0.9)_sepia(0.35)_contrast(0.9)] sm:h-80"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Scene>
  );
}
