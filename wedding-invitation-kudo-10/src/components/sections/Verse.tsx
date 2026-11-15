"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EarthyDivider } from "../rustic/EarthyDivider";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { WaxSeal } from "../rustic/WaxSeal";

export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { verse } = content;
  const hasVerse = Boolean(verse.arabic || verse.translation);

  return (
    <section
      ref={ref}
      id="verse"
      aria-label="Ayat dan pengantar"
      className="rustic-paper-warm relative overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Latar ──────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="30" className="absolute -left-6 top-8 opacity-65">
          <EucalyptusStem size={120} color="#6B7A5C" opacity={0.6} />
        </div>
        <div data-depth="-30" className="absolute -right-6 bottom-8 opacity-65">
          <DriedPalm size={140} color="#C86D51" opacity={0.5} mirror />
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {hasVerse && (
          <div data-reveal="up" className="rustic-card p-6 sm:p-10 border border-sand-deep/60 bg-white/90">
            {/* Wax Seal Aksen */}
            <div className="mb-6 flex justify-center">
              <WaxSeal size={46} variant="olive" showBranch />
            </div>

            {verse.arabic && (
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-earth-ink"
              >
                {verse.arabic}
              </p>
            )}

            {verse.translation && (
              <blockquote className="mt-6 font-serif italic text-sm sm:text-base leading-relaxed text-earth-ink/90 [text-wrap:pretty]">
                “{verse.translation}”
              </blockquote>
            )}

            {verse.source && (
              <div className="mt-6 flex items-center justify-center">
                <span className="badge-olive">
                  {verse.source}
                </span>
              </div>
            )}
          </div>
        )}

        {content.invitationIntro && (
          <div data-reveal="up" className="mt-12 text-sm sm:text-base text-earth-muted leading-relaxed max-w-xl mx-auto [text-wrap:pretty]">
            <p>{content.invitationIntro}</p>
            <EarthyDivider className="mt-6" />
          </div>
        )}
      </div>
    </section>
  );
}
