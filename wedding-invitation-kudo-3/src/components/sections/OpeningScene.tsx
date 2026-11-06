"use client";

import { motion } from "framer-motion";
import { formatDotDate } from "@/lib/datetime";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { EASE_SLOW } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

/** Scene pertama: nama besar di sepertiga bawah, subtitle untuk tamu, isyarat gulir. */
export function OpeningScene({ guestName, isRevealed }: { guestName: string; isRevealed: boolean }) {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const photo = content.coverPhoto || photoAt(photos, 0);

  const enter = (delay: number) => ({
    initial: { opacity: 0, filter: "blur(12px)" },
    animate: isRevealed ? { opacity: 1, filter: "blur(0px)" } : undefined,
    transition: { duration: 2, ease: EASE_SLOW, delay },
  });

  return (
    <Scene chapter="pembuka" photo={photo} anchor label="Pembuka" className="flex flex-col justify-end">
      <div className="mx-auto w-full max-w-6xl px-6 pb-28 sm:px-10 sm:pb-32">
        <motion.p {...enter(0.6)} className="kicker">
          Pernikahan · {formatDotDate(content.events[0].start, content.timeZone).replace(/ · /g, ".")}
        </motion.p>
        <motion.h1 {...enter(1)} className="subtitle mt-5 font-serif text-[clamp(4.2rem,16vw,11rem)] leading-[0.84] tracking-tight">
          {first.nickname}
          <br />
          <span className="italic text-cream/85">&amp; {second.nickname}</span>
        </motion.h1>
        <motion.p {...enter(1.6)} className="subtitle mt-8 max-w-md font-serif text-xl italic text-cream/80">
          — untuk {guestName}, dengan segala hormat.
        </motion.p>
      </div>

      <motion.div {...enter(2.4)} aria-hidden className="absolute bottom-24 right-6 flex flex-col items-center gap-3 sm:right-10">
        <span className="text-[0.58rem] uppercase tracking-[0.35em] text-cream/50 [writing-mode:vertical-rl]">Gulir perlahan</span>
        <span className="block h-14 w-px bg-gradient-to-b from-cream/60 to-transparent" />
      </motion.div>
    </Scene>
  );
}
