"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { usesIslamicGreeting } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Divider, TopCorners } from "../jawa/Ornaments";

/** Salam pembuka: "Nyuwun Pangestu", pengantar undangan, dan ayat dalam kotak kutipan. */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { verse } = content;
  const hasVerse = Boolean(verse.arabic || verse.translation);
  if (!hasVerse && !content.invitationIntro) return null;

  return (
    <section ref={ref} id="salam" aria-labelledby="salam-title" className="sec kawung-bg">
      <TopCorners />
      <div data-reveal="up">
        {usesIslamicGreeting(content) && (
          <p className="font-display text-sm tracking-[3px] text-sogan-500">ASSALAMU&apos;ALAIKUM WR. WB.</p>
        )}
        <h2 id="salam-title" className="script-title mt-2.5">
          Nyuwun Pangestu
        </h2>
        <Divider />
        {content.invitationIntro && <p className="lead">{content.invitationIntro}</p>}
      </div>

      {hasVerse && (
        <figure data-reveal="up" className="relative mt-[22px] rounded-[18px] border border-cream-200 bg-cream-100 px-5 py-[22px]">
          {verse.arabic && (
            <p dir="rtl" lang="ar" className="mb-3 font-arabic text-[22px] leading-[2] text-sogan-800">
              {verse.arabic}
            </p>
          )}
          {verse.translation && (
            <blockquote className="text-base italic leading-[1.7] [text-wrap:pretty]">&ldquo;{verse.translation}&rdquo;</blockquote>
          )}
          {verse.source && (
            <figcaption className="mt-2.5 font-sans text-[11px] uppercase tracking-[2px] text-blush-ink">{verse.source}</figcaption>
          )}
        </figure>
      )}
    </section>
  );
}
