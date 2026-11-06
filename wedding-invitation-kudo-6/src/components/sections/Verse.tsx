"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { Ribbon } from "../three/Ribbon";

/** Ayat & kata pengantar. Pita satin terbentang mengikuti scroll, menjadi jalan masuk ke kisah. */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { verse } = content;
  const hasVerse = Boolean(verse.translation || verse.arabic);

  return (
    <section ref={ref} aria-label="Ayat dan pengantar" className="relative overflow-hidden px-6 py-28 sm:py-40">
      <div data-depth="-40" className="absolute inset-x-0 top-6 -z-0 sm:top-10">
        <Ribbon variant="loop" className="h-32 sm:h-48" />
      </div>

      <div className="pointer-events-none absolute inset-0 [perspective:1000px]">
        <div data-depth="90" className="preserve-3d absolute -right-10 bottom-10 sm:right-[8%]">
          <div data-spin="60" className="preserve-3d">
            <Bloom palette="champagne" size="clamp(5rem,12vw,8rem)" seed={5} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl pt-24 text-center sm:pt-32">
        {hasVerse && (
          <div data-depth="24">
            {verse.arabic && (
              <p data-reveal="up" dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.2] text-ink/85 sm:text-3xl">
                {verse.arabic}
              </p>
            )}
            {verse.translation && (
              <blockquote data-reveal="up" className="mt-8 font-display text-[clamp(1.35rem,3.6vw,1.9rem)] font-light italic leading-snug text-ink [text-wrap:pretty]">
                “{verse.translation}”
              </blockquote>
            )}
            {verse.source && (
              <p data-reveal="up" className="label mt-6">
                {verse.source}
              </p>
            )}
          </div>
        )}
        {content.invitationIntro && (
          <p data-reveal="up" className="mx-auto mt-14 max-w-xl text-[1.02rem] leading-relaxed text-ink/70 [text-wrap:pretty]">
            {content.invitationIntro}
          </p>
        )}
      </div>
    </section>
  );
}
