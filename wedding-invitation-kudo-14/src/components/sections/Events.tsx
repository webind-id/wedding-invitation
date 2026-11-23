"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { downloadIcs, mapsSearchLink } from "@/lib/calendar";
import { dateStub } from "@/lib/datetime";
import { eventTimeLabel } from "@/lib/labels";
import type { WeddingEvent } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { LeafHem, NightLeaves } from "../taman/Foliage";

const IMG = "/images/taman";

/**
 * Kartu acara berbentuk daun (.daun-lg): kolom tanggal besar di kiri berbatas garis emas,
 * rincian rata kiri di kanan, setangkai bunga terselip di pojok kanan atas.
 */
function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { content, coupleLabel, timeZoneLabel } = useInvitation();
  const stub = dateStub(event.start, content.timeZone);
  const sprig = index % 2 === 0 ? "bunga-2" : "bunga-1";

  return (
    <article data-reveal="up" className="daun-lg relative mt-9 bg-ivory px-5 pb-6 pt-7 text-left text-marun-800 shadow-[0_0_0_1px_rgba(206,172,89,0.55),0_18px_40px_rgba(0,0,0,0.35)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/${sprig}.webp`} alt="" aria-hidden width={475} height={760} loading="lazy" decoding="async" className="pointer-events-none absolute -right-4 -top-16 w-[70px] rotate-[24deg]" />

      <div className="grid grid-cols-[72px_1fr] gap-4">
        <p className="border-r border-gold-500/70 pr-3 text-center">
          <span className="block font-sans text-[10px] uppercase tracking-[2px] text-blush-ink">{stub.weekday}</span>
          <span className="block font-display text-[44px] font-medium leading-none">{stub.day}</span>
          <span className="block font-script text-[26px] leading-none text-blush-deep">{stub.month}</span>
        </p>
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-[3px]">{event.name}</h3>
          <p className="mt-1 font-sans text-xs text-marun-500">{eventTimeLabel(event, content, timeZoneLabel)}</p>
          <p className="mt-3 flex items-start gap-1.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
            {event.venue}
          </p>
          {event.address && <p className="mt-1 pl-[22px] font-sans text-[11.5px] leading-[1.6] text-marun-500">{event.address}</p>}
        </div>
      </div>

      {event.note && <p className="daun mt-4 bg-blush/25 px-3.5 py-2 font-serif text-[15px] italic text-marun-700">{event.note}</p>}

      <div className="mt-5 flex flex-wrap gap-2 pr-1">
        <a href={mapsSearchLink(event)} target="_blank" rel="noopener noreferrer" className="btn-line">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          Petunjuk Arah
        </a>
        <button type="button" onClick={() => downloadIcs([event], coupleLabel)} className="btn-line" aria-label={`Simpan ${event.name} ke kalender`}>
          <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
          Kalender
        </button>
      </div>
    </article>
  );
}

/**
 * Pajangan: sepasang rangkaian bunga di pojok bawah bagian, di DEPAN kartu acara (z-[5];
 * pointer-events-none agar tombol kartu tetap bisa diketuk). Parallax: lapisan luar naik-turun
 * (data-depth), lapisan dalam bergeser dari tepi ke tengah (data-drift).
 */
function FlowerPair() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[300px]">
      <div data-depth="40" className="absolute -left-4 bottom-2 h-[230px]">
        <div data-drift="-50" className="h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/bunga-1.webp`} alt="" width={414} height={760} loading="lazy" decoding="async" className="h-full w-auto" />
        </div>
      </div>
      <div data-depth="70" className="absolute -right-4 -bottom-2 h-[250px]">
        <div data-drift="50" className="h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/bunga-2.webp`} alt="" width={475} height={760} loading="lazy" decoding="async" className="h-full w-auto -scale-x-100" />
        </div>
      </div>
    </div>
  );
}

/** Babak "Adicara" (acara) di taman malam. */
export function Events() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    // pb lebih besar: ruang untuk rangkaian bunga di bawah kartu terakhir.
    <section ref={ref} id="acara" aria-labelledby="acara-title" className="sec sec-dark overflow-x-clip pb-[240px]">
      <LeafHem />
      <NightLeaves />
      <div className="relative z-[1]">
        <Babak
          id="acara-title"
          name="Adicara"
          title="Rangkaian Acara"
          lead={<span className="text-base">Dengan memohon rahmat-Nya, acara akan diselenggarakan pada:</span>}
        />
        {content.events.map((event, i) => (
          <EventCard key={event.id || i} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
