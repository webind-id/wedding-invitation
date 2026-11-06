"use client";

import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";

/** Ayat pembuka di antara dua pita letterbox, seperti teks prolog film. */
export function Prologue() {
  const { verse, invitationIntro } = useInvitation().content;
  if (!verse.arabic && !verse.translation && !invitationIntro) return null;

  return (
    <section aria-label="Prolog" className="relative bg-onyx">
      <div aria-hidden className="h-6 bg-void sm:h-10" />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
        {verse.arabic && (
          <Reveal effect="fade">
            <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.2] text-gold sm:text-3xl">
              {verse.arabic}
            </p>
          </Reveal>
        )}
        {verse.translation && (
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-2xl font-display text-lg italic leading-relaxed text-ivory/85 sm:text-xl">
              “{verse.translation}”
            </p>
            {verse.source && <p className="credit mt-6 text-ivory/50">{verse.source}</p>}
          </Reveal>
        )}
        {invitationIntro && (
          <Reveal delay={0.25} className="mx-auto mt-14 max-w-md">
            <div className="hairline mx-auto mb-8 w-24" aria-hidden />
            <p className="text-sm leading-relaxed text-smoke">{invitationIntro}</p>
          </Reveal>
        )}
      </div>
      <div aria-hidden className="h-6 bg-void sm:h-10" />
    </section>
  );
}
