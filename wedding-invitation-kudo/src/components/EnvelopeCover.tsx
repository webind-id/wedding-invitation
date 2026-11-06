"use client";

import { motion } from "framer-motion";
import { useInvitation } from "./InvitationContext";
import { formatDotDate } from "@/lib/datetime";
import { Picture } from "./ui/Picture";
import { Sprig } from "./ui/Sprig";
import { EASE_SOFT } from "./ui/FadeIn";

interface EnvelopeCoverProps {
  guestName: string;
  onOpen: () => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_SOFT } },
};

/**
 * Sampul berbentuk kartu surat: jendela foto melengkung, nama tamu di
 * kolom "Kepada", dan segel lilin sebagai tombol pembuka.
 */
export function EnvelopeCover({ guestName, onOpen }: EnvelopeCoverProps) {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  const firstEvent = content.events[0];
  return (
    <div className="grain fixed inset-0 z-50 flex overflow-y-auto bg-forest px-4 pb-20 pt-8">
      <Sprig className="pointer-events-none absolute -left-6 bottom-0 h-64 w-48 animate-sway text-sage/30" />
      <Sprig className="pointer-events-none absolute -right-8 top-0 h-56 w-40 rotate-180 animate-sway text-sage/30" />

      <motion.article
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grain relative m-auto w-full max-w-[22rem] rounded-[2rem] bg-linen px-7 pb-16 pt-7 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      >
        <motion.p variants={item} className="eyebrow">
          Undangan Pernikahan
        </motion.p>

        <motion.div variants={item} className="mx-auto mt-5 w-44">
          <Picture
            src={content.coverPhoto}
            alt={`${first.nickname} & ${second.nickname}`}
            eager
            className="aspect-[3/4] rounded-arch ring-1 ring-forest/10 ring-offset-4 ring-offset-linen"
            imgClassName="animate-drift"
          />
        </motion.div>

        <motion.h1 variants={item} className="mt-6 font-display text-[2.6rem] font-light italic leading-none text-forest">
          {first.nickname}
          <span className="mx-2 not-italic text-clay">&amp;</span>
          {second.nickname}
        </motion.h1>
        <motion.p variants={item} className="mt-3 text-xs font-medium tracking-[0.3em] text-moss">
          {formatDotDate(firstEvent.start, content.timeZone)}
        </motion.p>

        <motion.div variants={item} className="mt-7 rounded-2xl border border-dashed border-forest/25 px-4 py-3">
          <p className="text-[0.7rem] text-bark/60">Kepada Yth.</p>
          <p className="mt-1 break-words font-display text-lg text-forest">{guestName}</p>
        </motion.div>

        {/* Segel lilin — menjorok keluar dari tepi bawah kartu */}
        <div className="absolute inset-x-0 -bottom-11 flex justify-center">
          <motion.button
            type="button"
            variants={item}
            onClick={onOpen}
            whileHover={{ scale: 1.06, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Buka undangan"
            className="group relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-clay text-linen shadow-[inset_0_-6px_12px_rgba(0,0,0,0.25),0_14px_24px_-10px_rgba(0,0,0,0.6)]"
          >
            <span className="absolute inset-1.5 rounded-full border border-dashed border-linen/40 group-hover:animate-spin-slow" />
            <span className="font-display text-xl italic leading-none">
              {first.nickname[0]}
              {second.nickname[0]}
            </span>
            <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em]">Buka</span>
          </motion.button>
        </div>
      </motion.article>
    </div>
  );
}
