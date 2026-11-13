"use client";

import { Music, Pause } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

/** Tombol musik kabut bercincin lavender — tanpa animasi berulang. Musik dijeda saat tab disembunyikan. */
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
      aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      aria-pressed={isPlaying}
      className={cn(
        "rise-in fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-mist/95 text-plum shadow-[0_0_0_1px_rgba(168,147,194,0.9),0_0_0_5px_rgba(244,241,246,0.9),0_0_0_6px_rgba(168,147,194,0.5),0_14px_30px_-12px_rgba(78,49,89,0.5)] transition duration-500 ease-silk hover:bg-lilac/60",
      )}
      style={{ animationDelay: "1200ms" }}
    >
      {isPlaying ? <Pause className="h-4 w-4" aria-hidden /> : <Music className="h-4 w-4" aria-hidden />}
    </button>
  );
}
