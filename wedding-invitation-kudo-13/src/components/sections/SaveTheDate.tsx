"use client";

import { CalendarPlus } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { downloadIcs } from "@/lib/calendar";
import { formatDotDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Glyph, TopCorners } from "../klenteng/Ornaments";
import { BlossomBush, PlumTree } from "../klenteng/Trees";
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
  useSwayZone(ref);
  useScrollScene(ref);

  const firstEvent = content.events[0];
  const countdown = useCountdown(firstEvent?.start ?? "");
  const dotDate = firstEvent ? formatDotDate(firstEvent.start, content.timeZone) : "";

  return (
    <section ref={ref} id="save-the-date" aria-labelledby="std-title" className="sec coin-bg overflow-hidden pb-0">
      <TopCorners />
      <SectionHeading
        id="std-title"
        title="Save The Date"
        variant="display"
        lead={
          <>
            <span lang="zh" className="font-han tracking-[4px] text-red-700">
              缘分
            </span>{" "}
            · <em>yuánfèn</em>
            <br />
            <span className="small-ui">Takdir yang mempertemukan dua hati.</span>
          </>
        }
      />

      {content.coverPhoto && (
        <div data-reveal="zoom" className="moon mt-7 h-[240px] w-[240px]">
          <div className="moon-in">
            <Photo src={content.coverPhoto} alt={`Foto ${coupleLabel}`} parallax={5} className="h-full w-full" />
            {dotDate && (
              <p className="absolute inset-x-0 bottom-7 z-[1] font-display text-[11px] tracking-[3px] text-gold-300 [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
                {dotDate}
              </p>
            )}
          </div>
        </div>
      )}

      <div data-reveal="up" className="mb-6 mt-[26px]">
        {countdown?.done ? (
          <p className="font-script text-4xl text-red-700">Hari bahagia telah tiba</p>
        ) : (
          <div className="flex justify-center gap-2.5" role="timer" aria-label="Hitung mundur menuju hari pernikahan">
            {UNITS.map(({ key, label }) => (
              <div key={key} className="w-[68px] rounded-[14px] bg-red-700 pb-2.5 pt-3 text-gold-300 shadow-[inset_0_0_0_1px_rgba(237,217,160,0.55)] max-[360px]:w-[60px]">
                <span className="block font-display text-[26px] font-medium tabular-nums text-ivory">
                  {countdown ? (key === "days" ? countdown.days : String(countdown[key]).padStart(2, "0")) : "–"}
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[2px]">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div data-reveal="up">
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-red">
          <CalendarPlus className="h-[15px] w-[15px]" aria-hidden />
          Simpan ke Kalender
        </button>
      </div>

      {/*
        Adegan kecil: klenteng di antara pohon mei & semak. Urutan lapis: klenteng → tanah →
        pohon → semak. Klenteng 290×174 (viewBox 400×240): alasnya (y 234/240 → 4px dari bawah)
        berdiri di garis tanah.
      */}
      <div data-reveal="up" aria-hidden className="relative -mx-10 mt-[26px] h-[270px] max-[360px]:-mx-8">
        <Glyph id="temple" className="absolute bottom-3 left-1/2 z-[2] -ml-[145px] h-[174px] w-[290px]" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-red-700/15 to-red-700/30" />
        <div className="absolute -bottom-1.5 -left-[14%] z-[3] h-[118%] w-[48%]">
          <PlumTree seed={31} lean={10} />
        </div>
        <div className="absolute -bottom-1.5 -right-[14%] z-[3] h-[118%] w-[48%]">
          <PlumTree seed={44} lean={8} mirror />
        </div>
        <div className="absolute -bottom-[34%] -left-[14%] z-[4] aspect-square w-[44%]">
          <BlossomBush seed={17} tone="mid" />
        </div>
        <div className="absolute -bottom-[34%] -right-[14%] z-[4] aspect-square w-[44%]">
          <BlossomBush seed={26} tone="mid" mirror />
        </div>
      </div>
    </section>
  );
}
