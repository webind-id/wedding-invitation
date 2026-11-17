"use client";

import { Music2, VolumeX } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

/**
 * Tombol musik bulat di tepi kanan kolom undangan (460px). Hanya ikon yang berganti —
 * tidak berputar terus (tanpa animasi berulang).
 */
export function MusicButton({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    // Jeda saat tab disembunyikan, lanjutkan saat kembali (hanya bila tadi sedang diputar).
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
      className="fixed bottom-5 z-40 grid h-[46px] w-[46px] place-items-center rounded-full bg-red-800 text-gold-300 shadow-[0_0_0_2px_#C9A24B,0_8px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 active:scale-95"
      style={{ right: "max(20px, calc(50vw - 230px + 20px))" }}
    >
      {isPlaying ? <Music2 className="h-[22px] w-[22px]" aria-hidden /> : <VolumeX className="h-[22px] w-[22px]" aria-hidden />}
    </button>
  );
}
