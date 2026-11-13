"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, googleCalendarLink, mapsSearchLink } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { dateStub, formatClock, formatLongDate } from "@/lib/datetime";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Gunungan } from "../three/Gunungan";
import { JogloRoof } from "../three/JogloRoof";
import { SectionHeading } from "../ui/SectionHeading";

const UNITS = [
  ["days", "Dinten"],
  ["hours", "Jam"],
  ["minutes", "Menit"],
  ["seconds", "Detik"],
] as const;

function Countdown({ target }: { target: string }) {
  const left = useCountdown(target);
  if (left?.done) return <p className="text-center font-serif text-2xl italic text-gading">Dinten bahagia sampun rawuh.</p>;
  return (
    <dl data-reveal-group className="mx-auto grid max-w-md grid-cols-4 gap-3 sm:gap-4">
      {UNITS.map(([key, label]) => (
        <div key={key} data-reveal-item className="panel-dark py-4 text-center">
          <dd className="font-display text-3xl tabular-nums text-prada-light sm:text-4xl">{left ? String(left[key]).padStart(2, "0") : "—"}</dd>
          <dt className="mt-1 font-display text-[0.58rem] uppercase tracking-[0.24em] text-gading/60">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Kartu acara beratap joglo — seperti pendopo kecil. Berbalik menghadap pengunjung saat mendekat. */
function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const stub = dateStub(event.start, content.timeZone);

  return (
    <div className="[perspective:1200px]">
      <div data-turn={index % 2 ? -22 : 22} className="preserve-3d">
        <article data-reveal="up" className="flex h-full flex-col">
          <JogloRoof className="relative z-10 -mb-1 px-[2%]" />
          <div className="panel flex flex-1 flex-col px-7 pb-8 pt-7 sm:px-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="label">Adicara {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-serif text-3xl italic leading-tight sm:text-4xl">{event.name}</h3>
              </div>
              <div className="shrink-0 border-x border-prada/50 px-3 text-center" aria-hidden>
                <p className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-prada-deep">{stub.weekday}</p>
                <p className="font-display text-5xl leading-none text-sogan">{stub.day}</p>
                <p className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-prada-deep">{stub.month}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-1 border-t border-prada/40 pt-6">
              <dt className="sr-only">Tanggal</dt>
              <dd className="font-serif text-xl">{formatLongDate(event.start, content.timeZone)}</dd>
              <dt className="sr-only">Waktu</dt>
              <dd className="text-ink/70">
                {formatClock(event.start, content.timeZone)} – {formatClock(event.end, content.timeZone)} {timeZoneLabel}
              </dd>
              <dt className="sr-only">Tempat</dt>
              <dd className="pt-4 font-display text-lg leading-snug tracking-wide">{event.venue}</dd>
              <dd className="leading-relaxed text-ink/65">{event.address}</dd>
              {event.note && <dd className="pt-2 italic text-prada-deep">{event.note}</dd>}
            </dl>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> Lihat peta
              </a>
              <a href={googleCalendarLink(event, coupleLabel)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <CalendarPlus className="h-3.5 w-3.5" aria-hidden /> Google Calendar
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function Events() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="acara" data-twirl-track aria-labelledby="events-title" className="malam-sky relative overflow-hidden px-6 py-28 sm:py-40">
      <div className="parang-band absolute inset-x-0 top-0 h-3" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
        <div data-depth="120" className="preserve-3d absolute -left-8 top-[18%] opacity-60 sm:left-[4%]">
          <div data-twirl="200" className="preserve-3d">
            <Gunungan size="clamp(4rem,10vw,6rem)" />
          </div>
        </div>
        <div data-depth="-80" className="preserve-3d absolute -right-8 bottom-[10%] opacity-60 sm:right-[4%]">
          <div data-twirl="-200" className="preserve-3d">
            <Gunungan size="clamp(4.5rem,12vw,7rem)" />
          </div>
        </div>
      </div>

      <SectionHeading id="events-title" label="Adicara" title="Waktu & tempat" isDark />

      <div className="relative mt-14">
        <Countdown target={content.events[0].start} />
      </div>

      <div className={cn("relative mx-auto mt-16 grid max-w-5xl gap-10", content.events.length > 1 && "md:grid-cols-2")}>
        {content.events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      <div data-reveal="up" className="relative mt-12 text-center">
        <button type="button" onClick={() => downloadIcs(content.events, coupleLabel)} className="btn-prada">
          <CalendarPlus className="h-4 w-4" aria-hidden /> Simpan semua ke kalender
        </button>
      </div>
      <div className="parang-band absolute inset-x-0 bottom-0 h-3" aria-hidden />
    </section>
  );
}
