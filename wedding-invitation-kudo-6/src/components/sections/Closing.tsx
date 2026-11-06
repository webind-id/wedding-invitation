"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatDotDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { Ribbon } from "../three/Ribbon";
import { Photo } from "../ui/Photo";

/** Penutup: bunga dari kedua sisi berkumpul mengelilingi foto, lalu tanda tangan. */
export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const photo = content.posterPhoto || content.coverPhoto;

  return (
    <section ref={ref} aria-labelledby="closing-title" className="pearl-paper relative overflow-hidden px-6 pb-16 pt-28 sm:pt-40">
      <div className="relative mx-auto w-[min(70vw,20rem)]">
        <div data-depth="-24">
          <div data-reveal="zoom">
            <Photo src={photo} alt={`${pair[0].nickname} dan ${pair[1].nickname}`} parallax={6} className="aspect-[4/5] rounded-[999px] shadow-[0_40px_80px_-40px_rgba(57,49,47,0.55)] ring-1 ring-white/70" />
          </div>
        </div>

        {/* Bunga berkumpul dari luar layar menuju bingkai saat adegan mendekati tengah. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
          <div data-drift="-260" className="preserve-3d absolute -left-[38%] bottom-[-6%]">
            <div data-spin="80" className="preserve-3d">
              <Bloom palette="blush" size="clamp(8rem,22vw,12rem)" seed={14} leaves={3} />
            </div>
          </div>
          <div data-drift="260" className="preserve-3d absolute -right-[34%] top-[-4%]">
            <div data-spin="-80" className="preserve-3d">
              <Bloom palette="pearl" size="clamp(7rem,18vw,10rem)" seed={15} leaves={3} />
            </div>
          </div>
          <div data-drift="180" className="preserve-3d absolute -right-[20%] bottom-[8%]">
            <Bloom palette="champagne" size="clamp(4rem,10vw,6rem)" seed={16} tilt={40} />
          </div>
        </div>
      </div>

      <div data-depth="20" className="relative mx-auto mt-16 max-w-xl text-center">
        {content.closing.message && (
          <p data-reveal="up" className="text-[1.02rem] leading-relaxed text-ink/70 [text-wrap:pretty]">
            {content.closing.message}
          </p>
        )}
        <p data-reveal="up" className="label mt-10">
          {content.closing.signature || "Kami yang berbahagia"}
        </p>
        {/* Script hanya untuk nama (sesuai arahan tipografi). */}
        <h2 id="closing-title" data-reveal="up" className="mt-3 font-script text-[clamp(3.2rem,12vw,5.5rem)] leading-tight">
          {coupleLabel}
        </h2>
      </div>

      <div data-depth="-20" className="relative mt-10">
        <Ribbon variant="wave" className="h-16 sm:h-24" />
      </div>

      <footer className="relative mt-8 text-center">
        <p className="font-display text-3xl italic text-champagne-deep">{monogram}</p>
        <p className="label mt-2 text-ink/45">{formatDotDate(content.events[0].start, content.timeZone)}</p>
      </footer>
    </section>
  );
}
