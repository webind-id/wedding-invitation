"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { InvitationContent } from "@/shared/contract";
import { InvitationProvider } from "./InvitationContext";
import { MagazineCover } from "./MagazineCover";
import { RunningHeader } from "./RunningHeader";
import { Agenda } from "./sections/Agenda";
import { Colophon } from "./sections/Colophon";
import { Contents } from "./sections/Contents";
import { CoupleFeature } from "./sections/CoupleFeature";
import { FeatureStory } from "./sections/FeatureStory";
import { Letters } from "./sections/Letters";
import { Portfolio } from "./sections/Portfolio";
import { Registry } from "./sections/Registry";

interface InvitationShellProps {
  content: InvitationContent;
  /** null = mode demo (buku tamu nonaktif). */
  slug: string | null;
  guestName: string;
  /** Draft yang dibuka lewat tautan pratinjau admin. */
  isPreview: boolean;
}

/**
 * Alur: sampul majalah (scroll terkunci) → "Buka edisi" → sampul terangkat
 * memperlihatkan isi edisi, musik dimulai di klik yang sama.
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
      // Autoplay ditolak browser — tombol musik di header tetap tersedia.
    });
  }

  return (
    <InvitationProvider content={content} slug={slug}>
      {isPreview && (
        <p className="fixed inset-x-0 bottom-0 z-[70] bg-ink py-1.5 text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-ivory">
          Pratinjau · belum terbit
        </p>
      )}

      <AnimatePresence>{!isOpen && <MagazineCover key="cover" guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {content.music && <audio ref={audioRef} src={content.music} loop preload="none" />}
      {isOpen && <RunningHeader audioRef={audioRef} hasMusic={Boolean(content.music)} />}

      <main id="top" inert={!isOpen} className="overflow-x-clip pt-12">
        <Contents />
        <CoupleFeature />
        <Agenda />
        <FeatureStory />
        <Portfolio />
        <Registry />
        <Letters guestName={guestName === content.defaultGuest ? "" : guestName} />
        <Colophon />
      </main>
    </InvitationProvider>
  );
}
