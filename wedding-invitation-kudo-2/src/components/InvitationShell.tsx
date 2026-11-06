"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { InvitationContent } from "@/shared/contract";
import { InvitationProvider } from "./InvitationContext";
import { Cast } from "./sections/Cast";
import { Countdown } from "./sections/Countdown";
import { EndCredits } from "./sections/EndCredits";
import { Gift } from "./sections/Gift";
import { PosterHero } from "./sections/PosterHero";
import { Prologue } from "./sections/Prologue";
import { Reel } from "./sections/Reel";
import { Reviews } from "./sections/Reviews";
import { Scenes } from "./sections/Scenes";
import { Showtimes } from "./sections/Showtimes";
import { TicketCover } from "./TicketCover";
import { TopBar } from "./TopBar";

interface InvitationShellProps {
  content: InvitationContent;
  /** null = mode demo (buku tamu nonaktif). */
  slug: string | null;
  guestName: string;
  /** Draft yang dibuka lewat tautan pratinjau admin. */
  isPreview: boolean;
}

/**
 * Alur: tiket (scroll terkunci) → disobek → undangan penuh + musik.
 * Tata letak lebar penuh dan responsif — bukan kolom HP di tengah layar.
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
      // Autoplay ditolak browser — tombol musik di bar atas tetap tersedia.
    });
  }

  return (
    <InvitationProvider content={content} slug={slug}>
      {isPreview && (
        <p className="fixed inset-x-0 bottom-0 z-[70] bg-ember py-1.5 text-center text-[0.62rem] uppercase tracking-[0.3em] text-ivory">
          Pratinjau · belum terbit
        </p>
      )}

      <AnimatePresence>{!isOpen && <TicketCover key="ticket" guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {content.music && <audio ref={audioRef} src={content.music} loop preload="none" />}
      {isOpen && <TopBar audioRef={audioRef} hasMusic={Boolean(content.music)} />}

      <main id="top" inert={!isOpen} className="overflow-x-clip">
        <PosterHero isOpen={isOpen} />
        <Prologue />
        <Cast />
        <Countdown />
        <Showtimes />
        <Scenes />
        <Reel />
        <Gift />
        <Reviews guestName={guestName === content.defaultGuest ? "" : guestName} />
        <EndCredits />
      </main>
    </InvitationProvider>
  );
}
