"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

const SLIDE_MS = 6000;

/**
 * Galeri sebagai pemutaran slide: foto saling larut perlahan dengan Ken
 * Burns. Autoplay hanya saat terlihat di layar dan bila pengguna tidak
 * meminta gerak minimal; bisa dijeda, digeser, dan dibuka layar penuh.
 */
export function GalleryScene() {
  const { moments } = useInvitation().content;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const count = moments.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || reduce || count < 2) return;
    const t = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, isPlaying, isVisible, reduce, count, go]);

  // Jaga thumbnail aktif di tengah strip — gulir horizontal strip saja, bukan halaman.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [index, reduce]);

  function toggleFullscreen() {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else el.requestFullscreen?.().catch(() => undefined);
  }

  if (count === 0) return null;
  const current = moments[index];

  return (
    <Scene chapter="galeri" photo={null} anchor label="Galeri" fullscreen={false} className="bg-ink/80 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <ChapterHeading chapter="galeri">
          Ruang <em>gelap</em>
        </ChapterHeading>
      </div>

      <Reveal effect="fade" className="mx-auto mt-12 max-w-6xl px-0 sm:px-10">
        <div
          ref={frameRef}
          role="region"
          aria-roledescription="slideshow"
          aria-label="Galeri foto"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
          tabIndex={0}
          className="group relative aspect-[4/5] overflow-hidden bg-ink sm:aspect-video sm:rounded-3xl"
        >
          {moments.map((m, i) => (
            <div
              key={`${m.src}-${i}`}
              aria-hidden={i !== index}
              className={cn("absolute inset-0 transition-opacity duration-slow ease-in-out", i === index ? "opacity-100" : "opacity-0")}
            >
              <Photo src={m.src} alt={m.alt || `Foto ${i + 1}`} className="h-full w-full" imgClassName="object-cover animate-ken-burns" />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,9,8,0.75)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <p className="subtitle max-w-md font-serif text-lg italic text-cream/90" aria-live="polite">
              {current.alt || " "}
            </p>
            <p className="subtitle shrink-0 font-sans text-xs tracking-[0.3em] text-cream/70">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>

          <div className="absolute right-4 top-4 flex gap-2 opacity-100 transition duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {count > 1 && (
              <button type="button" onClick={() => setIsPlaying((p) => !p)} aria-label={isPlaying ? "Jeda slideshow" : "Putar slideshow"} className="rounded-full bg-ink/60 p-2.5 backdrop-blur hover:bg-ink/90">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
            <button type="button" onClick={toggleFullscreen} aria-label="Layar penuh" className="rounded-full bg-ink/60 p-2.5 backdrop-blur hover:bg-ink/90">
              <Expand className="h-4 w-4" />
            </button>
          </div>

          {count > 1 &&
            ([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(index + dir)}
                aria-label={dir === -1 ? "Foto sebelumnya" : "Foto berikutnya"}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-3 backdrop-blur transition duration-500 hover:bg-ink/90",
                  dir === -1 ? "left-3 sm:left-5" : "right-3 sm:right-5",
                )}
              >
                {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            ))}

          {/* Garis waktu slide */}
          {count > 1 && isPlaying && isVisible && !reduce && (
            <div key={index} aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-cream/15">
              <div className="h-full origin-left animate-[slide-progress_6s_linear_forwards] bg-cream/70" />
            </div>
          )}
        </div>
      </Reveal>

      {count > 1 && (
        <ul ref={thumbsRef} className="no-scrollbar mx-auto mt-4 flex max-w-6xl gap-2 overflow-x-auto px-6 sm:px-10" aria-label="Pilih foto">
          {moments.map((m, i) => (
            <li key={`${m.src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Tampilkan ${m.alt || `foto ${i + 1}`}`}
                aria-current={i === index ? "true" : undefined}
                className={cn("block w-20 overflow-hidden rounded-lg transition duration-500 sm:w-28", i === index ? "opacity-100 ring-1 ring-cream" : "opacity-40 hover:opacity-80")}
              >
                <Photo src={m.src} alt="" className="aspect-[4/3]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Scene>
  );
}
