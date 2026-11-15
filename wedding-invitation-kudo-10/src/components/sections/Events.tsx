"use client";

import { CalendarPlus, Clock, Compass, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, mapsSearchLink } from "@/lib/calendar";
import { dateStub, formatClock, formatLongDate } from "@/lib/datetime";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { SectionHeading } from "../ui/SectionHeading";

function RusticEventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const stub = dateStub(event.start, content.timeZone);

  return (
    <article
      data-reveal="up"
      className="rustic-card flex flex-col md:flex-row overflow-hidden bg-white/95 p-0 border border-sand-deep/60 shadow-rustic hover:shadow-rustic-lg transition-all"
    >
      {/* Kolom Tanggal Bergaya Kartu Kaligrafi Terracotta */}
      <div className="flex md:w-44 shrink-0 flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-dashed border-sand-deep/70 bg-gradient-to-br from-terracotta to-terracotta-700 p-5 md:p-8 text-white">
        <span className="font-sans text-xs tracking-widest uppercase text-terracotta-100 font-semibold">{stub.weekday}</span>
        <span className="font-serif text-4xl md:text-5xl font-bold my-1 text-white">{stub.day}</span>
        <span className="font-sans text-xs tracking-widest uppercase text-terracotta-100 font-semibold">{stub.month}</span>
      </div>

      {/* Rincian Acara */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between">
            <span className="badge-olive">
              ACARA 0{index + 1}
            </span>
            <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-terracotta-700">
              <Clock className="h-4 w-4" aria-hidden />
              <span>
                {formatClock(event.start, content.timeZone)} -{" "}
                {event.end ? formatClock(event.end, content.timeZone) : "Selesai"} {timeZoneLabel}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-serif text-2xl font-bold text-earth-ink">
            {event.name}
          </h3>

          <p className="mt-1 text-sm font-semibold text-earth-muted">
            {formatLongDate(event.start, content.timeZone)}
          </p>

          <div className="mt-5 border-t border-dashed border-sand-deep/60 pt-4">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 shrink-0 text-terracotta mt-0.5" aria-hidden />
              <div>
                <p className="text-base font-serif font-bold text-earth-ink">{event.venue}</p>
                {event.address && (
                  <p className="mt-1 text-xs sm:text-sm text-earth-muted leading-relaxed">
                    {event.address}
                  </p>
                )}
                {event.note && (
                  <p className="mt-2 text-xs italic text-olive-800 bg-olive-50 border border-olive-200/60 rounded-md px-2.5 py-1 inline-block">
                    * {event.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={mapsSearchLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rustic-terracotta text-xs"
          >
            <Compass className="h-4 w-4" aria-hidden />
            <span>BUKA GOOGLE MAPS</span>
          </a>

          <button
            type="button"
            onClick={() => downloadIcs([event], coupleLabel)}
            className="btn-rustic-olive text-xs"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            <span>SIMPAN KE KALENDER</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function Events() {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section
      ref={ref}
      id="events"
      aria-labelledby="events-title"
      className="rustic-paper relative overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Latar Belakang ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="40" className="absolute -left-6 top-[20%] opacity-65">
          <DriedPalm size={160} color="#C86D51" opacity={0.5} />
        </div>
        <div data-depth="-40" className="absolute -right-6 bottom-[15%] opacity-65">
          <EucalyptusStem size={150} color="#6B7A5C" opacity={0.6} mirror />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          badge="SAVE THE DATE"
          scriptTitle="Waktu &amp; Tempat"
          title="Rangkaian Acara Pernikahan"
          subtitle="Suasana outdoor &amp; garden wedding yang hangat dan asri. Disarankan bagi tamu undangan untuk mengenakan busana bertema earth-tone dan alas kaki yang nyaman."
        />

        <div className="space-y-8 mt-10">
          {content.events.map((event, i) => (
            <RusticEventCard key={event.id || i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
