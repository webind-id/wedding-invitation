"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";
import type { InvitationContent } from "@/shared/contract";
import { InvitationProvider } from "./InvitationContext";
import { JogloCover } from "./JogloCover";
import { MusicButton } from "./MusicButton";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { Events } from "./sections/Events";
import { Gallery } from "./sections/Gallery";
import { Gifts } from "./sections/Gifts";
import { Hero } from "./sections/Hero";
import { Rsvp } from "./sections/Rsvp";
import { Story } from "./sections/Story";
import { Verse } from "./sections/Verse";

interface InvitationShellProps {
  content: InvitationContent;
  /** null = mode demo (buku tamu nonaktif). */
  slug: string | null;
  guestName: string;
  /** Draft yang dibuka lewat tautan pratinjau admin. */
  isPreview: boolean;
}

/**
 * Alur: fasad joglo (scroll terkunci) → pintu gebyok terbuka → masuk pendopo, musik dimulai.
 * Urutan adegan: Hero → Pambuka → Mempelai → Lelakon → Adicara → Galeri → Tanda kasih → RSVP → Panutup.
 */
export function InvitationShell({ content, slug, guestName, isPreview }: InvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  useScrollRefresh(mainRef);

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
        <p className="fixed inset-x-0 top-0 z-[70] bg-sogan-deep py-1.5 text-center font-display text-[0.68rem] uppercase tracking-[0.28em] text-prada-light">Pratinjau · belum terbit</p>
      )}

      {!isOpen && <JogloCover guestName={guestName} onOpen={handleOpen} />}

      {content.music && <audio ref={audioRef} src={content.music} loop preload="none" />}
      {isOpen && content.music && <MusicButton audioRef={audioRef} />}

      <main ref={mainRef} inert={!isOpen} className="overflow-x-clip">
        <Hero isOpen={isOpen} />
        <Verse />
        <Couple />
        <Story />
        <Events />
        <Gallery />
        <Gifts />
        <Rsvp guestName={guestName === content.defaultGuest ? "" : guestName} />
        <Closing />
      </main>
    </InvitationProvider>
  );
}
