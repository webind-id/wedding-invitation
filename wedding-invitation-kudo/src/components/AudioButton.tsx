"use client";

import { Music2, Play } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

interface AudioButtonProps {
  ref: RefObject<HTMLAudioElement | null>;
  src: string;
  isVisible: boolean;
}

/** Piringan kecil berputar saat musik jalan. Tersembunyi bila file musik gagal dimuat. */
export function AudioButton({ ref, src, isVisible }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  // Pause otomatis saat tab disembunyikan, lanjut saat kembali.
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    let resumeOnShow = false;
    function onVisibility() {
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        resumeOnShow = true;
        audio.pause();
      } else if (!document.hidden && resumeOnShow) {
        resumeOnShow = false;
        audio.play().catch(() => undefined);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [ref]);

  function toggle() {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setIsBroken(true));
    else audio.pause();
  }

  return (
    <>
      <audio
        ref={ref}
        src={src}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsBroken(true)}
      />
      {isVisible && !isBroken && (
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          aria-pressed={isPlaying}
          className={cn(
            "fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-linen shadow-lg ring-4 ring-linen/70 transition hover:bg-moss",
            isPlaying && "animate-spin-slow",
          )}
        >
          {isPlaying ? <Music2 className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
        </button>
      )}
    </>
  );
}
