"use client";

import { MailOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInvitation } from "./InvitationContext";
import { Lanterns } from "./klenteng/Ornaments";

interface KlentengCoverProps {
  guestName: string;
  /** Dipanggil setelah sampul selesai memudar. */
  onOpen: () => void;
}

/** Durasi pudar sampul — samakan dengan transisi .cover-item / opacity di bawah. */
const LEAVE_MS = 1200;

/**
 * Sampul: lencana 囍 (shuang xi, kebahagiaan ganda), 百年好合 (rukun seratus tahun), nama
 * pengantin, dan nama tamu. Bagian bawah sampul tembus pandang, sehingga klenteng di belakangnya
 * sudah terlihat.
 */
export function KlentengCover({ guestName, onOpen }: KlentengCoverProps) {
  const { content, pair } = useInvitation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
    // Lampion turun sekali setelah sampul tampil.
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
        className={`cover-shade relative flex h-full w-full max-w-column flex-col items-center overflow-hidden px-9 pb-10 pt-[9vh] text-center text-cream-100 ${isShown ? "lanterns-show" : ""}`}
      >
        <Lanterns count={2} side="left" delay={0.3} />
        <Lanterns count={2} side="right" delay={0.3} />

        <div className="cover-item flex flex-col items-center">
          <p
            lang="zh"
            aria-label="Shuang xi, kebahagiaan ganda"
            className="rise-in grid h-[74px] w-[74px] place-items-center rounded-full bg-[radial-gradient(circle,#C2302A,#6E0F0F)] font-han text-[40px] text-gold-300 shadow-[0_0_0_2px_#C9A24B,0_0_0_6px_rgba(201,162,75,0.25),0_10px_26px_rgba(0,0,0,0.5)]"
          >
            囍
          </p>
          <p lang="zh" aria-label="Bai nian hao he, rukun seratus tahun" className="rise-in mt-3.5 font-han text-xl tracking-[8px] text-gold-400" style={{ animationDelay: "0.05s" }}>
            百年好合
          </p>
          <p className="rise-in kicker mt-1 text-gold-300/85" style={{ animationDelay: "0.1s" }}>
            The Wedding of
          </p>
          <p
            id="cover-title"
            className="rise-in my-2 font-script text-[56px] leading-[1.1] text-gold-300 max-[360px]:text-5xl"
            style={{ animationDelay: "0.2s" }}
          >
            {pair[0].nickname}
            <span className="px-1.5 font-serif text-[38px] italic text-gold-500">&amp;</span>
            {pair[1].nickname}
          </p>

          <div
            className="rise-in mb-5 mt-3.5 min-w-[240px] max-w-full rounded-[14px] border border-gold-500/45 bg-red-950/40 px-[18px] py-3.5"
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
