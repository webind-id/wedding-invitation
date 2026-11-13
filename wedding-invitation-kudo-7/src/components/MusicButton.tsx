"use client";

import { Music, Pause } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

/** Tombol musik sogan bercincin prada — tanpa animasi berulang. Musik dijeda saat tab disembunyikan. */
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
      className="rise-in fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-sogan-deep text-prada-light shadow-[0_0_0_1px_rgba(220,192,138,0.8),0_0_0_4px_rgba(62,38,21,0.95),0_0_0_5px_rgba(184,145,78,0.5),0_14px_30px_-12px_rgba(0,0,0,0.55)] transition duration-500 ease-silk hover:bg-sogan"
      style={{ animationDelay: "1200ms" }}
    >
      {isPlaying ? <Pause className="h-4 w-4" aria-hidden /> : <Music className="h-4 w-4" aria-hidden />}
    </button>
  );
}
