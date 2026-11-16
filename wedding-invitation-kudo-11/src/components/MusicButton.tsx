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
        "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 rounded-full border border-gold/25 bg-night-900/90 px-3.5 py-2 text-moon shadow-glow-sm backdrop-blur-md transition-all hover:border-ember/50 hover:shadow-glow active:scale-95",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-ember-300 to-vermilion-500 text-night-950 shadow-glow-sm transition-transform",
          isPlaying && "animate-spin-slow",
        )}
      >
        <Disc3 className="h-4 w-4" aria-hidden />
      </div>

      <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-moon">
        {isPlaying ? (
          <>
            <Volume2 className="h-3.5 w-3.5 text-ember-300" aria-hidden />
            <span className="hidden sm:inline text-ember-200">PUTAR</span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-moon-subtle" aria-hidden />
            <span className="hidden sm:inline text-moon-subtle">JEDA</span>
          </>
        )}
      </div>
    </button>
  );
}
