"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "./InvitationContext";
import { Crest, EngravedCard, Fleuron } from "./ui/Ornaments";
import { EASE_GENTLE } from "./ui/Reveal";

interface VellumCoverProps {
  guestName: string;
  onOpen: () => void;
}

const LIFT_MS = 1100;

/**
 * Sampul: kartu undangan bercetak di atas meja beralas hijau botol, ditutup
 * selembar kertas vellum tembus pandang. "Buka undangan" mengangkat vellum,
 * lalu kartu terbuka ke isi undangan.
 */
export function VellumCover({ guestName, onOpen }: VellumCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const reduce = useReducedMotion();
  const [first, second] = pair;
  const [isLifting, setIsLifting] = useState(false);

  function handleOpen() {
    if (isLifting) return;
    setIsLifting(true);
    // Biarkan vellum terangkat dulu sebelum sampul ditutup.
    setTimeout(onOpen, reduce ? 0 : LIFT_MS);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE_GENTLE } }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex overflow-y-auto bg-bottle px-4 py-8"
    >
      {/* Alas meja: serat kain + vinyet */}
      <div aria-hidden className="paper pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,18,13,0.7)_100%)]" />

      <motion.div
        initial={{ y: reduce ? 0 : 24, opacity: 0, rotate: reduce ? 0 : -1.2 }}
        animate={{ y: 0, opacity: 1, rotate: -0.6 }}
        transition={{ duration: 1.3, ease: EASE_GENTLE, delay: 0.2 }}
        className="relative m-auto w-full max-w-md"
      >
        <EngravedCard innerClassName="text-center">
          <Crest monogram={monogram} />
          <p className="smallcaps mt-6">Undangan Pernikahan</p>
          <h1 className="mt-4 font-fell text-[2.6rem] leading-[1.05] text-burgundy sm:text-5xl">
            {first.nickname}
            <span className="block py-1 text-2xl italic text-umber">&amp;</span>
            {second.nickname}
          </h1>
          <Fleuron className="mt-6" />
          <p className="mt-5 font-serif text-lg italic text-umber">{formatLongDate(content.events[0].start, content.timeZone)}</p>
          <p className="smallcaps mt-1 text-sm">{content.events[0].venue}</p>
        </EngravedCard>

        {/* Lembar vellum — tembus pandang, sedikit buram, menutupi kartu */}
        <motion.div
          animate={isLifting ? { y: "-115%", rotate: -5, opacity: 0 } : { y: 0, rotate: 0.8, opacity: 1 }}
          transition={{ duration: reduce ? 0 : LIFT_MS / 1000, ease: EASE_GENTLE }}
          className="absolute inset-0 flex flex-col items-center justify-end bg-[#FBF7EF]/60 px-5 pb-8 text-center shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-[3px] ring-1 ring-white/50"
        >
          {/* Label alamat di atas vellum: lebih pekat agar teks kartu di baliknya tidak bertumpuk. */}
          <div className="w-full max-w-xs bg-[#FBF7EF]/90 px-5 py-6 shadow-[0_6px_18px_-10px_rgba(43,33,27,0.4)] ring-1 ring-burgundy/25">
            <p className="smallcaps text-burgundy">Kepada Yth.</p>
            <p className="mt-2 font-fell text-2xl italic leading-snug text-wine">{guestName}</p>
            <button type="button" onClick={handleOpen} disabled={isLifting} className="btn-burgundy mt-5">
              Buka undangan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
