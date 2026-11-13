"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { Slate } from "../film/Frame";

/** Intertitle: layar hitam berisi ayat & pengantar, seperti kartu teks di antara adegan film. */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { verse } = content;
  const hasVerse = Boolean(verse.translation || verse.arabic);

  return (
    <section ref={ref} aria-label="Ayat dan pengantar" className="relative bg-film px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <div data-reveal="fade" className="flex justify-center">
          <Slate scene={3} />
        </div>
        <p data-reveal="fade" className="label mt-4">
          Doa sebelum melangkah
        </p>
        <span data-reveal="fade" aria-hidden className="mx-auto mt-8 block h-px w-16 bg-amber/50" />

        {hasVerse && (
          <div className="mt-10">
            {verse.arabic && (
              <p data-reveal="up" dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.2] text-seluloid/90 sm:text-3xl">
                {verse.arabic}
              </p>
            )}
            {verse.translation && (
              <blockquote data-reveal="up" className="mt-8 font-display text-[clamp(1.45rem,3.8vw,2.1rem)] font-light italic leading-snug text-seluloid [text-wrap:pretty]">
                “{verse.translation}”
              </blockquote>
            )}
            {verse.source && (
              <p data-reveal="up" className="label mt-7 text-seluloid/55">
                {verse.source}
              </p>
            )}
          </div>
        )}
        {content.invitationIntro && (
          <p data-reveal="up" className="mx-auto mt-14 max-w-xl text-[1.15rem] leading-relaxed text-seluloid/70 [text-wrap:pretty]">
            {content.invitationIntro}
          </p>
        )}
      </div>
    </section>
  );
}
