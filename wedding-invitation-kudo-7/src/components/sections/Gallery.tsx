"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

const ASPECT: Record<Moment["shape"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

/** Kedalaman bergiliran agar foto-foto terasa melayang di lapisan berbeda (jarak antarfoto > selisihnya). */
const DEPTHS = [10, 30, 18, 38];

export function Gallery() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useScrollScene(ref);
  const moments = content.moments;
  if (moments.length === 0) return null;

  return (
    <section ref={ref} id="galeri" aria-labelledby="gallery-title" className="relative px-5 py-28 sm:px-8 sm:py-40">
      <SectionHeading id="gallery-title" label="Galeri" title="Potret kenangan" />

      <ul data-reveal-group className="mx-auto mt-16 max-w-6xl columns-2 gap-4 sm:gap-6 md:columns-3">
        {moments.map((m, i) => (
          <li key={`${m.src}-${i}`} data-reveal-item className="mb-8 break-inside-avoid">
            <div data-depth={DEPTHS[i % DEPTHS.length]}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Perbesar foto ${i + 1}${m.alt ? `: ${m.alt}` : ""}`}
                className="group block w-full overflow-hidden p-[3px] bg-prada/70 shadow-[0_24px_50px_-30px_rgba(62,38,21,0.6)] transition duration-700 ease-silk hover:-translate-y-1 hover:shadow-[0_34px_60px_-30px_rgba(62,38,21,0.7)]"
              >
                <Photo src={m.src} alt={m.alt} parallax={5} className={cn(ASPECT[m.shape], "transition duration-700 ease-silk group-hover:scale-[1.03]")} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Lightbox moments={moments} index={openIndex} onIndex={setOpenIndex} />
    </section>
  );
}

function Lightbox({ moments, index, onIndex }: { moments: Moment[]; index: number | null; onIndex: (i: number | null) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + moments.length) % moments.length);
    },
    [index, moments.length, onIndex],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onIndex(null);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("keydown", handleKey);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("keydown", handleKey);
    };
  }, [onIndex, step]);

  const moment = index === null ? null : moments[index];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Galeri foto"
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current.close();
      }}
      className="m-auto max-h-[92svh] w-[min(94vw,60rem)] overflow-visible bg-transparent p-0 backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {moment && index !== null && (
        <figure className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={moment.src} alt={moment.alt} className="mx-auto max-h-[80svh] w-auto object-contain shadow-2xl" />
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-gading/85">
            <span className="text-sm">{moment.alt}</span>
            <span className="label shrink-0 text-gading/60">
              {index + 1} / {moments.length}
            </span>
          </figcaption>
        </figure>
      )}
      <div className="pointer-events-none absolute inset-y-0 -left-2 -right-2 flex items-center justify-between sm:-left-16 sm:-right-16">
        <button type="button" onClick={() => step(-1)} aria-label="Foto sebelumnya" className="pointer-events-auto grid h-11 w-11 place-items-center bg-gading/90 text-ink transition hover:bg-gading">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Foto berikutnya" className="pointer-events-auto grid h-11 w-11 place-items-center bg-gading/90 text-ink transition hover:bg-gading">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <form method="dialog" className="absolute -top-14 right-0">
        <button aria-label="Tutup" className="grid h-11 w-11 place-items-center bg-gading/90 text-ink transition hover:bg-gading">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </dialog>
  );
}
