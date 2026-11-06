"use client";

import { motion } from "framer-motion";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { EASE_CINEMA, EASE_OUT } from "../ui/Reveal";

/**
 * Poster film: kolase tiga foto bertumpuk dengan bingkai emas, judul
 * Bodoni raksasa, dan "billing block" kecil di bawah seperti poster bioskop.
 */
export function PosterHero({ isOpen }: { isOpen: boolean }) {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const premiere = content.events[0];
  const main = content.coverPhoto || photoAt(photos, 0);
  const sideA = photoAt(photos.filter((p) => p !== main), 0);
  const sideB = photoAt(photos.filter((p) => p !== main && p !== sideA), 0);

  const show = (delay: number, from: { x?: number; y?: number } = { y: 40 }) => ({
    initial: { opacity: 0, ...from },
    animate: isOpen ? { opacity: 1, x: 0, y: 0 } : undefined,
    transition: { duration: 1.2, ease: EASE_OUT, delay },
  });

  const billing = [
    `${first.childOrder} ${first.father} & ${first.mother}`,
    `${second.childOrder} ${second.father} & ${second.mother}`,
  ];

  return (
    <section aria-label="Poster" className="film-grain relative min-h-[100svh] overflow-hidden pt-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:pt-16">
        {/* Kolase foto */}
        <div className="relative mx-auto aspect-[4/5] w-[86%] max-w-md lg:order-2 lg:w-full">
          <motion.div {...show(0.35)} className="gold-frame absolute inset-0">
            <motion.div
              initial={{ clipPath: "inset(50% 0 50% 0)" }}
              animate={isOpen ? { clipPath: "inset(0% 0 0% 0)" } : undefined}
              transition={{ duration: 1.6, ease: EASE_CINEMA, delay: 0.3 }}
              className="h-full"
            >
              <Photo src={main} alt={`${first.nickname} dan ${second.nickname}`} className="h-full" imgClassName="animate-slow-zoom" />
            </motion.div>
          </motion.div>
          <motion.div {...show(0.7, { x: -40 })} className="absolute -bottom-8 -left-[7%] w-[42%] sm:-left-[14%] border-4 border-void shadow-2xl">
            <Photo src={sideA} alt="" className="aspect-[3/4]" />
          </motion.div>
          <motion.div {...show(0.85, { x: 40 })} className="absolute -right-[5%] top-[8%] w-[34%] sm:-right-[10%] border-4 border-void shadow-2xl">
            <Photo src={sideB} alt="" className="aspect-square" />
          </motion.div>
        </div>

        {/* Judul poster */}
        <div className="relative z-10 text-center lg:order-1 lg:text-left">
          <motion.p {...show(0.5)} className="credit">
            {first.nickname} &amp; {second.nickname} mempersembahkan
          </motion.p>
          <motion.h1 {...show(0.65)} className="mt-6 font-display text-[clamp(4rem,14vw,8.5rem)] leading-[0.82] tracking-tight">
            {first.nickname}
            <span className="block py-2 text-[0.42em] font-normal italic text-gold">&amp;</span>
            {second.nickname}
          </motion.h1>
          <motion.div {...show(0.85)} className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
            <span className="hairline w-12" aria-hidden />
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-ivory/80">Segera tayang</p>
            <span className="font-display text-2xl text-gold">{formatDotDate(premiere.start, content.timeZone).replace(/ · /g, ".")}</span>
          </motion.div>
          <motion.p {...show(0.95)} className="mt-3 text-sm text-smoke">
            {formatLongDate(premiere.start, content.timeZone)} · {premiere.venue}
          </motion.p>

          {/* Billing block — teks rapat & kecil khas poster film */}
          <motion.div {...show(1.05)} className="mx-auto mt-12 max-w-md border-t border-gold/20 pt-4 lg:mx-0">
            <p className="text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-smoke/80 [text-align-last:center] lg:[text-align-last:left]">
              {billing.join(" · ")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
