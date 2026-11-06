"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";

/** Pola bento: foto pertama besar, sisanya mengisi grid 4 kolom. */
const MOSAIC_SPAN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

function label(m: Moment, i: number): string {
  return m.alt || `Cuplikan ${i + 1}`;
}

/** Roll film yang terus bergulir; isi digandakan agar animasi -50% menyambung mulus. */
function Filmstrip({ moments, onOpen }: { moments: Moment[]; onOpen: (i: number) => void }) {
  const loop = [...moments, ...moments];
  return (
    <div className="relative border-y border-gold/15 bg-graphite py-4">
      <div aria-hidden className="sprockets absolute inset-x-0 top-1 h-3 opacity-80" />
      <div aria-hidden className="sprockets absolute inset-x-0 bottom-1 h-3 opacity-80" />
      <div className="overflow-hidden">
        <ul className="flex w-max animate-reel gap-3 px-3 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {loop.map((m, i) => {
            const index = i % moments.length;
            const isDuplicate = i >= moments.length;
            return (
              <li key={`${m.src}-${i}`} aria-hidden={isDuplicate || undefined}>
                <button
                  type="button"
                  tabIndex={isDuplicate ? -1 : 0}
                  onClick={() => onOpen(index)}
                  aria-label={`Perbesar ${label(m, index)}`}
                  className="block w-40 sm:w-52"
                >
                  <Photo src={m.src} alt={label(m, index)} className="aspect-[3/2] grayscale-[60%] transition hover:grayscale-0" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Lightbox({ moments, index, onClose, onStep }: { moments: Moment[]; index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const m = moments[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      opener?.focus();
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${label(m, index)} — ${index + 1} dari ${moments.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm"
    >
      <motion.figure
        key={m.src}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onStep(1);
          if (info.offset.x > 60) onStep(-1);
        }}
        className="w-full max-w-3xl"
      >
        <div className="gold-frame">
          <Photo src={m.src} alt={label(m, index)} className="aspect-[4/3] max-h-[78vh] [&_img]:object-contain" />
        </div>
        <figcaption className="mt-5 flex justify-between text-[0.62rem] uppercase tracking-[0.3em] text-smoke">
          <span>{m.alt}</span>
          <span className="text-gold">
            {index + 1} / {moments.length}
          </span>
        </figcaption>
      </motion.figure>

      <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 border border-gold/40 p-2.5 text-gold hover:bg-gold hover:text-void">
        <X className="h-5 w-5" />
      </button>
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir === -1 ? "Foto sebelumnya" : "Foto berikutnya"}
          onClick={(e) => {
            e.stopPropagation();
            onStep(dir);
          }}
          className={cn("absolute top-1/2 -translate-y-1/2 border border-gold/40 p-2.5 text-gold hover:bg-gold hover:text-void", dir === -1 ? "left-3" : "right-3")}
        >
          {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </motion.div>
  );
}

/** Galeri: roll film bergulir + mosaik bento, keduanya membuka lightbox. */
export function Reel() {
  const { moments } = useInvitation().content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (d: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + d + moments.length) % moments.length)),
    [moments.length],
  );

  if (moments.length === 0) return null;

  return (
    <section id="cuplikan" aria-labelledby="cuplikan-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Title reel="04" label="Cuplikan" id="cuplikan-title">
          Bingkai <em className="text-gold">yang kami simpan</em>
        </Title>
      </div>

      <Reveal effect="fade" className="mt-14">
        <Filmstrip moments={moments} onOpen={setOpenIndex} />
      </Reveal>

      <ul className="mx-auto mt-14 grid max-w-6xl grid-flow-row-dense auto-rows-[9rem] grid-cols-2 gap-2 px-5 sm:auto-rows-[12rem] sm:grid-cols-4 sm:gap-3 sm:px-8">
        {moments.map((m, i) => (
          <Reveal as="li" key={`${m.src}-${i}`} delay={(i % 4) * 0.06} className={cn(MOSAIC_SPAN[i % MOSAIC_SPAN.length], "min-h-0")}>
            <button type="button" onClick={() => setOpenIndex(i)} aria-label={`Perbesar ${label(m, i)}`} className="group block h-full w-full overflow-hidden">
              <Photo src={m.src} alt={label(m, i)} className="h-full" imgClassName="transition duration-700 group-hover:scale-105" />
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {openIndex !== null && <Lightbox moments={moments} index={openIndex} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
