"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, mapsSearchLink } from "@/lib/calendar";
import { formatLongDate } from "@/lib/datetime";
import { eventTimeLabel } from "@/lib/labels";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Divider, Glyph, ParangEdges } from "../jawa/Ornaments";
import { SectionHeading } from "../ui/SectionHeading";

function EventCard({ event }: { event: WeddingEvent }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();

  return (
    <article
      data-reveal="up"
      className="relative mx-auto mt-[30px] max-w-[330px] rounded-t-[170px] rounded-b-3xl bg-ivory px-[26px] pb-8 pt-14 text-sogan-800 shadow-[0_0_0_6px_#2E1E12,0_0_0_7px_#CEAC59,0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-t-[160px] rounded-b-2xl border border-gold-500" />
      <Glyph id="gunungan" className="mx-auto mb-1.5 block h-[66px] w-11" />
      <h3 className="font-display text-xl font-semibold uppercase tracking-[4px] text-sogan-800">{event.name}</h3>
      <Divider className="my-2 w-[140px]" />
      <p className="font-display text-sm tracking-[1.5px]">{formatLongDate(event.start, content.timeZone)}</p>
      <p className="mt-0.5 font-sans text-xs text-sogan-500">{eventTimeLabel(event, content, timeZoneLabel)}</p>

      <MapPin className="mx-auto mb-1.5 mt-[18px] h-6 w-6 text-gold-600" aria-hidden />
      <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px]">{event.venue}</p>
      {event.address && <p className="mb-4 mt-1 font-sans text-[11.5px] leading-[1.6] text-sogan-500">{event.address}</p>}
      {event.note && (
        <p className="mx-auto mb-4 max-w-[260px] rounded-lg bg-blush/25 px-3 py-1.5 font-serif text-sm italic text-sogan-700">{event.note}</p>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-sogan">
          <MapPin className="h-[15px] w-[15px]" aria-hidden />
          Google Maps
        </a>
        <button type="button" onClick={() => downloadIcs([event], coupleLabel)} className="btn-sogan" aria-label={`Simpan ${event.name} ke kalender`}>
          <CalendarPlus className="h-[15px] w-[15px]" aria-hidden />
          Kalender
        </button>
      </div>
    </article>
  );
}

/**
 * Pajangan: sepasang merak berhadapan di pojok bawah bagian, di DEPAN kartu acara (z-[5]; pointer-events-none
 * agar tombol kartu tetap bisa diketuk).
 * Parallax mengikuti scroll — lapisan luar naik-turun (data-depth, beda kecepatan agar terasa
 * berlapis), lapisan dalam bergeser dari tepi ke tengah (data-drift). Tidak ada animasi berulang.
 */
function Peacocks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[300px]">
      <div data-depth="40" className="absolute bottom-6 left-[10px] h-[250px]">
        <div data-drift="-50" className="h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/jawa/merak-a-1.webp" alt="" width={308} height={760} loading="lazy" decoding="async" className="h-full w-auto" />
        </div>
      </div>
      <div data-depth="70" className="absolute bottom-2 right-[10px] h-[270px]">
        <div data-drift="50" className="h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/jawa/merak-a-2.webp" alt="" width={383} height={760} loading="lazy" decoding="async" className="h-full w-auto" />
        </div>
      </div>
    </div>
  );
}

export function Events() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    // pb lebih besar: ruang untuk merak di bawah kartu terakhir; overflow-hidden menahan parallax di dalam bagian.
    <section ref={ref} id="acara" aria-labelledby="acara-title" className="sec sec-dark overflow-hidden pb-[260px]">
      <ParangEdges />
      <Peacocks />
      <SectionHeading
        id="acara-title"
        title="Rangkaian Acara"
        variant="script"
        showDivider={false}
        lead={<span className="text-base">Dengan memohon rahmat-Nya, acara akan diselenggarakan pada:</span>}
      />
      {content.events.map((event, i) => (
        <EventCard key={event.id || i} event={event} />
      ))}
    </section>
  );
}
