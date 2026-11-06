"use client";

import { CalendarPlus, Download } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { downloadIcs, googleCalendarLink } from "@/lib/calendar";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";


const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

export function SaveTheDate() {
  const { content, coupleLabel } = useInvitation();
  const firstEvent = content.events[0];
  const left = useCountdown(firstEvent.start);

  return (
    <section aria-labelledby="hitung-mundur" className="grain bg-moss px-6 py-20 text-linen">
      <Heading eyebrow="Simpan tanggalnya" id="hitung-mundur" tone="light">
        {formatLongDate(firstEvent.start, content.timeZone)}
      </Heading>

      <FadeIn className="mt-10">
        {left?.done ? (
          <p className="text-center font-display text-2xl italic">Hari bahagia telah tiba ✦</p>
        ) : (
          <ol className="grid grid-cols-4 gap-2" aria-live="off">
            {UNITS.map(({ key, label }) => (
              <li key={key} className="rounded-2xl bg-linen/10 px-1 py-4 text-center ring-1 ring-linen/15">
                <span className="block font-display text-4xl font-light tabular-nums">
                  {left ? String(left[key]).padStart(2, "0") : "––"}
                </span>
                <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.22em] text-linen/60">{label}</span>
              </li>
            ))}
          </ol>
        )}
      </FadeIn>

      <FadeIn className="mt-8 flex flex-wrap justify-center gap-3" delay={0.1}>
        <a
          href={googleCalendarLink(firstEvent, coupleLabel)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-linen text-forest hover:bg-blush"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden />
          Google Calendar
        </a>
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-light">
          <Download className="h-4 w-4" aria-hidden />
          File .ics
        </button>
      </FadeIn>
    </section>
  );
}
