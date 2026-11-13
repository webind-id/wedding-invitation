"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { gununganOutline } from "@/lib/gunungan";
import { useInvitation } from "../InvitationContext";

const OUTLINE = gununganOutline();

/** Pambuka: ayat & kata pengantar di depan bayangan gunungan raksasa (seperti di kelir). */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { verse } = content;
  const hasVerse = Boolean(verse.translation || verse.arabic);

  return (
    <section ref={ref} aria-label="Ayat dan pengantar" className="gading-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <div className="parang-band absolute inset-x-0 top-0 h-3" aria-hidden />

      {/* Bayangan gunungan pada kelir — lapisan paling belakang */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div data-depth="-60" className="w-[min(80vw,30rem)]">
          <svg viewBox="0 0 200 300" className="w-full">
            <path d={OUTLINE} fill="#6E4426" fillOpacity="0.06" />
            <path d={OUTLINE} transform="translate(100 172) scale(0.84) translate(-100 -172)" fill="none" stroke="#B8914E" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="0 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <p data-reveal="up" className="label">
          Pambuka
        </p>
        {hasVerse && (
          <div data-depth="20" className="mt-10">
            {verse.arabic && (
              <p data-reveal="up" dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.2] text-ink/85 sm:text-3xl">
                {verse.arabic}
              </p>
            )}
            {verse.translation && (
              <blockquote data-reveal="up" className="mt-8 font-serif text-[clamp(1.35rem,3.6vw,1.85rem)] italic leading-snug text-ink [text-wrap:pretty]">
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
          <p data-reveal="up" className="mx-auto mt-14 max-w-xl text-[1.06rem] leading-relaxed text-ink/70 [text-wrap:pretty]">
            {content.invitationIntro}
          </p>
        )}
      </div>
    </section>
  );
}
