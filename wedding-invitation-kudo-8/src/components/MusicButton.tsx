"use client";

import { Music, Pause } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

/** Tombol musik kaca gelap bercincin amber — tanpa animasi berulang. Musik dijeda saat tab disembunyikan. */
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
      className="rise-in fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-film/70 text-amber backdrop-blur-md shadow-[0_0_0_1px_rgba(232,178,92,0.55)] transition duration-500 ease-film hover:bg-film"
      style={{ animationDelay: "1200ms" }}
    >
      {isPlaying ? <Pause className="h-4 w-4" aria-hidden /> : <Music className="h-4 w-4" aria-hidden />}
    </button>
  );
}
