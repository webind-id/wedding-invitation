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

  const moments = content.moments || [];
  if (moments.length === 0) return null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((curr) => (curr === null ? null : (curr - 1 + moments.length) % moments.length)),
    [moments.length],
  );
  const next = useCallback(
    () => setOpenIndex((curr) => (curr === null ? null : (curr + 1) % moments.length)),
    [moments.length],
  );

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

  return (
    <section
      ref={ref}
      id="gallery"
      aria-labelledby="gallery-title"
      className="rustic-paper-warm relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          badge="OUR SWEET MEMORIES"
          scriptTitle="Potret Kasih"
          title={content.galleryTitle || "Galeri Kebersamaan"}
          subtitle="Setiap foto mengabadikan getar cinta dan kebahagiaan yang tulus sepanjang perjalanan kami."
        />

        {/* Bento Grid Foto dengan Frame Bohemian Kertas */}
        {moments.length > 0 && (
          <ul
            data-reveal-group
            className={cn(
              "grid gap-4 [grid-auto-flow:dense] auto-rows-[42vw] md:auto-rows-[15rem]",
              moments.length < 3 ? "max-w-xl mx-auto grid-cols-1" : "grid-cols-2 md:grid-cols-4",
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
                    className="group relative block h-full w-full overflow-hidden rounded-2xl border border-sand-deep/60 bg-white p-2 shadow-rustic transition-all duration-300 hover:-translate-y-1 hover:shadow-rustic-lg"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                      <Photo
                        src={m.src}
                        alt={m.alt}
                        parallax={4}
                        className={cn("h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", tile.frame)}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Modal Lightbox Bergaya Kertas Elegan ────────────────────────── */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan foto perbesaran"
          className="fixed inset-0 z-50 flex items-center justify-center bg-earth-ink/80 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl border-2 border-sand-deep/80 bg-cream-50 p-3 sm:p-4 shadow-rustic-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Tutup perbesaran"
              className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-earth-ink shadow-md transition hover:bg-terracotta hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="relative max-h-[75vh] w-full overflow-hidden rounded-xl">
              <Photo
                src={moments[openIndex].src}
                alt={moments[openIndex].alt || `Foto ${openIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Navigasi Lightbox */}
            <div className="mt-3 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Foto sebelumnya"
                className="btn-rustic-ghost text-xs px-3 py-1.5"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <span className="font-serif text-xs text-earth-muted">
                {openIndex + 1} / {moments.length}
              </span>

              <button
                type="button"
                onClick={next}
                aria-label="Foto berikutnya"
                className="btn-rustic-ghost text-xs px-3 py-1.5"
              >
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
