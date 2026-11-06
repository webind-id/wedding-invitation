"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { CHAPTERS, chapterIndex, toRoman } from "@/lib/chapters";
import { cn } from "@/lib/cn";
import { EASE_SLOW } from "./ui/Reveal";

/** Garis progres gulir tipis di atas layar. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-40 h-px origin-left bg-cream/70" />;
}

/** Tombol musik dengan batang ekualizer yang bergerak saat lagu diputar. */
function MusicButton({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    let resume = false;
    const onVisibility = () => {
      if (document.hidden && !audio.paused) {
        resume = true;
        audio.pause();
      } else if (!document.hidden && resume) {
        resume = false;
        audio.play().catch(() => undefined);
      }
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    setIsPlaying(!audio.paused);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [audioRef]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      aria-pressed={isPlaying}
      className="flex h-11 w-11 items-center justify-center gap-[3px] rounded-full border border-cream/20 bg-ink/50 backdrop-blur-md transition duration-500 hover:border-cream/60"
    >
      {[0, 0.25, 0.5, 0.15].map((delay) => (
        <span
          key={delay}
          aria-hidden
          style={{ animationDelay: `${delay}s` }}
          className={cn("h-4 w-[2px] origin-bottom rounded-full bg-cream", isPlaying ? "animate-equalizer" : "scale-y-[0.3]")}
        />
      ))}
    </button>
  );
}

/** Daftar bab layar penuh. */
function ChapterMenu({ active, onClose }: { active: string | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.nav
      aria-label="Daftar bab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE_SLOW }}
      className="fixed inset-0 z-[60] flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-md sm:px-16"
    >
      <button type="button" onClick={onClose} aria-label="Tutup menu" className="absolute right-5 top-5 rounded-full border border-cream/20 p-3 hover:border-cream/60">
        <X className="h-4 w-4" />
      </button>
      <ol className="space-y-1 sm:space-y-2">
        {CHAPTERS.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE_SLOW, delay: 0.1 + i * 0.06 }}
          >
            <a
              href={`#${c.id}`}
              onClick={onClose}
              aria-current={active === c.id ? "true" : undefined}
              className={cn(
                "group flex items-baseline gap-5 font-serif text-[clamp(2rem,6vw,3.6rem)] leading-tight text-cream/40 transition duration-500 hover:text-cream",
                active === c.id && "text-cream",
              )}
            >
              <span className="w-12 font-sans text-xs tracking-[0.3em] text-bronze">{toRoman(i + 1)}</span>
              <span className="italic">{c.label}</span>
            </a>
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  );
}

interface ChromeProps {
  chapter: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  hasMusic: boolean;
}

/** Perangkat tampilan di atas panggung: progres, indikator bab, menu, musik. */
export function Chrome({ chapter, audioRef, hasMusic }: ChromeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const index = chapterIndex(chapter);

  return (
    <>
      <ScrollProgress />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.6 }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between p-4 sm:p-6"
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Buka daftar bab"
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-cream/20 bg-ink/50 py-2 pl-3 pr-4 backdrop-blur-md transition duration-500 hover:border-cream/60"
        >
          <Menu className="h-4 w-4" aria-hidden />
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-cream/80" aria-live="polite">
            {index >= 0 ? (
              <>
                <span className="text-bronze">Bab {toRoman(index + 1)}</span> · {CHAPTERS[index].label}
              </>
            ) : (
              "Daftar bab"
            )}
          </span>
        </button>
        {hasMusic && (
          <div className="pointer-events-auto">
            <MusicButton audioRef={audioRef} />
          </div>
        )}
      </motion.div>

      <AnimatePresence>{isMenuOpen && <ChapterMenu active={chapter} onClose={() => setIsMenuOpen(false)} />}</AnimatePresence>
    </>
  );
}
