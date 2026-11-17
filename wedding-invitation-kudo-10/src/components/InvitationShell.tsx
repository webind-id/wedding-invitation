"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";
import { musicSource, type InvitationContent } from "@/shared/contract";
import { FloatingNav } from "./FloatingNav";
import { InvitationProvider } from "./InvitationContext";
import { MusicButton } from "./MusicButton";
import { RusticCover } from "./RusticCover";
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
        <div className="fixed inset-x-0 top-0 z-[70] border-b border-terracotta-200 bg-terracotta-50 px-4 py-1.5 text-center font-sans text-xs font-semibold tracking-wider text-terracotta-800 shadow-sm">
          [ MODE PRATINJAU DRAFT · BELUM TERBIT ]
        </div>
      )}

      {!isOpen && <RusticCover guestName={guestName} onOpen={handleOpen} />}

      {musicSource(content) && <audio ref={audioRef} src={musicSource(content)} loop preload="none" />}
      {isOpen && musicSource(content) && <MusicButton audioRef={audioRef} />}
      {isOpen && <FloatingNav />}

      <main ref={mainRef} inert={!isOpen} className="overflow-x-clip pb-16 sm:pb-0">
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
