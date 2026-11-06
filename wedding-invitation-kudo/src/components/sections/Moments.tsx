"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";
import { Picture } from "../ui/Picture";

const SHAPE_CLASS: Record<Moment["shape"], string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const { moments } = useInvitation().content;
  const closeRef = useRef<HTMLButtonElement>(null);
  const moment = moments[index];

  useEffect(() => {
    // Kembalikan fokus ke thumbnail pemicu saat lightbox ditutup.
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    }
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      opener?.focus();
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} dari ${moments.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-forest/95 p-4 backdrop-blur"
    >
      <motion.div
        key={moment.src}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onStep(1);
          if (info.offset.x > 60) onStep(-1);
        }}
        className="w-full max-w-lg"
      >
        <Picture src={moment.src} alt={moment.alt} className={cn("w-full rounded-2xl", SHAPE_CLASS[moment.shape])} />
        <p className="mt-3 text-center text-xs tracking-[0.2em] text-linen/60">
          {index + 1} / {moments.length}
        </p>
      </motion.div>

      <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 rounded-full bg-linen/10 p-2.5 text-linen hover:bg-linen/20">
        <X className="h-5 w-5" />
      </button>
      {[
        { dir: -1 as const, label: "Foto sebelumnya", Icon: ChevronLeft, pos: "left-3" },
        { dir: 1 as const, label: "Foto berikutnya", Icon: ChevronRight, pos: "right-3" },
      ].map(({ dir, label, Icon, pos }) => (
        <button
          key={dir}
          type="button"
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onStep(dir);
          }}
          className={cn("absolute top-1/2 -translate-y-1/2 rounded-full bg-linen/10 p-2.5 text-linen hover:bg-linen/20", pos)}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </motion.div>
  );
}

/** Grid masonry dua kolom + lightbox (keyboard & geser). */
export function Moments() {
  const { moments } = useInvitation().content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (d: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + d + moments.length) % moments.length)),
    [moments.length],
  );

  if (moments.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="galeri-title" className="grain px-4 py-20">
      <Heading eyebrow="Galeri" id="galeri-title">
        Potongan cerita
      </Heading>

      <ul className="mt-10 columns-2 gap-3 [&>li]:mb-3">
        {moments.map((m, i) => (
          <FadeIn as="li" key={m.src} delay={(i % 4) * 0.06} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Perbesar ${m.alt || `foto ${i + 1}`}`}
              className="group block w-full overflow-hidden rounded-2xl"
            >
              <Picture
                src={m.src}
                alt={m.alt}
                className={cn("w-full", SHAPE_CLASS[m.shape])}
                imgClassName="transition duration-700 group-hover:scale-105"
              />
            </button>
          </FadeIn>
        ))}
      </ul>

      <AnimatePresence>
        {openIndex !== null && <Lightbox index={openIndex} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
