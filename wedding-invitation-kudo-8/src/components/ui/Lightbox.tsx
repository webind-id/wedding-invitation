"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { Moment } from "@/shared/contract";

interface LightboxProps {
  moments: Moment[];
  index: number | null;
  onIndex: (i: number | null) => void;
  /** Keterangan tambahan per foto (mis. nama gunung). */
  captionOf?: (i: number) => string;
}

const NAV_BUTTON = "grid h-11 w-11 place-items-center border border-seluloid/20 bg-film/80 text-seluloid transition hover:border-amber hover:text-amber";

/** Foto diperbesar di <dialog> native: Esc menutup, ← → berpindah, klik latar menutup. */
export function Lightbox({ moments, index, onIndex, captionOf }: LightboxProps) {
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
      className="m-auto max-h-[92svh] w-[min(94vw,60rem)] overflow-visible bg-transparent p-0 backdrop:bg-film/90 backdrop:backdrop-blur-sm"
    >
      {moment && index !== null && (
        <figure className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={moment.src} alt={moment.alt} className="mx-auto max-h-[80svh] w-auto object-contain shadow-2xl" />
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-seluloid/85">
            <span className="text-sm">{[moment.alt, captionOf?.(index)].filter(Boolean).join(" · ")}</span>
            <span className="label shrink-0 text-seluloid/60">
              {index + 1} / {moments.length}
            </span>
          </figcaption>
        </figure>
      )}
      <div className="pointer-events-none absolute inset-y-0 -left-2 -right-2 flex items-center justify-between sm:-left-16 sm:-right-16">
        <button type="button" onClick={() => step(-1)} aria-label="Foto sebelumnya" className={`pointer-events-auto ${NAV_BUTTON}`}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Foto berikutnya" className={`pointer-events-auto ${NAV_BUTTON}`}>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <form method="dialog" className="absolute -top-14 right-0">
        <button aria-label="Tutup" className={NAV_BUTTON}>
          <X className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </dialog>
  );
}
