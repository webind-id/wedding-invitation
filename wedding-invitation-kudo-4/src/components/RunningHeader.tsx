"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { folio, RUBRICS } from "@/lib/issue";
import { useInvitation } from "./InvitationContext";
import { EASE_EDITORIAL } from "./ui/Reveal";

/** Rubrik yang sedang dibaca, dari elemen [data-rubric] yang melintasi sepertiga atas layar. */
function useCurrentRubric(): (typeof RUBRICS)[number] | null {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rubric]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setCurrent((hit.target as HTMLElement).dataset.rubric ?? null);
      },
      { rootMargin: "-30% 0px -69% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return RUBRICS.find((r) => r.id === current) ?? null;
}

function MusicToggle({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) {
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

  return (
    <button
      type="button"
      onClick={() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => undefined);
        else audio.pause();
      }}
      aria-pressed={isPlaying}
      className="rubric link-underline text-ink"
    >
      Musik: {isPlaying ? "aktif" : "jeda"}
    </button>
  );
}

/** Header berjalan khas majalah: masthead kecil, nama rubrik, nomor halaman, musik. */
export function RunningHeader({ audioRef, hasMusic }: { audioRef: RefObject<HTMLAudioElement | null>; hasMusic: boolean }) {
  const { pair } = useInvitation();
  const current = useCurrentRubric();

  return (
    <motion.header
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.6 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-ivory/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-5 sm:px-10">
        <a href="#top" className="font-serif text-lg font-light tracking-[-0.02em]">
          {pair[0].nickname} <span className="italic text-gold">&amp;</span> {pair[1].nickname}
        </a>
        <p className="rubric mx-auto hidden truncate md:block" aria-live="polite">
          {current?.label ?? ""}
        </p>
        <div className="ml-auto flex items-center gap-5 md:ml-0">
          {hasMusic && <MusicToggle audioRef={audioRef} />}
          <p className="font-serif text-sm italic text-stone">{current ? `hal. ${folio(current.page)}` : "sampul"}</p>
        </div>
      </div>
    </motion.header>
  );
}
