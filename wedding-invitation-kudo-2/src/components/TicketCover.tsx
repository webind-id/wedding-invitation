"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";
import { formatClock, formatDotDate } from "@/lib/datetime";
import { useInvitation } from "./InvitationContext";
import { Photo } from "./ui/Photo";
import { EASE_CINEMA, EASE_OUT } from "./ui/Reveal";

interface TicketCoverProps {
  guestName: string;
  onOpen: () => void;
}

// Saat dibuka: bagian tiket terangkat ke atas, potongan stub jatuh ke bawah.
const card: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
  exit: {},
};
const top: Variants = {
  hidden: { opacity: 0, y: 30 },
  shown: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT } },
  exit: { y: "-115vh", rotate: -4, transition: { duration: 1.1, ease: EASE_CINEMA } },
};
const stub: Variants = {
  hidden: { opacity: 0, y: 30 },
  shown: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT } },
  exit: { y: "60vh", rotate: 7, opacity: 0, transition: { duration: 0.9, ease: EASE_CINEMA } },
};

/**
 * Sampul: tiket pemutaran perdana di bawah sorot proyektor.
 * Tombol "Sobek tiket" membuka undangan (dan memulai musik).
 */
export function TicketCover({ guestName, onOpen }: TicketCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const [first, second] = pair;
  const premiere = content.events[0];

  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="shown"
      exit="exit"
      className="film-grain fixed inset-0 z-50 flex overflow-y-auto bg-void px-4 py-10"
    >
      {/* Sorot proyektor dari atas */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[90vh] w-[120vw] origin-top -translate-x-1/2 animate-beam-sweep bg-[conic-gradient(from_160deg_at_50%_0%,transparent_0deg,rgba(201,166,107,0.16)_20deg,transparent_40deg)]"
      />

      <div className="relative z-10 m-auto w-full max-w-[21rem]">
        <motion.div
          variants={top}
          className="ticket-cut overflow-hidden bg-onyx"
          style={{ "--tear": "100%" } as CSSProperties}
        >
          <div className="flex items-center justify-between border-b border-gold/20 px-5 py-3">
            <span className="credit text-[0.58rem]">Pemutaran Perdana</span>
            <span className="font-display text-sm italic text-gold">{monogram}</span>
          </div>

          <Photo
            src={content.coverPhoto}
            alt={`${first.nickname} & ${second.nickname}`}
            eager
            className="aspect-[4/5]"
            imgClassName="animate-slow-zoom"
          />

          <div className="relative -mt-24 bg-gradient-to-t from-onyx from-55% to-transparent px-5 pb-6 pt-20 text-center">
            <p className="credit text-[0.58rem] text-ivory/60">Sebuah kisah cinta</p>
            <h1 className="mt-3 font-display text-[2.6rem] leading-[0.95] text-ivory">
              {first.nickname}
              <span className="mx-2 font-normal italic text-gold">&amp;</span>
              {second.nickname}
            </h1>
            <div className="mt-5 grid grid-cols-2 border-y border-gold/20 py-3 text-left text-[0.62rem] uppercase tracking-[0.2em] text-smoke">
              <p>
                Tanggal
                <span className="mt-1 block font-display text-base normal-case tracking-normal text-ivory">
                  {formatDotDate(premiere.start, content.timeZone).replace(/ · /g, ".")}
                </span>
              </p>
              <p className="border-l border-gold/20 pl-4">
                Tayang
                <span className="mt-1 block font-display text-base normal-case tracking-normal text-ivory">
                  {formatClock(premiere.start, content.timeZone)}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Garis sobek */}
        <div aria-hidden className="relative h-0">
          <div className="absolute inset-x-4 border-t border-dashed border-gold/40" />
        </div>

        <motion.div variants={stub} className="ticket-cut bg-onyx px-5 py-5" style={{ "--tear": "0%" } as CSSProperties}>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-smoke">Tamu kehormatan</p>
              <p className="mt-1 break-words font-display text-xl text-ivory">{guestName}</p>
            </div>
            <p className="shrink-0 text-right text-[0.6rem] uppercase tracking-[0.25em] text-smoke">
              Kursi
              <span className="block font-display text-xl normal-case tracking-normal text-gold">VIP</span>
            </p>
          </div>
          <button type="button" onClick={onOpen} className="btn-gold mt-5 w-full">
            Sobek tiket &amp; masuk
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
