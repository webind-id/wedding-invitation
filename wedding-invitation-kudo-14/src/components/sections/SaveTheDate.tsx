"use client";

import { CalendarPlus } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs } from "@/lib/calendar";
import { datePlate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { Photo } from "../ui/Photo";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

/**
 * Babak "Pangeling" (pengingat): tanggal besar bergaya editorial di samping foto bergerbang,
 * hitung mundur di empat jendela gerbang kecil, dan tombol simpan ke kalender.
 */
export function SaveTheDate() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const firstEvent = content.events[0];
  const countdown = useCountdown(firstEvent?.start ?? "");
  const plate = firstEvent ? datePlate(firstEvent.start, content.timeZone) : null;

  return (
    <section ref={ref} id="save-the-date" aria-labelledby="std-title" className="sec kawung-bg">
      <Babak
        id="std-title"
        name="Pangeling"
        title="Save The Date"
        lead={
          <>
            <em>&ldquo;Witing tresna jalaran saka kulina&rdquo;</em>
            <span className="small-ui block">Cinta tumbuh karena terbiasa bersama.</span>
          </>
        }
      />

      <div className="mt-10 grid grid-cols-[1fr_46%] items-center gap-5">
        {plate && (
          <p data-reveal="up" className="text-left text-marun-800">
            <span className="block font-sans text-[10px] uppercase tracking-[4px] text-blush-ink">{plate.weekday}</span>
            <span className="block font-display text-[96px] font-medium leading-[0.9] tracking-[-2px] max-[360px]:text-[80px]">{plate.day}</span>
            <span className="block font-script text-[40px] leading-none text-blush-deep">{plate.month}</span>
            <span className="mt-1 block font-display text-lg tracking-[6px] text-marun-700">{plate.year}</span>
          </p>
        )}
        {content.coverPhoto && (
          <div data-reveal="zoom" className="gerbang h-[250px]">
            <Photo src={content.coverPhoto} alt={`Foto ${coupleLabel}`} parallax={5} className="h-full w-full" />
          </div>
        )}
      </div>

      <div data-reveal="up" className="mt-10" aria-live="off">
        {countdown?.done ? (
          <p className="font-script text-4xl text-marun-800">Hari bahagia telah tiba</p>
        ) : (
          <div className="grid grid-cols-4 gap-2.5" role="timer" aria-label="Hitung mundur menuju hari pernikahan">
            {UNITS.map(({ key, label }) => (
              <div key={key} className="gerbang is-light flex h-[104px] flex-col items-center justify-end pb-4 text-center">
                <span className="relative z-[2] font-display text-[28px] font-medium leading-none tabular-nums text-marun-800 max-[360px]:text-2xl">
                  {countdown ? (key === "days" ? countdown.days : String(countdown[key]).padStart(2, "0")) : "–"}
                </span>
                <span className="relative z-[2] mt-1.5 font-sans text-[9px] uppercase tracking-[2px] text-blush-ink">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div data-reveal="up" className="mt-7 text-center">
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-marun">
          <CalendarPlus className="h-[15px] w-[15px]" aria-hidden />
          Simpan ke Kalender
        </button>
      </div>
    </section>
  );
}
