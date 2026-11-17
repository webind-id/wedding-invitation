"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { galleryLayout, slideIndex } from "@/lib/gallery";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { ParangEdges } from "../jawa/Ornaments";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

const SLIDE_GAP_PX = 12;

export function Gallery() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useScrollScene(ref);

  const moments = content.moments ?? [];
  const count = moments.length;
  const layout = galleryLayout(count);

  function handleScroll() {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    setActive(slideIndex(track.scrollLeft, first.offsetWidth + SLIDE_GAP_PX, count));
  }

  function goTo(index: number) {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  if (count === 0) return null;

  return (
    <section ref={ref} id="galeri" aria-labelledby="galeri-title" className="sec bg-cream-100">
      <ParangEdges />
      <SectionHeading
        id="galeri-title"
        title={content.galleryTitle || "Galeri Kenangan"}
        variant="display"
        showDivider={false}
        note={layout.showSwipeHint ? "Geser untuk melihat foto lainnya" : undefined}
      />

      {layout.isCarousel ? (
        <>
          <ul
            ref={trackRef}
            onScroll={handleScroll}
            data-reveal="up"
            aria-label="Galeri foto, geser ke samping"
            className="no-scrollbar -mx-10 mt-[26px] flex snap-x snap-mandatory gap-3 overflow-x-auto px-10 pb-3.5 pt-1.5 max-[360px]:-mx-8 max-[360px]:px-8"
          >
            {moments.map((m, i) => (
              <li key={`${m.src}-${i}`} className="aspect-[3/4] flex-[0_0_76%] snap-center">
                <Slide moment={m} index={i} onOpen={setOpenIndex} />
              </li>
            ))}
          </ul>
          {layout.showDots ? (
            <div className="mt-1.5 flex justify-center gap-1.5">
              {moments.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Foto ${i + 1}`}
                  aria-current={i === active}
                  className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-5 bg-gold-500" : "w-1.5 bg-cream-200")}
                />
              ))}
            </div>
          ) : (
            <p className="small-ui mt-1.5 tabular-nums">
              {active + 1} / {count}
            </p>
          )}
        </>
      ) : (
        <div data-reveal="zoom" className="mx-auto mt-[26px] aspect-[3/4] w-[82%]">
          <Slide moment={moments[0]} index={0} onOpen={setOpenIndex} />
        </div>
      )}

      {openIndex !== null && <Lightbox moments={moments} index={openIndex} onChange={setOpenIndex} />}
    </section>
  );
}

function Slide({ moment, index, onOpen }: { moment: Moment; index: number; onOpen: (i: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Perbesar foto ${index + 1}${moment.alt ? `: ${moment.alt}` : ""}`}
      className="block h-full w-full overflow-hidden rounded-[20px] border-[5px] border-ivory shadow-[0_10px_26px_rgba(58,38,24,0.25)] transition-transform duration-300 hover:-translate-y-1"
    >
      <Photo src={moment.src} alt={moment.alt} className="h-full w-full" />
    </button>
  );
}

function Lightbox({ moments, index, onChange }: { moments: Moment[]; index: number; onChange: (i: number | null) => void }) {
  const count = moments.length;
  const close = useCallback(() => onChange(null), [onChange]);
  const prev = useCallback(() => onChange((index - 1 + count) % count), [onChange, index, count]);
  const next = useCallback(() => onChange((index + 1) % count), [onChange, index, count]);
  const current = moments[index];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, prev, next]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Foto diperbesar" className="fixed inset-0 z-[60] flex items-center justify-center bg-sogan-950/90 p-4" onClick={close}>
      <div className="relative w-full max-w-column" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={close}
          aria-label="Tutup"
          className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-sogan-800/90 text-gold-300 shadow-[0_0_0_1px_#CEAC59]"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt || `Foto ${index + 1}`}
          className="mx-auto max-h-[78vh] w-auto rounded-2xl border-[5px] border-ivory object-contain"
        />
        {count > 1 && (
          <div className="mt-3 flex items-center justify-between font-sans text-xs text-cream-200">
            <button type="button" onClick={prev} className="btn-outline px-3.5 py-2" aria-label="Foto sebelumnya">
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="tabular-nums">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={next} className="btn-outline px-3.5 py-2" aria-label="Foto berikutnya">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
