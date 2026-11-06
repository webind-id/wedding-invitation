"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { figureLabel } from "@/lib/issue";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Figure } from "../ui/Figure";
import { Opener } from "../ui/Opener";
import { Photo } from "../ui/Photo";
import { EASE_EDITORIAL } from "../ui/Reveal";

const FIRST_FIGURE = 6;

/**
 * Tata letak asimetris berulang (12 kolom): lebar–sempit turun–sedang
 * bergeser, dengan whitespace lebar di antaranya — bukan grid seragam.
 */
const LAYOUT = [
  { span: "lg:col-span-7", frame: "aspect-[4/5]", offset: "" },
  { span: "lg:col-span-4 lg:col-start-9", frame: "aspect-[3/4]", offset: "lg:mt-48" },
  { span: "lg:col-span-5 lg:col-start-2", frame: "aspect-square", offset: "lg:-mt-24" },
  { span: "lg:col-span-5 lg:col-start-8", frame: "aspect-[4/5]", offset: "lg:mt-20" },
  { span: "lg:col-span-12", frame: "aspect-[21/9]", offset: "" },
  { span: "lg:col-span-4 lg:col-start-3", frame: "aspect-[3/4]", offset: "" },
  { span: "lg:col-span-5 lg:col-start-8", frame: "aspect-[4/3]", offset: "lg:mt-32" },
];

function Lightbox({ moments, index, onClose, onStep }: { moments: Moment[]; index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const m = moments[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
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
      aria-label={`${figureLabel(FIRST_FIGURE + index)} dari ${moments.length} foto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col bg-ivory/[0.97] px-5 py-6 backdrop-blur-sm sm:px-10"
    >
      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <p className="rubric text-ink">
          {figureLabel(FIRST_FIGURE + index)} <span className="text-stone">/ {moments.length}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup" className="p-2 hover:text-gold">
          <X className="h-5 w-5" />
        </button>
      </div>
      <figure className="flex min-h-0 flex-1 flex-col items-center justify-center py-6" onClick={(e) => e.stopPropagation()}>
        <motion.div key={m.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative h-full w-full max-w-5xl">
          <Photo src={m.src} alt={m.alt || figureLabel(FIRST_FIGURE + index)} className="h-full w-full bg-transparent [&_img]:object-contain" />
        </motion.div>
        {m.alt && <figcaption className="mt-4 font-serif italic text-stone">{m.alt}</figcaption>}
      </figure>
      <div className="flex justify-between" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onStep(-1)} className="rubric link-underline inline-flex items-center gap-2 text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Sebelumnya
        </button>
        <button type="button" onClick={() => onStep(1)} className="rubric link-underline inline-flex items-center gap-2 text-ink">
          Berikutnya <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}

/** Portofolio: foto berukuran besar dalam komposisi asimetris dengan nomor gambar. */
export function Portfolio() {
  const { moments } = useInvitation().content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (d: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + d + moments.length) % moments.length)),
    [moments.length],
  );

  if (moments.length === 0) return null;

  return (
    <section id="portofolio" data-rubric="portofolio" aria-labelledby="portofolio-title" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <Opener id="portofolio" titleId="portofolio-title" deck="Sebuah pilihan potret — ketuk untuk melihat lebih dekat.">
          Port<em>ofolio</em>
        </Opener>

        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:mt-24 sm:gap-y-20 lg:grid-cols-12">
          {moments.map((m, i) => {
            const slot = LAYOUT[i % LAYOUT.length];
            return (
              <li key={`${m.src}-${i}`} className={cn(slot.span, slot.offset)}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Perbesar ${m.alt || figureLabel(FIRST_FIGURE + i)}`}
                  className="group block w-full text-left"
                >
                  <Figure
                    src={m.src}
                    alt={m.alt}
                    number={FIRST_FIGURE + i}
                    caption={m.alt || undefined}
                    frameClassName={cn(slot.frame, "transition duration-700 ease-editorial group-hover:opacity-90")}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {openIndex !== null && <Lightbox moments={moments} index={openIndex} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
