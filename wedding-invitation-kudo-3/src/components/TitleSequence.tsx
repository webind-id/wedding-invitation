"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "./InvitationContext";
import { Photo } from "./ui/Photo";
import { EASE_SLOW } from "./ui/Reveal";

interface TitleSequenceProps {
  guestName: string;
  onStart: () => void;
}

const BAR = "11vh";

/**
 * Pembuka bergaya urutan judul film: layar hitam, foto sampul muncul dari
 * gelap, baris-baris teks hadir satu per satu. Saat "Mulai" ditekan, pita
 * letterbox menutup layar sebelum undangan terbuka.
 */
export function TitleSequence({ guestName, onStart }: TitleSequenceProps) {
  const { content, pair } = useInvitation();
  const reduce = useReducedMotion();
  const [first, second] = pair;
  const step = reduce ? 0 : 0.9;

  const line = (i: number): Variants => ({
    hidden: { opacity: 0, filter: "blur(10px)" },
    shown: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.6, ease: EASE_SLOW, delay: 0.6 + i * step } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  });
  const bar: Variants = {
    hidden: { height: "50vh" },
    shown: { height: BAR, transition: { duration: reduce ? 0 : 2.2, ease: EASE_SLOW } },
    exit: { height: "50.5vh", transition: { duration: 1.1, ease: EASE_SLOW } },
  };

  return (
    <motion.div initial="hidden" animate="shown" exit="exit" className="fixed inset-0 z-50 overflow-hidden bg-ink">
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          shown: { opacity: 0.5, transition: { duration: reduce ? 0 : 4, ease: "easeInOut" } },
          exit: { opacity: 0, transition: { duration: 1 } },
        }}
        className="absolute inset-0"
      >
        <Photo src={content.coverPhoto} alt="" eager className="h-full w-full" imgClassName="animate-ken-burns" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,42,32,0.25)_0%,rgba(10,9,8,0.9)_75%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p variants={line(0)} className="kicker">
          Kepada Yth.
        </motion.p>
        <motion.p variants={line(0)} className="mt-3 max-w-md font-serif text-2xl italic text-cream/90">
          {guestName}
        </motion.p>
        <motion.p variants={line(1)} className="mt-10 text-sm text-haze">
          dengan hormat mengundang Anda menyaksikan
        </motion.p>
        <motion.h1 variants={line(2)} className="subtitle mt-4 font-serif text-[clamp(3.4rem,13vw,7.5rem)] leading-[0.9]">
          {first.nickname}
          <span className="mx-3 italic text-bronze">&amp;</span>
          {second.nickname}
        </motion.h1>
        <motion.p variants={line(3)} className="kicker mt-6">
          {formatLongDate(content.events[0].start, content.timeZone)}
        </motion.p>

        <motion.button
          variants={line(4)}
          type="button"
          onClick={onStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group mt-12 flex flex-col items-center gap-3"
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cream/40 transition duration-700 group-hover:border-cream group-hover:bg-cream/10">
            <Play className="h-5 w-5 translate-x-0.5 fill-cream text-cream" aria-hidden />
          </span>
          <span className="kicker text-cream/80">Buka undangan</span>
        </motion.button>
      </div>

      {/* Pita letterbox atas & bawah */}
      <motion.div variants={bar} aria-hidden className="absolute inset-x-0 top-0 z-20 bg-ink" />
      <motion.div variants={bar} aria-hidden className="absolute inset-x-0 bottom-0 z-20 bg-ink" />
    </motion.div>
  );
}
