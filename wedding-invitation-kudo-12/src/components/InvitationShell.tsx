"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";
import { GAMELAN_MUSIC, musicSource, type InvitationContent } from "@/shared/contract";
import { InvitationProvider } from "./InvitationContext";
import { Sprite } from "./jawa/Sprite";
import { MelatiCover } from "./MelatiCover";
import { MelatiShower } from "./MelatiShower";
import { MusicButton } from "./MusicButton";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { Events } from "./sections/Events";
import { Gallery } from "./sections/Gallery";
import { Gifts } from "./sections/Gifts";
import { Hero } from "./sections/Hero";
import { Prosesi } from "./sections/Prosesi";
import { Rsvp } from "./sections/Rsvp";
import { SaveTheDate } from "./sections/SaveTheDate";
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
 * Satu kolom undangan 460px di tengah halaman berpola kawung (seperti kertas undangan di atas
 * kain batik). Sampul menutupi adegan pendopo; saat dibuka, adegan diputar sekali dan melati jatuh.
 */
export function InvitationShell({ content, slug, guestName, isPreview }: InvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const isReduced = useReducedMotion();
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
      <Sprite />
      {isPreview && (
        <div className="fixed inset-x-0 top-0 z-[70] border-b border-gold-500/50 bg-sogan-950/95 px-4 py-1.5 text-center font-sans text-xs font-medium tracking-wider text-gold-300">
          MODE PRATINJAU DRAFT · BELUM TERBIT
        </div>
      )}

      {!isOpen && <MelatiCover guestName={guestName} onOpen={handleOpen} />}
      {isOpen && !isReduced && <MelatiShower />}

      {musicSource(content, GAMELAN_MUSIC) && <audio ref={audioRef} src={musicSource(content, GAMELAN_MUSIC)} loop preload="none" />}
      {isOpen && musicSource(content, GAMELAN_MUSIC) && <MusicButton audioRef={audioRef} />}

      <main ref={mainRef} inert={!isOpen} className="relative mx-auto min-h-[100svh] max-w-column overflow-x-clip bg-ivory shadow-column">
        <Hero isOpen={isOpen} />
        <Verse />
        <Couple />
        <SaveTheDate />
        <Events />
        <Prosesi />
        <Gallery />
        <Story />
        <Gifts />
        <Rsvp guestName={guestName === content.defaultGuest ? "" : guestName} />
        <Closing />
      </main>
    </InvitationProvider>
  );
}
