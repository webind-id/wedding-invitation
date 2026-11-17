"use client";

import { MailOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInvitation } from "./InvitationContext";
import { Glyph, Ronce } from "./jawa/Ornaments";

interface MelatiCoverProps {
  guestName: string;
  /** Dipanggil setelah sampul selesai memudar. */
  onOpen: () => void;
}

/** Durasi pudar sampul — samakan dengan transisi .cover-item / opacity di bawah. */
const LEAVE_MS = 1200;

/**
 * Sampul "Sugeng Rawuh": gunungan emas, aksara Jawa, nama pengantin, dan nama tamu.
 * Bagian bawah sampul tembus pandang, sehingga adegan pendopo di belakangnya sudah terlihat.
 */
export function MelatiCover({ guestName, onOpen }: MelatiCoverProps) {
  const { content, pair } = useInvitation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
    // Ronce turun sekali setelah sampul tampil.
    const id = requestAnimationFrame(() => setIsShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleOpen() {
    if (isLeaving) return;
    setIsLeaving(true);
    window.setTimeout(onOpen, isReduced ? 0 : LEAVE_MS);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
      className={`fixed inset-0 z-50 flex justify-center transition-opacity duration-[1200ms] ease-silk ${isLeaving ? "cover-leave" : ""}`}
    >
      <div
        className={`cover-shade relative flex h-full w-full max-w-column flex-col items-center overflow-hidden px-9 pb-10 pt-[9vh] text-center text-cream-100 ${isShown ? "ronce-show" : ""}`}
      >
        <Ronce strands={3} side="left" delay={0.3} />
        <Ronce strands={3} side="right" delay={0.3} />

        <div className="cover-item flex flex-col items-center">
        <div className="rise-in mb-2.5 w-16 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <Glyph id="gunungan" className="h-24 w-16" />
        </div>
        <p lang="jv" className="rise-in mb-0.5 font-jawa text-[22px] tracking-[2px] text-gold-400" aria-label="Sugeng Rawuh">
          ꦱꦸꦒꦼꦁꦫꦮꦸꦃ
        </p>
        <p className="rise-in kicker text-gold-300/85" style={{ animationDelay: "0.1s" }}>
          Sugeng Rawuh · The Wedding of
        </p>
        <p
          id="cover-title"
          className="rise-in my-2 font-script text-[58px] leading-[1.1] text-gold-300 max-[360px]:text-5xl"
          style={{ animationDelay: "0.2s" }}
        >
          {pair[0].nickname}
          <span className="px-1.5 font-serif text-[40px] italic text-blush">&amp;</span>
          {pair[1].nickname}
        </p>

        <div
          className="rise-in mb-5 mt-4 min-w-[240px] max-w-full rounded-[14px] border border-gold-500/45 bg-sogan-950/35 px-[18px] py-3.5"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="font-sans text-[11px] opacity-80">{content.coverGreeting || "Kepada Yth."}</p>
          <p className="mb-0.5 mt-1.5 break-words font-display text-lg font-medium text-gold-300">{guestName}</p>
          <p className="font-sans text-[11px] opacity-80">di Tempat</p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          disabled={isLeaving}
          className="rise-in btn-gold"
          style={{ animationDelay: "0.4s" }}
        >
          <MailOpen className="h-[15px] w-[15px]" aria-hidden />
          Buka Undangan
        </button>
        </div>
      </div>
    </div>
  );
}
