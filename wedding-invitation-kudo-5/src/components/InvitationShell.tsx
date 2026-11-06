"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { InvitationContent } from "@/shared/contract";
import { InvitationProvider } from "./InvitationContext";
import { Album } from "./sections/Album";
import { Calendar } from "./sections/Calendar";
import { Couple } from "./sections/Couple";
import { FormalCard } from "./sections/FormalCard";
import { Gifts } from "./sections/Gifts";
import { Programme } from "./sections/Programme";
import { ReplyCard } from "./sections/ReplyCard";
import { Valediction } from "./sections/Valediction";
import { VellumCover } from "./VellumCover";

interface InvitationShellProps {
  content: InvitationContent;
  /** null = mode demo (buku tamu nonaktif). */
  slug: string | null;
  guestName: string;
  /** Draft yang dibuka lewat tautan pratinjau admin. */
  isPreview: boolean;
}

/** Tombol musik: lingkaran burgundy bercincin ganda, tanpa animasi berulang. */
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

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
      onClick={() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => undefined);
        else audio.pause();
      }}
      aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      aria-pressed={isPlaying}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-burgundy text-antique shadow-[inset_0_0_0_3px_#6B1E2A,inset_0_0_0_4px_rgba(243,235,221,0.5),0_8px_20px_-8px_rgba(0,0,0,0.5)] transition hover:bg-wine"
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
    </motion.button>
  );
}

/**
 * Alur: kartu bercetak + vellum (scroll terkunci) → vellum terangkat →
 * isi undangan dalam rangkaian kartu & halaman album, musik dimulai.
 */
export function InvitationShell({ content, slug, guestName, isPreview }: InvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = isOpen ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  function handleOpen() {
    window.scrollTo({ top: 0 });
    setIsOpen(true);
    audioRef.current?.play().catch(() => {
      // Autoplay ditolak browser — tombol musik tetap tersedia.
    });
  }

  return (
    <InvitationProvider content={content} slug={slug}>
      {isPreview && (
        <p className="fixed inset-x-0 top-0 z-[70] bg-burgundy py-1.5 text-center font-fell-sc text-sm tracking-[0.2em] text-antique">
          Pratinjau · belum terbit
        </p>
      )}

      <AnimatePresence>{!isOpen && <VellumCover key="cover" guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {content.music && <audio ref={audioRef} src={content.music} loop preload="none" />}
      {isOpen && content.music && <MusicButton audioRef={audioRef} />}

      <main inert={!isOpen} className="paper overflow-x-clip">
        <FormalCard guestName={guestName} />
        <Couple />
        <Calendar />
        <Programme />
        <Album />
        <Gifts />
        <ReplyCard guestName={guestName === content.defaultGuest ? "" : guestName} />
        <Valediction />
      </main>
    </InvitationProvider>
  );
}
