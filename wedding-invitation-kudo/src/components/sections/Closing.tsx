"use client";

import { FadeIn } from "../ui/FadeIn";
import { Sprig } from "../ui/Sprig";
import { useInvitation } from "../InvitationContext";

/** Kredit pembuat — milik template, bukan konten undangan. */
const CREDIT = "KudoStack";

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

      <p className="mt-16 text-[0.65rem] uppercase tracking-[0.25em] text-linen/35">Dibuat oleh {CREDIT}</p>
    </footer>
  );
}
