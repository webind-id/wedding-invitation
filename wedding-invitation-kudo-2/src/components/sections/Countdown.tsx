"use client";

import { CalendarPlus, Download } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { downloadIcs, googleCalendarLink } from "@/lib/calendar";
import { formatLongDate } from "@/lib/datetime";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

/** "Segera tayang": angka Bodoni raksasa di atas foto latar yang digelapkan. */
export function Countdown() {
  const { content, coupleLabel, photos } = useInvitation();
  const premiere = content.events[0];
  const left = useCountdown(premiere.start);
  const backdrop = content.posterPhoto || photoAt(photos, 1);

  return (
    <section aria-labelledby="segera-tayang" className="film-grain relative overflow-hidden py-28 sm:py-36">
      <Photo src={backdrop} alt="" className="absolute inset-0" imgClassName="animate-slow-zoom opacity-40 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="credit" id="segera-tayang">
            Segera tayang
          </p>
          <p className="mt-4 font-display text-2xl italic text-ivory/90 sm:text-3xl">{formatLongDate(premiere.start, content.timeZone)}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          {left?.done ? (
            <p className="font-display text-4xl italic text-gold">Hari bahagia telah tiba</p>
          ) : (
            <ol className="grid grid-cols-4 divide-x divide-gold/25" aria-label="Hitung mundur">
              {UNITS.map(({ key, label }) => (
                <li key={key} className="px-1">
                  <span className="block font-display text-[clamp(2.6rem,10vw,6.5rem)] leading-none tabular-nums">
                    {left ? String(left[key]).padStart(2, "0") : "––"}
                  </span>
                  <span className="mt-3 block text-[0.6rem] uppercase tracking-[0.3em] text-smoke">{label}</span>
                </li>
              ))}
            </ol>
          )}
        </Reveal>

        <Reveal delay={0.25} className="mt-14 flex flex-wrap justify-center gap-3">
          <a href={googleCalendarLink(premiere, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-gold">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Google Calendar
          </a>
          <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-line">
            <Download className="h-4 w-4" aria-hidden /> Simpan .ics
          </button>
        </Reveal>
      </div>
    </section>
  );
}
