"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSceneTracker } from "@/hooks/useSceneTracker";
import { photoPool } from "@/lib/photos";
import type { InvitationContent } from "@/shared/contract";
import { Chrome } from "./Chrome";
import { InvitationProvider } from "./InvitationContext";
import { CoupleScenes } from "./sections/CoupleScenes";
import { EventsScene } from "./sections/EventsScene";
import { FinaleScene } from "./sections/FinaleScene";
import { GalleryScene } from "./sections/GalleryScene";
import { GiftScene } from "./sections/GiftScene";
import { GuestbookScene } from "./sections/GuestbookScene";
import { OpeningScene } from "./sections/OpeningScene";
import { StoryScenes } from "./sections/StoryScenes";
import { TimeScene } from "./sections/TimeScene";
import { VerseScene } from "./sections/VerseScene";
import { Stage } from "./Stage";
import { TitleSequence } from "./TitleSequence";
import { EASE_SLOW } from "./ui/Reveal";

interface InvitationShellProps {
  content: InvitationContent;
  /** null = mode demo (buku tamu nonaktif). */
  slug: string | null;
  guestName: string;
  /** Draft yang dibuka lewat tautan pratinjau admin. */
  isPreview: boolean;
}

/**
 * Alur: urutan judul (scroll terkunci) → pita menutup → layar hitam memudar
 * ke undangan. Di belakang semua scene ada satu panggung foto tetap yang
 * berganti mengikuti scene di tengah layar.
 */
export function InvitationShell({ content, slug, guestName, isPreview }: InvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const openingPhoto = content.coverPhoto || photoPool(content)[0] || "";
  const scene = useSceneTracker(isRevealed, openingPhoto);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = isOpen ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  function handleStart() {
    window.scrollTo({ top: 0 });
    setIsOpen(true);
    audioRef.current?.play().catch(() => {
      // Autoplay ditolak browser — tombol musik tetap tersedia.
    });
  }

  return (
    <InvitationProvider content={content} slug={slug}>
      <Stage src={isRevealed ? scene.stage : openingPhoto} />

      {isPreview && (
        <p className="fixed inset-x-0 top-0 z-[70] bg-umber py-1.5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-cream">
          Pratinjau · belum terbit
        </p>
      )}

      <AnimatePresence onExitComplete={() => setIsRevealed(true)}>
        {!isOpen && <TitleSequence key="titles" guestName={guestName} onStart={handleStart} />}
      </AnimatePresence>

      {/* Layar hitam di antara urutan judul dan scene pertama, lalu memudar perlahan. */}
      {isOpen && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 2.2, ease: EASE_SLOW }}
          className="pointer-events-none fixed inset-0 z-40 bg-ink"
        />
      )}

      {content.music && <audio ref={audioRef} src={content.music} loop preload="none" />}
      {isRevealed && <Chrome chapter={scene.chapter} audioRef={audioRef} hasMusic={Boolean(content.music)} />}

      <main inert={!isOpen} className="relative overflow-x-clip">
        <OpeningScene guestName={guestName} isRevealed={isRevealed} />
        <VerseScene />
        <CoupleScenes />
        <TimeScene />
        <EventsScene />
        <StoryScenes />
        <GalleryScene />
        <GiftScene />
        <GuestbookScene guestName={guestName === content.defaultGuest ? "" : guestName} />
        <FinaleScene />
      </main>
    </InvitationProvider>
  );
}
