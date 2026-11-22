"use client";

import { FadeIn } from "../ui/FadeIn";
import { Sprig } from "../ui/Sprig";
import { useInvitation } from "../InvitationContext";
import { CREDIT } from "@/shared/credit";


export function Closing() {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  return (
    <footer className="grain relative overflow-hidden bg-forest px-6 pb-28 pt-20 text-center text-linen">
      <Sprig className="absolute -left-6 -top-4 h-48 w-32 rotate-12 text-sage/25" />
      <Sprig className="absolute -right-6 bottom-10 h-48 w-32 -rotate-[160deg] text-sage/25" />

      <FadeIn>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-linen/75">{content.closing.message}</p>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-blush">{content.closing.signature}</p>
        <p className="mt-3 font-display text-5xl font-light italic">
          {first.nickname} <span className="not-italic text-clay">&amp;</span> {second.nickname}
        </p>
      </FadeIn>

      <p className="mt-16 text-[0.65rem] uppercase tracking-[0.25em] text-linen/45">
        Dibuat oleh{" "}
        <a href={CREDIT.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 transition normal-case tracking-[0.12em] text-linen/75 decoration-linen/30 hover:text-linen hover:decoration-linen">
          {CREDIT.site}
        </a>
        <span aria-hidden="true"> · </span>
        <a href={CREDIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CREDIT.instagram}`} className="inline-block py-1 underline underline-offset-4 transition normal-case tracking-[0.12em] text-linen/75 decoration-linen/30 hover:text-linen hover:decoration-linen">
          {CREDIT.instagram}
        </a>
      </p>
    </footer>
  );
}
