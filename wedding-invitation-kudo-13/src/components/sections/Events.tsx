"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, mapsSearchLink } from "@/lib/calendar";
import { formatLongDate } from "@/lib/datetime";
import { eventTimeLabel } from "@/lib/labels";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Divider, FretEdges, Glyph } from "../klenteng/Ornaments";
import { SectionHeading } from "../ui/SectionHeading";

function EventCard({ event }: { event: WeddingEvent }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();

  return (
    <article
      data-reveal="up"
      className="relative mx-auto mt-[30px] max-w-[330px] rounded-[26px] bg-ivory px-[26px] pb-8 pt-11 text-red-900 shadow-[0_0_0_6px_#4A0909,0_0_0_7px_#C9A24B,0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[18px] border border-gold-500" />
      <Glyph id="lantern" className="mx-auto mb-1.5 block h-12 w-[30px]" />
      <h3 className="font-display text-[19px] font-semibold uppercase tracking-[3px] text-red-800">{event.name}</h3>
      <Divider className="my-2 w-[140px]" />
      <p className="font-display text-sm tracking-[1.5px]">{formatLongDate(event.start, content.timeZone)}</p>
      <p className="mt-0.5 font-sans text-xs text-ink-500">{eventTimeLabel(event, content, timeZoneLabel)}</p>

      <MapPin className="mx-auto mb-1.5 mt-[18px] h-6 w-6 text-red-700" aria-hidden />
      <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px]">{event.venue}</p>
      {event.address && <p className="mb-4 mt-1 font-sans text-[11.5px] leading-[1.6] text-ink-500">{event.address}</p>}
      {event.note && <p className="mx-auto mb-4 max-w-[260px] rounded-lg bg-cream-100 px-3 py-1.5 font-serif text-sm italic text-ink-700">{event.note}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-red">
          <MapPin className="h-[15px] w-[15px]" aria-hidden />
          Google Maps
        </a>
        <button type="button" onClick={() => downloadIcs([event], coupleLabel)} className="btn-red" aria-label={`Simpan ${event.name} ke kalender`}>
          <CalendarPlus className="h-[15px] w-[15px]" aria-hidden />
          Kalender
        </button>
      </div>
    </article>
  );
}

export function Events() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="acara" aria-labelledby="acara-title" className="sec sec-dark">
      <FretEdges />
      <SectionHeading
        id="acara-title"
        title="Rangkaian Acara"
        variant="script"
        showDivider={false}
        lead={<span className="text-base">Dengan penuh hormat, acara akan diselenggarakan pada:</span>}
      />
      {content.events.map((event, i) => (
        <EventCard key={event.id || i} event={event} />
      ))}
    </section>
  );
}
