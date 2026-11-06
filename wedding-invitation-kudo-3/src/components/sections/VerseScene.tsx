"use client";

import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

/** Ayat & pengantar, diletakkan seperti subtitle di sepertiga bawah layar. */
export function VerseScene() {
  const { content, photos } = useInvitation();
  const { verse, invitationIntro } = content;
  if (!verse.arabic && !verse.translation && !invitationIntro) return null;

  return (
    <Scene chapter="pembuka" photo={content.posterPhoto || photoAt(photos, 1)} label="Ayat" className="flex items-end">
      <div className="mx-auto w-full max-w-3xl px-6 pb-32 text-center sm:pb-40">
        {verse.arabic && (
          <Reveal>
            <p lang="ar" dir="rtl" className="subtitle font-arabic text-[1.75rem] leading-[2.1] text-cream sm:text-4xl">
              {verse.arabic}
            </p>
          </Reveal>
        )}
        {verse.translation && (
          <Reveal delay={0.3}>
            <p className="subtitle mx-auto mt-8 max-w-2xl font-serif text-xl italic leading-relaxed text-cream/90 sm:text-2xl">
              {verse.translation}
            </p>
            {verse.source && <p className="kicker mt-6">{verse.source}</p>}
          </Reveal>
        )}
        {invitationIntro && (
          <Reveal delay={0.5} effect="fade">
            <p className="subtitle mx-auto mt-14 max-w-md text-sm leading-relaxed text-cream/70">{invitationIntro}</p>
          </Reveal>
        )}
      </div>
    </Scene>
  );
}
