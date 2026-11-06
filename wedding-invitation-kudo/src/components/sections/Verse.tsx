"use client";

import { FadeIn } from "../ui/FadeIn";
import { Divider } from "../ui/Sprig";
import { useInvitation } from "../InvitationContext";

/** Ayat pembuka dalam bingkai lengkung ganda. */
export function Verse() {
  const { arabic, translation, source } = useInvitation().content.verse;
  if (!arabic && !translation) return null;

  return (
    <section aria-label="Ayat" className="bg-forest px-6 py-20 text-linen">
      <FadeIn className="mx-auto max-w-sm rounded-arch border border-linen/20 p-2">
        <div className="rounded-arch border border-linen/10 px-6 pb-10 pt-16 text-center">
          <p lang="ar" dir="rtl" className="font-arabic text-[1.65rem] leading-[2.2] text-blush">
            {arabic}
          </p>
          <Divider className="my-6 text-blush" />
          <p className="text-sm leading-relaxed text-linen/80">“{translation}”</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-sage">{source}</p>
        </div>
      </FadeIn>
    </section>
  );
}
