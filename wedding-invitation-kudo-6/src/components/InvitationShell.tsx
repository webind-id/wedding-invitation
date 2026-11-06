"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";
import type { InvitationContent } from "@/shared/contract";
import { EnvelopeCover } from "./EnvelopeCover";
import { InvitationProvider } from "./InvitationContext";
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
 * Alur: amplop 3D (scroll terkunci) → dibuka → hero & seluruh perjalanan, musik dimulai.
 * Urutan adegan: Hero → Ayat → Mempelai → Kisah → Acara → Galeri → Hadiah → RSVP → Penutup.
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
        <p className="fixed inset-x-0 top-0 z-[70] bg-ink py-1.5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-ivory">Pratinjau · belum terbit</p>
      )}

      {!isOpen && <EnvelopeCover guestName={guestName} onOpen={handleOpen} />}

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
