"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { NightLeaves } from "../taman/Foliage";

/** Daun emas penanda tiap bab di sepanjang sulur. */
function LeafNode() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden focusable="false" className="relative z-[1] h-7 w-7 text-gold-400">
      <path d="M4 24 C 4 12, 12 4, 24 4 C 24 16, 16 24, 4 24Z" fill="currentColor" />
      <path d="M5 23 L 20 8" stroke="#3E1020" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Babak "Lampahan" (jalan cerita): kisah cinta di taman malam. Sulur emas berkelok di kiri
 * tergambar mengikuti scroll (`data-draw`); tiap bab ditandai daun emas, tahunnya huruf sambung.
 */
export function Story() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  if (content.story.length === 0) return null;

  return (
    <section ref={ref} id="kisah" aria-labelledby="kisah-title" className="sec sec-dark">
      <NightLeaves />
      <div className="relative z-[1]">
        <Babak id="kisah-title" name="Lampahan" title="Lampahing Tresna" lead={<span className="small-ui uppercase tracking-[2px]">Perjalanan cinta kami</span>} />

        <div className="relative mt-10">
          {/* Sulur: satu path berkelok sepanjang daftar, diregangkan setinggi daftar */}
          <svg viewBox="0 0 28 1000" preserveAspectRatio="none" aria-hidden focusable="false" className="absolute bottom-2 left-0 top-2 h-[calc(100%-16px)] w-7 overflow-visible text-gold-500">
            <path
              data-draw
              d="M14 0 C 26 60, 2 120, 14 180 S 26 300, 14 360 S 2 480, 14 540 S 26 660, 14 720 S 2 840, 14 900 S 20 970, 14 1000"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>

          <ol className="relative">
            {content.story.map((chapter, i) => (
              <li key={`${chapter.year}-${i}`} data-reveal="up" className="grid grid-cols-[28px_1fr] gap-4 pb-10 last:pb-0">
                <LeafNode />
                <div className="text-left">
                  <p className="font-script text-[34px] leading-none text-gold-300">{chapter.year}</p>
                  <h3 className="mt-1.5 font-display text-base font-semibold uppercase tracking-[2px] text-cream-100">{chapter.title}</h3>
                  <p className="mt-1.5 text-[15.5px] leading-[1.65] text-cream-200 [text-wrap:pretty]">{chapter.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
