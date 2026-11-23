"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { usesIslamicGreeting } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";

const IMG = "/images/taman";

/**
 * Babak "Pambuka" (pembukaan): salam, pengantar undangan, dan ayat di dalam gerbang lengkung
 * terang bergaris prada, dengan rangkaian bunga tumbuh di kedua kaki gerbang.
 */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { verse } = content;
  const hasVerse = Boolean(verse.arabic || verse.translation);
  if (!hasVerse && !content.invitationIntro) return null;

  return (
    <section ref={ref} id="salam" aria-labelledby="salam-title" className="sec kawung-bg">
      {usesIslamicGreeting(content) && (
        <p data-reveal="up" className="mb-3 text-left font-display text-[13px] tracking-[3px] text-marun-500">
          ASSALAMU&apos;ALAIKUM WR. WB.
        </p>
      )}
      <Babak id="salam-title" name="Pambuka" title="Nyuwun Pangestu" lead={content.invitationIntro || undefined} />

      {hasVerse && (
        <div data-reveal="up" className="relative mx-auto mt-12 max-w-[330px]">
          <figure className="gerbang is-light px-7 pb-24 pt-20 text-center">
            {verse.arabic && (
              <p dir="rtl" lang="ar" className="relative z-[2] mb-3 font-arabic text-[22px] leading-[2] text-marun-800">
                {verse.arabic}
              </p>
            )}
            {verse.translation && (
              <blockquote className="relative z-[2] text-base italic leading-[1.7] text-marun-700 [text-wrap:pretty]">
                &ldquo;{verse.translation}&rdquo;
              </blockquote>
            )}
            {verse.source && (
              <figcaption className="relative z-[2] mt-3 font-sans text-[11px] uppercase tracking-[2px] text-blush-ink">{verse.source}</figcaption>
            )}
          </figure>
          {/* Bunga di kedua kaki gerbang */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/bunga-1.webp`} alt="" aria-hidden width={414} height={760} loading="lazy" decoding="async" className="pointer-events-none absolute -bottom-8 -left-12 z-[3] w-[92px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/bunga-2.webp`} alt="" aria-hidden width={475} height={760} loading="lazy" decoding="async" className="pointer-events-none absolute -bottom-8 -right-12 z-[3] w-[100px] -scale-x-100" />
        </div>
      )}
    </section>
  );
}
