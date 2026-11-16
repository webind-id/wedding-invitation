"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { Lantern3D } from "../lantern/Lantern3D";
import { LanternDivider } from "../lantern/LanternDivider";
import { LanternSky } from "../lantern/LanternSky";

export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { verse } = content;
  const hasVerse = Boolean(verse.arabic || verse.translation);
  if (!hasVerse && !content.invitationIntro) return null;

  return (
    <section
      ref={ref}
      id="verse"
      aria-label="Ayat dan pengantar"
      className="night-sky-deep relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <LanternSky count={6} seed={3} options={{ maxSize: 32 }} />

      <div className="relative mx-auto max-w-2xl text-center">
        {hasVerse && (
          <div data-reveal="up" className="glass-night px-6 pb-8 pt-14 sm:px-10 sm:pb-10">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <Lantern3D size={52} variant="amber" spin={20} />
            </div>

            {verse.arabic && (
              <p dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.2] text-moon sm:text-3xl">
                {verse.arabic}
              </p>
            )}

            {verse.translation && (
              <blockquote className="mt-6 font-serif text-base italic leading-relaxed text-moon-muted [text-wrap:pretty] sm:text-lg">
                “{verse.translation}”
              </blockquote>
            )}

            {verse.source && (
              <div className="mt-6 flex justify-center">
                <span className="badge-ember">{verse.source}</span>
              </div>
            )}
          </div>
        )}

        {content.invitationIntro && (
          <div data-reveal="up" className="mx-auto mt-12 max-w-xl text-sm leading-relaxed text-moon-muted [text-wrap:pretty] sm:text-base">
            <p>{content.invitationIntro}</p>
            <LanternDivider className="mt-4" />
          </div>
        )}
      </div>
    </section>
  );
}
