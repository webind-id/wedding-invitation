"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { tileFor } from "@/lib/gallery";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

export function Gallery() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useScrollScene(ref);

  const moments = content.moments ?? [];
  const count = moments.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => setOpenIndex((i) => (i === null ? null : (i - 1 + count) % count)), [count]);
  const next = useCallback(() => setOpenIndex((i) => (i === null ? null : (i + 1) % count)), [count]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, prev, next]);

  if (count === 0) return null;
  const current = openIndex === null ? null : moments[openIndex];

  return (
    <section ref={ref} id="gallery" aria-labelledby="gallery-title" className="night-sky-deep relative overflow-hidden px-4 py-20 sm:py-28">
      <div aria-hidden className="starfield pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          id="gallery-title"
          badge="Sweet Memories"
          scriptTitle="Potret Kasih"
          title={content.galleryTitle || "Galeri Kebersamaan"}
          subtitle="Kepingan cahaya dari perjalanan kami — diabadikan agar tak pernah padam."
        />

        <ul
          data-reveal-group
          className={cn(
            "grid auto-rows-[42vw] gap-3 [grid-auto-flow:dense] sm:gap-4 md:auto-rows-[15rem]",
            count < 3 ? "mx-auto max-w-xl grid-cols-1" : "grid-cols-2 md:grid-cols-4",
          )}
        >
          {moments.map((m, i) => {
            const tile = tileFor(moments, i);
            return (
              <li key={`${m.src}-${i}`} data-reveal-item className={tile.span}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Perbesar foto ${i + 1}${m.alt ? `: ${m.alt}` : ""}`}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl border border-gold/20 bg-night-800 p-1.5 transition-all duration-300 hover:-translate-y-1 hover:border-ember/50 hover:shadow-glow"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Photo
                      src={m.src}
                      alt={m.alt}
                      parallax={4}
                      className={cn("h-full w-full transition-transform duration-500 group-hover:scale-105", tile.frame)}
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ember-500/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {current && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan foto perbesaran"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night-950/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/30 bg-night-800 p-3 shadow-glow sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Tutup perbesaran"
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-night-900/90 text-moon transition hover:bg-ember hover:text-night-950"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt || `Foto ${openIndex + 1}`}
              className="mx-auto max-h-[75vh] w-auto rounded-xl object-contain"
            />

            <div className="mt-3 flex items-center justify-between px-1">
              <button type="button" onClick={prev} aria-label="Foto sebelumnya" className="btn-night px-3 py-1.5 text-xs sm:text-xs">
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>
              <span className="font-serif text-sm text-moon-muted">
                {openIndex + 1} / {count}
              </span>
              <button type="button" onClick={next} aria-label="Foto berikutnya" className="btn-night px-3 py-1.5 text-xs sm:text-xs">
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
