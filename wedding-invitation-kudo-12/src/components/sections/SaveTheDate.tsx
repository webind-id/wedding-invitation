"use client";

import { CalendarPlus } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs } from "@/lib/calendar";
import { formatDotDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Glyph, TopCorners } from "../jawa/Ornaments";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

export function SaveTheDate() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const firstEvent = content.events[0];
  const countdown = useCountdown(firstEvent?.start ?? "");
  const dotDate = firstEvent ? formatDotDate(firstEvent.start, content.timeZone) : "";

  return (
    <section ref={ref} id="save-the-date" aria-labelledby="std-title" className="sec kawung-bg">
      <TopCorners />
      <SectionHeading
        id="std-title"
        title="Save The Date"
        variant="display"
        lead={
          <>
            <em>&ldquo;Witing tresna jalaran saka kulina&rdquo;</em>
            <br />
            <span className="small-ui">Cinta tumbuh karena terbiasa bersama.</span>
          </>
        }
      />

      {content.coverPhoto && (
        <div data-reveal="zoom" className="arch mt-7 h-[300px] w-[230px]">
          <div className="arch-in">
            <Photo src={content.coverPhoto} alt={`Foto ${coupleLabel}`} parallax={5} className="h-full w-full" />
            {dotDate && (
              <p className="absolute inset-x-0 bottom-5 z-[1] font-display text-[11px] tracking-[3px] text-gold-300 [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
                {dotDate}
              </p>
            )}
          </div>
        </div>
      )}

      <div data-reveal="up" className="mb-6 mt-[26px]" aria-live="off">
        {countdown?.done ? (
          <p className="font-script text-4xl text-sogan-700">Hari bahagia telah tiba</p>
        ) : (
          <div className="flex justify-center gap-2.5" role="timer" aria-label="Hitung mundur menuju hari pernikahan">
            {UNITS.map(({ key, label }) => (
              <div
                key={key}
                className="w-[68px] rounded-[14px] bg-sogan-800 pb-2.5 pt-3 text-gold-300 shadow-[inset_0_0_0_1px_rgba(206,172,89,0.5)] max-[360px]:w-[60px]"
              >
                <span className="block font-display text-[26px] font-medium tabular-nums text-ivory">
                  {countdown ? (key === "days" ? countdown.days : String(countdown[key]).padStart(2, "0")) : "–"}
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[2px] text-blush">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div data-reveal="up">
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-sogan">
          <CalendarPlus className="h-[15px] w-[15px]" aria-hidden />
          Simpan ke Kalender
        </button>
      </div>

      <div data-reveal="up">
        <Glyph id="joglo" className="mx-auto mt-[26px] block w-full max-w-[300px]" />
      </div>
    </section>
  );
}
