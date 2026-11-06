"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "./InvitationContext";

export const NAV = [
  { id: "pemeran", label: "Pemeran" },
  { id: "jadwal", label: "Jadwal" },
  { id: "adegan", label: "Adegan" },
  { id: "cuplikan", label: "Cuplikan" },
  { id: "tanda-kasih", label: "Hadiah" },
  { id: "ulasan", label: "Ucapan" },
];
const IDS = NAV.map((n) => n.id);

function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.3] },
    );
    IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

interface TopBarProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  hasMusic: boolean;
}

/** Bar tipis bergaya letterbox: monogram, navigasi bagian, dan tombol musik. */
export function TopBar({ audioRef, hasMusic }: TopBarProps) {
  const { monogram } = useInvitation();
  const active = useActiveSection();
  const [isPlaying, setIsPlaying] = useState(false);

  // Sinkronkan ikon dengan status <audio>, dan jeda saat tab disembunyikan.
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

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  }

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed inset-x-0 top-0 z-40 border-b border-gold/15 bg-void/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-8">
        <a href="#top" className="font-display text-lg italic text-gold" aria-label="Kembali ke atas">
          {monogram}
        </a>
        <nav aria-label="Bagian undangan" className="no-scrollbar -mx-2 flex flex-1 overflow-x-auto px-2 sm:justify-center">
          <ul className="flex gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "true" : undefined}
                  className={cn(
                    "block whitespace-nowrap px-2.5 py-2 text-[0.62rem] uppercase tracking-[0.25em] text-ivory/50 transition hover:text-ivory",
                    active === n.id && "text-gold hover:text-gold",
                  )}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {hasMusic && (
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            aria-pressed={isPlaying}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/40 text-gold transition hover:bg-gold hover:text-void"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
          </button>
        )}
      </div>
    </motion.header>
  );
}
