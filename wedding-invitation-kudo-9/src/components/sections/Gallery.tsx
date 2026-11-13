"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { tileFor } from "@/lib/gallery";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

/** Kedalaman bergiliran agar ubin-ubin terasa melayang di lapisan berbeda. */
const DEPTHS = [14, 34, 22, 42, 8];

export function Gallery() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useScrollScene(ref);
  const moments = content.moments;
  if (moments.length === 0) return null;

  return (
    <section ref={ref} id="galeri" aria-labelledby="gallery-title" className="mist-paper relative overflow-hidden px-5 py-28 sm:px-8 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
        <div data-depth="-60" className="preserve-3d absolute -left-14 top-[18%] sm:left-[2%]">
          <div data-spin="-60" className="preserve-3d">
            <Flower kind="dahlia" palette="lilac" size="clamp(6rem,14vw,9rem)" seed={40} />
          </div>
        </div>
        <div data-depth="120" className="preserve-3d absolute -right-12 bottom-[8%] sm:right-[3%]">
          <div data-spin="70" className="preserve-3d">
            <Flower kind="lotus" palette="apricot" size="clamp(6rem,15vw,10rem)" seed={41} pad />
          </div>
        </div>
      </div>

      <SectionHeading id="gallery-title" label="Galeri kenangan" title="Potongan-potongan kecil kita" />

      <ul data-reveal-group className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 [grid-auto-flow:dense] auto-rows-[40vw] sm:gap-5 md:grid-cols-4 md:auto-rows-[min(15vw,13.5rem)]">
        {moments.map((m, i) => {
          const tile = tileFor(moments, i);
          return (
            <li key={`${m.src}-${i}`} data-reveal-item className={tile.span}>
              <div data-depth={DEPTHS[i % DEPTHS.length]} className="h-full">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Perbesar foto ${i + 1}${m.alt ? `: ${m.alt}` : ""}`}
                  className="group block h-full w-full drop-shadow-[0_22px_26px_rgba(78,49,89,0.28)] transition duration-700 ease-silk hover:-translate-y-1"
                >
                  <Photo src={m.src} alt={m.alt} parallax={5} className={cn("h-full w-full", tile.frame)} />
                </button>
              </div>
            </li>
          );
        })}
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
          <img src={moment.src} alt={moment.alt} className="mx-auto max-h-[80svh] w-auto rounded-[1.75rem] object-contain shadow-2xl" />
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-mist/90">
            <span className="text-sm">{moment.alt}</span>
            <span className="label shrink-0 text-mist/65">
              {index + 1} / {moments.length}
            </span>
          </figcaption>
        </figure>
      )}
      <div className="pointer-events-none absolute inset-y-0 -left-2 -right-2 flex items-center justify-between sm:-left-16 sm:-right-16">
        <button type="button" onClick={() => step(-1)} aria-label="Foto sebelumnya" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-mist/90 text-ink transition hover:bg-mist">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Foto berikutnya" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-mist/90 text-ink transition hover:bg-mist">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <form method="dialog" className="absolute -top-14 right-0">
        <button aria-label="Tutup" className="grid h-11 w-11 place-items-center rounded-full bg-mist/90 text-ink transition hover:bg-mist">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </dialog>
  );
}
