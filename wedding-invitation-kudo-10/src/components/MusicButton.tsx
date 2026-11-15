"use client";

import { Disc3, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

export function MusicButton({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    let shouldResume = false;
    const onVisibility = () => {
      if (document.hidden && !audio.paused) {
        shouldResume = true;
        audio.pause();
      } else if (!document.hidden && shouldResume) {
        shouldResume = false;
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
      aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
      aria-pressed={isPlaying}
      className={cn(
        "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 rounded-full border border-sand-deep/60 bg-cream-50/95 px-3.5 py-2 text-earth-ink shadow-rustic backdrop-blur-md transition-all hover:bg-white hover:shadow-rustic-lg active:scale-95",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full bg-terracotta text-white shadow-sm transition-transform",
          isPlaying && "animate-spin-slow",
        )}
      >
        <Disc3 className="h-4 w-4" aria-hidden />
      </div>

      <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-earth-ink">
        {isPlaying ? (
          <>
            <Volume2 className="h-3.5 w-3.5 text-terracotta" aria-hidden />
            <span className="hidden sm:inline text-terracotta-700">PUTAR</span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-earth-muted" aria-hidden />
            <span className="hidden sm:inline text-earth-muted">JEDA</span>
          </>
        )}
      </div>
    </button>
  );
}
