"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { InvitationContent } from "@/shared/contract";
import { AudioButton } from "./AudioButton";
import { DesktopPoster } from "./DesktopPoster";
import { EnvelopeCover } from "./EnvelopeCover";
import { InvitationProvider } from "./InvitationContext";
import { SectionDock } from "./SectionDock";
import { Agenda } from "./sections/Agenda";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { Gift } from "./sections/Gift";
import { Guestbook } from "./sections/Guestbook";
import { Hero } from "./sections/Hero";
import { Journey } from "./sections/Journey";
import { Moments } from "./sections/Moments";
import { SaveTheDate } from "./sections/SaveTheDate";
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
 * Selama sampul tampil, konten di belakangnya `inert` agar tidak bisa di-Tab.
 *
 * Dua keadaan: (1) sampul amplop dengan scroll terkunci, (2) undangan penuh
 * setelah segel dibuka — musik dimulai di klik yang sama (gesture pengguna).
 *
 * Desktop (lg+): poster tetap di kiri, kolom undangan 480px di kanan.
 * Halaman tetap memakai scroll window biasa di semua ukuran layar.
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
      // Autoplay ditolak browser — pengguna masih bisa menyalakan lewat tombol musik.
    });
  }

  return (
    <InvitationProvider content={content} slug={slug}>
      {isPreview && (
        <p className="fixed inset-x-0 top-0 z-[70] bg-clay py-1 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-linen">
          Pratinjau · belum terbit
        </p>
      )}

      <AnimatePresence>
        {!isOpen && (
          <motion.div key="cover" exit={{ opacity: 0, y: "-6%" }} transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}>
            <EnvelopeCover guestName={guestName} onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <div inert={!isOpen}>
        <DesktopPoster guestName={guestName} />

        <main className="relative bg-linen lg:ml-auto lg:w-[480px] lg:shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.45)]">
          <Hero isOpen={isOpen} />
          <Verse />
          <Couple />
          <SaveTheDate />
          <Agenda />
          <Journey />
          <Moments />
          <Gift />
          <Guestbook guestName={guestName === content.defaultGuest ? "" : guestName} />
          <Closing />
        </main>
      </div>

      {isOpen && <SectionDock />}
      {content.music && <AudioButton ref={audioRef} src={content.music} isVisible={isOpen} />}
    </InvitationProvider>
  );
}
