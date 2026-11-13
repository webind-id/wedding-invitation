"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { WisteriaCurtain } from "../three/Wisteria";

/** Riak air kolam: elips tipis bertingkat. Diam. */
function Ripples({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-200 -40 400 80" className={className}>
      {[190, 140, 92, 50].map((rx, k) => (
        <ellipse key={rx} rx={rx} ry={rx * 0.16} fill="none" stroke="#A893C2" strokeWidth="1" opacity={0.18 + k * 0.08} />
      ))}
    </svg>
  );
}

/** Ayat & kata pengantar. Wisteria menjuntai dari atas, kolam teratai kecil di bawah. */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { verse } = content;
  const hasVerse = Boolean(verse.translation || verse.arabic);

  return (
    <section ref={ref} aria-label="Ayat dan pengantar" className="mist-paper relative overflow-hidden px-6 pb-40 pt-44 sm:pb-48 sm:pt-56">
      <WisteriaCurtain
        strands={[
          { left: 6, length: 15, width: "3.4rem", depth: 50, sway: 7, seed: 11 },
          { left: 20, length: 9, width: "2.6rem", depth: -30, sway: -5, seed: 12 },
          { left: 74, length: 11, width: "3rem", depth: -40, sway: 6, seed: 13 },
          { left: 88, length: 17, width: "3.8rem", depth: 60, sway: -8, seed: 14 },
        ]}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {hasVerse && (
          <div data-depth="24">
            {verse.arabic && (
              <p data-reveal="up" dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.2] text-ink/85 sm:text-3xl">
                {verse.arabic}
              </p>
            )}
            {verse.translation && (
              <blockquote data-reveal="up" className="mt-8 font-display text-[clamp(1.3rem,3.4vw,1.8rem)] italic leading-snug text-ink [text-wrap:pretty]">
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

      {/* Kolam kecil: riak air diam, teratai & daunnya mengapung di lapisan berbeda. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center [perspective:1000px]">
        <div className="relative h-28 w-[min(90vw,34rem)]">
          <div data-depth="-16" className="absolute inset-x-0 bottom-0">
            <Ripples className="w-full" />
          </div>
          <div data-depth="40" className="preserve-3d absolute bottom-2 left-[18%]">
            <div data-spin="60" className="preserve-3d">
              <Flower kind="lotus" palette="moon" size="clamp(5rem,14vw,7.5rem)" seed={5} pad tilt={52} />
            </div>
          </div>
          <div data-depth="70" className="preserve-3d absolute bottom-0 right-[16%]">
            <div data-spin="-50" className="preserve-3d">
              <Flower kind="lotus" palette="lilac" size="clamp(4rem,11vw,6rem)" seed={9} pad rings={4} tilt={54} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
