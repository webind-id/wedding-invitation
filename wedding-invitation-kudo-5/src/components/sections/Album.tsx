"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { photoAt } from "@/lib/photos";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { AlbumPhoto, SectionTitle } from "../ui/Frames";
import { Reveal } from "../ui/Reveal";

/** Kemiringan foto yang bergantian agar terasa ditempel tangan — tetap, tidak beranimasi. */
const TILTS = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2];
const SHAPE_FRAME: Record<Moment["shape"], string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

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
      aria-label={`Foto ${index + 1} dari ${moments.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-wine/90 p-4 backdrop-blur-sm"
    >
      <motion.div key={m.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
        <AlbumPhoto src={m.src} alt={m.alt || `Foto ${index + 1}`} caption={m.alt || undefined} frameClassName="aspect-[4/3] [&_img]:object-contain" />
        <p className="mt-3 text-center font-fell-sc tracking-widest text-antique/80">
          {index + 1} / {moments.length}
        </p>
      </motion.div>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 rounded-full bg-antique/10 p-2.5 text-antique hover:bg-antique/20">
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
          className={cn("absolute top-1/2 -translate-y-1/2 rounded-full bg-antique/10 p-2.5 text-antique hover:bg-antique/20", dir === -1 ? "left-3" : "right-3")}
        >
          {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </motion.div>
  );
}

/**
 * Album kenangan: bab-bab kisah ditempel bersama fotonya (berpenjepit, sedikit
 * miring), lalu halaman galeri yang bisa diperbesar.
 */
export function Album() {
  const { content, photos } = useInvitation();
  const { story, moments } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (d: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + d + moments.length) % moments.length)),
    [moments.length],
  );

  if (story.length === 0 && moments.length === 0) return null;

  return (
    <section id="album" aria-labelledby="album-title" className="px-4 py-20 sm:py-28">
      <SectionTitle label="Album kenangan" id="album-title">
        Lembar Demi Lembar
      </SectionTitle>

      {story.length > 0 && (
        <ol className="mx-auto mt-16 max-w-4xl space-y-20">
          {story.map((chapter, i) => (
            <Reveal as="li" key={`${chapter.year}-${i}`} className="grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
              <AlbumPhoto
                src={photoAt(photos, 4 + i)}
                alt={chapter.title}
                caption={chapter.year}
                tilt={TILTS[i % TILTS.length]}
                frameClassName="aspect-[4/5]"
                className={cn("mx-auto w-[78%] sm:w-full", i % 2 === 1 && "sm:order-2")}
              />
              <div className={cn("text-center sm:text-left", i % 2 === 1 && "sm:text-right")}>
                <p className="smallcaps text-burgundy">Anno {chapter.year}</p>
                <h3 className="mt-2 font-fell text-3xl leading-tight text-bottle">{chapter.title}</h3>
                <p className="mt-4 font-serif text-lg leading-relaxed text-ink/85">{chapter.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      )}

      {moments.length > 0 && (
        <div className="mx-auto mt-24 max-w-5xl border-t border-burgundy/25 pt-16">
          <p className="smallcaps text-center">Dari halaman album</p>
          <ul className="mt-10 columns-2 gap-6 sm:columns-3 sm:gap-8 [&>li]:mb-8">
            {moments.map((m, i) => (
              <Reveal as="li" key={`${m.src}-${i}`} delay={(i % 3) * 0.08} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Perbesar ${m.alt || `foto ${i + 1}`}`}
                  className="block w-full transition duration-500 hover:-translate-y-1"
                >
                  <AlbumPhoto src={m.src} alt={m.alt} tilt={TILTS[(i + 2) % TILTS.length] * 0.7} frameClassName={SHAPE_FRAME[m.shape]} />
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null && <Lightbox moments={moments} index={openIndex} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
