"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EarthyDivider } from "../rustic/EarthyDivider";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { PampasGrass } from "../rustic/PampasGrass";
import { WaxSeal } from "../rustic/WaxSeal";
import { Photo } from "../ui/Photo";
import { CREDIT } from "@/shared/credit";

export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const photo = content.posterPhoto || content.coverPhoto;
  const dateStr = formatLongDate(content.events[0]?.start ?? "", content.timeZone);

  return (
    <section
      ref={ref}
      id="closing"
      aria-labelledby="closing-title"
      className="rustic-paper relative overflow-hidden px-4 py-24 sm:py-36 text-center"
    >
      {/* ── Ornamen Latar Belakang ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="40" className="absolute -left-10 sm:-left-6 top-[15%] animate-sway-slow opacity-65">
          <DriedPalm size={180} color="#C86D51" opacity={0.5} />
        </div>
        <div data-depth="-40" className="absolute -right-10 sm:-right-6 top-[20%] animate-sway-reverse opacity-70">
          <PampasGrass size={160} color="#D4A373" opacity={0.6} mirror />
        </div>
        <div data-depth="30" className="absolute -left-8 sm:-left-4 bottom-[10%] opacity-65">
          <EucalyptusStem size={130} color="#6B7A5C" opacity={0.65} />
        </div>
        <div data-depth="-30" className="absolute -right-8 sm:-right-4 bottom-[8%] opacity-65">
          <DriedPalm size={160} color="#C86D51" opacity={0.5} mirror />
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl flex flex-col items-center">
        {/* Foto Pasangan Penutup dalam Lengkungan Bohemian */}
        <div data-reveal="zoom" className="boho-arch-frame relative mb-8 w-44 sm:w-56 aspect-[4/5] p-2 bg-cream-50">
          <div className="boho-arch-inner relative h-full w-full">
            <Photo
              src={photo}
              alt={coupleLabel}
              parallax={5}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-4 -right-4 z-20">
            <WaxSeal monogram={monogram} size={48} variant="terracotta" />
          </div>
        </div>

        {/* Pesan Penutup */}
        <div data-reveal="up" className="max-w-lg">
          <p className="font-script text-3xl sm:text-4xl text-terracotta mb-2">
            Terima Kasih
          </p>

          <h3 id="closing-title" className="font-serif text-2xl sm:text-3xl font-bold text-earth-ink">
            Sampai Jumpa di Hari Bahagia
          </h3>

          <p className="mt-4 text-sm sm:text-base text-earth-muted leading-relaxed [text-wrap:pretty]">
            {content.closing?.message ||
              "Merupakan sebuah kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restu Anda, kami ucapkan terima kasih."}
          </p>

          <EarthyDivider className="mt-6" />
        </div>

        {/* Tanda Tangan Pasangan */}
        <div data-reveal="up" className="mt-6 pt-4 w-full max-w-md">
          <p className="text-xs uppercase tracking-widest text-earth-muted font-sans font-semibold">
            KAMI YANG BERBAHAGIA,
          </p>

          <p className="font-script text-4xl sm:text-5xl text-terracotta my-3">
            {pair[0].nickname} &amp; {pair[1].nickname}
          </p>

          <p className="font-serif text-xs sm:text-sm text-earth-muted/80">
            {dateStr}
          </p>

          <div className="mt-8 flex justify-center">
            <span className="badge-sand">
              OUTDOOR &amp; GARDEN WEDDING
            </span>
          </div>
          <p className="mt-10 font-sans text-[0.7rem] tracking-[0.08em] text-earth-muted/80">
            Dibuat oleh{" "}
            <a href={CREDIT.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 transition text-terracotta/90 decoration-terracotta/30 hover:text-terracotta hover:decoration-terracotta">
              {CREDIT.site}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={CREDIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CREDIT.instagram}`} className="inline-block py-1 underline underline-offset-4 transition text-terracotta/90 decoration-terracotta/30 hover:text-terracotta hover:decoration-terracotta">
              {CREDIT.instagram}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
