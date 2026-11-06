"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Download } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { downloadIcs, googleCalendarLink } from "@/lib/calendar";
import { terbilang, monthGrid } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { EngravedCard } from "../ui/Ornaments";
import { SectionTitle } from "../ui/Frames";
import { Reveal } from "../ui/Reveal";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

/** Lingkaran tinta burgundy yang "digoreskan" sekali di sekitar tanggal acara. */
function InkCircle() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 60 50" aria-hidden className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)] text-burgundy">
      <motion.path
        d="M30 4C14 4 4 13 5 25c1 13 13 21 27 20 14-1 24-9 23-21C54 12 42 4 26 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.4 }}
      />
    </svg>
  );
}

/** Kartu kalender bulan acara, tanggal dilingkari tinta, hitung mundur dalam kata. */
export function Calendar() {
  const { content, coupleLabel } = useInvitation();
  const first = content.events[0];
  const grid = monthGrid(first.start, content.timeZone);
  const left = useCountdown(first.start);

  return (
    <section id="tanggal" aria-labelledby="tanggal-title" className="px-4 py-20 sm:py-28">
      <SectionTitle label="Simpan tanggalnya" id="tanggal-title">
        {grid.monthLabel}
      </SectionTitle>

      <Reveal className="mx-auto mt-12 max-w-md">
        <EngravedCard corners={false} innerClassName="px-5 py-8 sm:px-8 sm:py-10">
          <table className="w-full table-fixed text-center">
            <caption className="sr-only">Kalender {grid.monthLabel}, tanggal {grid.day} ditandai</caption>
            <thead>
              <tr>
                {WEEKDAYS.map((d) => (
                  <th key={d} scope="col" className="pb-3 font-fell-sc text-sm font-normal tracking-wider text-umber">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.weeks.map((week, w) => (
                <tr key={w}>
                  {week.map((d, i) => (
                    <td key={i} className="py-1.5 font-serif text-lg text-ink/80">
                      {d === grid.day ? (
                        <span className="relative inline-block px-1 font-semibold text-burgundy">
                          {d}
                          <InkCircle />
                        </span>
                      ) : (
                        d ?? ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </EngravedCard>
      </Reveal>

      <Reveal className="mt-10 text-center">
        <p className="font-fell text-2xl italic text-burgundy first-letter:uppercase">
          {left === null ? " " : left.done ? "Hari bahagia telah tiba" : `${terbilang(left.days)} hari lagi`}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={googleCalendarLink(first, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-burgundy">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Google Calendar
          </a>
          <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-plain">
            <Download className="h-4 w-4" aria-hidden /> Simpan .ics
          </button>
        </div>
      </Reveal>
    </section>
  );
}
