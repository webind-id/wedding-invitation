"use client";

import { CalendarPlus, Download } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { downloadIcs, googleCalendarLink } from "@/lib/calendar";
import { dateStub, formatLongDate } from "@/lib/datetime";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

const UNITS = [
  { key: "days", label: "hari" },
  { key: "hours", label: "jam" },
  { key: "minutes", label: "menit" },
  { key: "seconds", label: "detik" },
] as const;

/** Tanggal besar bergaya judul + hitung mundur ringkas seperti timecode. */
export function TimeScene() {
  const { content, coupleLabel, photos } = useInvitation();
  const first = content.events[0];
  const left = useCountdown(first.start);
  const stub = dateStub(first.start, content.timeZone);

  return (
    <Scene chapter="waktu" photo={photoAt(photos, 4)} anchor label="Waktu" className="flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-32 sm:px-10">
        <ChapterHeading chapter="waktu">{formatLongDate(first.start, content.timeZone)}</ChapterHeading>

        <Reveal delay={0.2} className="mt-12">
          <p aria-hidden className="font-serif text-[clamp(6rem,24vw,16rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(239,230,214,0.55)]">
            {stub.day}
            <span className="ml-4 align-top text-[0.3em] italic text-cream/70 [-webkit-text-stroke:0]">{stub.month}</span>
          </p>
        </Reveal>

        <Reveal delay={0.4} className="mt-10">
          {left?.done ? (
            <p className="subtitle font-serif text-3xl italic">Hari yang dinanti telah tiba.</p>
          ) : (
            <p role="timer" aria-label="Hitung mundur" className="subtitle flex flex-wrap items-baseline gap-x-5 gap-y-3 font-sans text-sm tracking-[0.3em] text-cream/80 sm:gap-x-0">
              {UNITS.map(({ key, label }, i) => (
                <span key={key} className="whitespace-nowrap">
                  {i > 0 && <span className="mx-3 hidden text-cream/30 sm:inline">:</span>}
                  <span className="font-serif text-4xl tracking-normal text-cream tabular-nums sm:text-5xl">
                    {left ? String(left[key]).padStart(2, "0") : "––"}
                  </span>
                  <span className="ml-1.5 text-[0.6rem] uppercase text-cream/50">{label}</span>
                </span>
              ))}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.6} effect="fade" className="mt-12 flex flex-wrap gap-3">
          <a href={googleCalendarLink(first, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-cream">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Google Calendar
          </a>
          <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-ghost">
            <Download className="h-4 w-4" aria-hidden /> Simpan .ics
          </button>
        </Reveal>
      </div>
    </Scene>
  );
}
