"use client";

import { Fragment } from "react";
import { mapsEmbedLink, mapsSearchLink } from "@/lib/calendar";
import { formatClock } from "@/lib/datetime";
import { timeInWords } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { SectionTitle } from "../ui/Frames";
import { EngravedCard, Fleuron } from "../ui/Ornaments";
import { Reveal } from "../ui/Reveal";

/** Kartu susunan acara bergaya program resepsi klasik, plus peta sebagai "pelat" bergambar. */
export function Programme() {
  const { content, timeZoneLabel } = useInvitation();
  const tz = content.timeZone;
  const venues = Array.from(new Map(content.events.map((e) => [e.venue, e])).values());

  return (
    <section id="acara" aria-labelledby="acara-title" className="bg-bottle px-4 py-20 text-antique sm:py-28">
      <SectionTitle label="Susunan acara" id="acara-title" light>
        Rangkaian Upacara
      </SectionTitle>

      <Reveal className="mx-auto mt-12 max-w-xl">
        <EngravedCard innerClassName="text-center">
          {content.events.map((event, i) => (
            <Fragment key={event.id}>
              {i > 0 && <Fleuron className="my-10" />}
              <article>
                <h3 className="font-fell text-[2.2rem] leading-tight text-burgundy">{event.name}</h3>
                <p className="mt-2 font-serif text-lg italic text-umber">
                  {timeInWords(event.start, tz)}
                  <span className="mx-2 text-umber/50">·</span>
                  <span className="not-italic tabular-nums">
                    {formatClock(event.start, tz)}–{formatClock(event.end, tz)} {timeZoneLabel}
                  </span>
                </p>
                <p className="smallcaps mt-4 text-burgundy">{event.venue}</p>
                <p className="mx-auto mt-1 max-w-sm font-serif text-ink/80">{event.address}</p>
                {event.note && <p className="mt-3 font-fell italic text-umber">— {event.note} —</p>}
                <a
                  href={mapsSearchLink(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="smallcaps mt-5 inline-block border-b border-burgundy/40 text-sm text-burgundy transition hover:border-burgundy"
                >
                  Petunjuk arah
                </a>
              </article>
            </Fragment>
          ))}
        </EngravedCard>
      </Reveal>

      {venues.map((event, i) => (
        <Reveal key={event.venue} as="figure" className="mx-auto mt-12 max-w-3xl">
          <div className="bg-antique p-2 ring-1 ring-antique/30">
            <div className="border-[3px] border-double border-burgundy/50 p-1.5">
              <iframe
                title={`Peta ${event.venue}`}
                src={mapsEmbedLink(event)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                // Peta bernuansa sepia seperti pelat cetak lama.
                className="block h-72 w-full [filter:grayscale(1)_sepia(0.55)_contrast(0.92)_brightness(0.98)] sm:h-80"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-center font-fell italic text-antique/80">Pelat {["I", "II", "III", "IV", "V", "VI"][i] ?? i + 1} — {event.venue}</figcaption>
        </Reveal>
      ))}
    </section>
  );
}
