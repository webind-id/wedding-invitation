"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

/** Kredit pembuat — milik template, bukan konten undangan. */
const CREDIT = "KudoStack";

/**
 * Penutup: makin jauh digulir, layar perlahan memudar ke hitam
 * (fade to black), menyisakan nama pasangan di tengah kegelapan.
 */
export function FinaleScene() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const darkness = useTransform(scrollYProgress, [0.35, 1], [0, reduce ? 0.6 : 0.92]);

  return (
    <Scene chapter="penutup" photo={content.coverPhoto || photoAt(photos, 0)} anchor label="Penutup" className="flex">
      <div ref={ref} className="absolute inset-0" aria-hidden />
      <motion.div aria-hidden style={{ opacity: darkness }} className="pointer-events-none fixed inset-0 z-0 bg-ink" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
        {content.closing.message && (
          <Reveal>
            <p className="subtitle font-serif text-2xl italic leading-relaxed text-cream/90 sm:text-3xl">{content.closing.message}</p>
          </Reveal>
        )}
        {content.closing.signature && (
          <Reveal delay={0.3} effect="fade">
            <p className="kicker mt-12">{content.closing.signature}</p>
          </Reveal>
        )}
        <Reveal delay={0.6}>
          <p className="subtitle mt-5 font-serif text-[clamp(3.4rem,11vw,7rem)] leading-[0.9]">
            {first.nickname} <span className="italic text-bronze">&amp;</span> {second.nickname}
          </p>
        </Reveal>
        <p className="absolute bottom-24 text-[0.58rem] uppercase tracking-[0.35em] text-cream/30">Dibuat oleh {CREDIT}</p>
      </div>
    </Scene>
  );
}
