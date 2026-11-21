"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";
import { GUZHENG_MUSIC, musicSource, type InvitationContent } from "@/shared/contract";
import { withKlentengDefaults } from "@/lib/klenteng-defaults";
import { InvitationProvider } from "./InvitationContext";
import { Sprite } from "./klenteng/Sprite";
import { KlentengCover } from "./KlentengCover";
import { MusicButton } from "./MusicButton";
import { PetalShower } from "./PetalShower";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { Events } from "./sections/Events";
import { Gallery } from "./sections/Gallery";
import { Gifts } from "./sections/Gifts";
import { Hero } from "./sections/Hero";
import { Rsvp } from "./sections/Rsvp";
import { SaveTheDate } from "./sections/SaveTheDate";
import { Story } from "./sections/Story";
import { Tradisi } from "./sections/Tradisi";
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
 * Satu kolom undangan 460px di tengah halaman berpola koin kuno. Sampul menutupi adegan klenteng;
 * saat dibuka, adegan diputar sekali dan kelopak mei jatuh sekali.
 */
export function InvitationShell({ content, slug, guestName, isPreview }: InvitationShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const isReduced = useReducedMotion();
  useScrollRefresh(mainRef);
  // Lagu bawaan template Tionghoa: guzheng (bisa diganti/dimatikan dari admin).
  const music = musicSource(content, GUZHENG_MUSIC);

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
    // Teks bawaan bernuansa Islami dari konten contoh (QS. Ar-Rum, "ridho Allah SWT") → teks klenteng.
    <InvitationProvider content={withKlentengDefaults(content)} slug={slug}>
      <Sprite />
      {isPreview && (
        <div className="fixed inset-x-0 top-0 z-[70] border-b border-gold-500/50 bg-red-950/95 px-4 py-1.5 text-center font-sans text-xs font-medium tracking-wider text-gold-300">
          MODE PRATINJAU DRAFT · BELUM TERBIT
        </div>
      )}

      {!isOpen && <KlentengCover guestName={guestName} onOpen={handleOpen} />}
      {isOpen && !isReduced && <PetalShower />}

      {music && <audio ref={audioRef} src={music} loop preload="none" />}
      {isOpen && music && <MusicButton audioRef={audioRef} />}

      <main ref={mainRef} inert={!isOpen} className="relative mx-auto min-h-[100svh] max-w-column overflow-x-clip bg-ivory shadow-column">
        <Hero isOpen={isOpen} />
        <Verse />
        <Couple />
        <SaveTheDate />
        <Events />
        <Tradisi />
        <Gallery />
        <Story />
        <Gifts />
        <Rsvp guestName={guestName === content.defaultGuest ? "" : guestName} />
        <Closing />
      </main>
    </InvitationProvider>
  );
}
