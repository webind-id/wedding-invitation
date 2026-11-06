"use client";

import { motion } from "framer-motion";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { EASE_SOFT } from "../ui/FadeIn";
import { Picture } from "../ui/Picture";
import { Sprig } from "../ui/Sprig";

/** Layar pertama setelah amplop dibuka: foto lengkung lebar + nama bertumpuk. */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  const firstEvent = content.events[0];
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: isOpen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_SOFT, delay },
  });

  return (
    <section aria-label="Pembuka" className="grain relative overflow-hidden px-6 pb-20 pt-16 text-center">
      <Sprig className="absolute -left-4 top-24 h-40 w-28 -rotate-12 text-sage" />
      <Sprig className="absolute -right-4 top-52 h-36 w-24 rotate-[200deg] text-sage" />

      <motion.p {...reveal(0.3)} className="eyebrow">
        Kami akan menikah
      </motion.p>

      <motion.div {...reveal(0.45)} className="relative mx-auto mt-8 w-[78%]">
        <Picture
          src={content.coverPhoto}
          alt={`${first.nickname} dan ${second.nickname}`}
          className="aspect-[4/5] rounded-arch shadow-[0_30px_60px_-30px_rgba(31,58,46,0.7)]"
          imgClassName="animate-drift"
        />
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-clay px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-linen">
          {formatLongDate(firstEvent.start, content.timeZone)}
        </span>
      </motion.div>

      <motion.h1 {...reveal(0.6)} className="mt-14 font-display text-6xl font-light italic leading-[0.9] text-forest">
        {first.nickname}
        <span className="block py-1 text-3xl not-italic text-clay">&amp;</span>
        {second.nickname}
      </motion.h1>
    </section>
  );
}
