"use client";

import { MailOpen } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwayZone } from "@/hooks/useSwayZone";
import { useInvitation } from "./InvitationContext";
import { Butterfly } from "./taman/Butterfly";

interface TamanCoverProps {
  guestName: string;
  /** Dipanggil setelah sampul selesai memudar. */
  onOpen: () => void;
}

/** Durasi pudar sampul — samakan dengan transisi .cover-root di globals.css. */
const LEAVE_MS = 700;
const IMG = "/images/taman";

/** Ornamen sampul: muncul pelan dari bawah (`.cover-orn`), `d` = jeda dalam detik. */
function Orn({ src, width, height, className, d, mirror }: { src: string; width: number; height: number; className: string; d: number; mirror?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      decoding="async"
      draggable={false}
      className={`cover-orn pointer-events-none absolute select-none ${mirror ? "-scale-x-100" : ""} ${className}`}
      style={{ "--d": `${d}s` } as CSSProperties}
    />
  );
}

/**
 * Sampul "Sugeng Rawuh": gerbang lengkung berbingkai prada di atas kertas gading berpola kawung,
 * gunungan sebagai mahkota, gunung samar di latar, rangkaian bunga & dedaunan di kedua pojok
 * bawah, dan dua kupu-kupu yang terbang. Taman yang tumbuh, wayang, dan joglo baru dimainkan
 * setelah tombol "Buka Undangan" (Hero).
 */
export function TamanCover({ guestName, onOpen }: TamanCoverProps) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);
  const swayClass = useSwayZone(ref);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
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
      className={`cover-root fixed inset-0 z-50 flex justify-center ${isLeaving ? "cover-leave" : ""}`}
    >
      <div ref={ref} className={`kawung-bg relative h-full w-full max-w-column overflow-hidden bg-ivory shadow-column ${swayClass}`}>
        {/* Latar: gunung samar & bingkai gerbang */}
        <Orn src={`${IMG}/bg-gunung.webp`} width={900} height={1205} className="fade-top inset-x-0 bottom-0 w-full opacity-40" d={0} />
        <div aria-hidden className="cover-arch" />

        {/* Pojok bawah: dedaunan di belakang, bunga di depan */}
        <Orn src={`${IMG}/dedaunan.webp`} width={600} height={626} className="-bottom-[7%] -left-[22%] w-[62%]" d={0.2} />
        <Orn src={`${IMG}/dedaunan.webp`} width={600} height={626} className="-bottom-[7%] -right-[22%] w-[62%]" d={0.3} mirror />
        <Orn src={`${IMG}/bunga-1.webp`} width={414} height={760} className="-bottom-[3%] -left-[6%] w-[36%]" d={0.45} />
        <Orn src={`${IMG}/bunga-2.webp`} width={475} height={760} className="-bottom-[3%] -right-[6%] w-[38%]" d={0.55} mirror />

        <Butterfly seed={21} size={34} area={{ x0: 0.12, x1: 0.88, y0: 0.56, y1: 0.8 }} delay={1.2} flap={0.26} />
        <Butterfly seed={22} size={26} area={{ x0: 0.1, x1: 0.9, y0: 0.1, y1: 0.3 }} delay={2} flap={0.22} />

        <div className="cover-item relative flex h-full flex-col items-center px-10 pt-[max(44px,7vh)] text-center text-marun-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/gunungan.webp`}
            alt=""
            width={264}
            height={400}
            className="rise-in h-[clamp(84px,13vh,116px)] w-auto drop-shadow-[0_10px_18px_rgba(86,22,41,0.28)]"
          />
          <p lang="jv" className="rise-in mt-2 font-jawa text-[21px] tracking-[2px] text-gold-600" aria-label="Sugeng Rawuh" style={{ animationDelay: "0.15s" }}>
            ꦱꦸꦒꦼꦁꦫꦮꦸꦃ
          </p>
          <p className="rise-in kicker mt-0.5 whitespace-nowrap text-marun-500 max-[380px]:tracking-[2.5px]" style={{ animationDelay: "0.25s" }}>
            Sugeng Rawuh · The Wedding of
          </p>
          <p
            id="cover-title"
            className="rise-in my-1 font-script text-[50px] leading-[1.15] text-marun-800 [text-wrap:balance] max-[360px]:text-[42px]"
            style={{ animationDelay: "0.35s" }}
          >
            {pair[0].nickname}
            <span className="px-1.5 font-serif text-[34px] italic text-blush-deep">&amp;</span>
            {pair[1].nickname}
          </p>

          <div
            className="rise-in relative mb-4 mt-2 min-w-[230px] max-w-full rounded-[14px] border border-gold-500/60 bg-ivory/90 px-[18px] py-3 shadow-[0_8px_24px_rgba(86,22,41,0.12)]"
            style={{ animationDelay: "0.45s" }}
          >
            <p className="font-sans text-[11px] text-marun-500">{content.coverGreeting || "Kepada Yth."}</p>
            <p className="mb-0.5 mt-1 break-words font-display text-lg font-medium text-marun-800">{guestName}</p>
            <p className="font-sans text-[11px] text-marun-500">di Tempat</p>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={handleOpen}
            disabled={isLeaving}
            className="rise-in btn-marun relative z-[7]"
            style={{ animationDelay: "0.55s" }}
          >
            <MailOpen className="h-[15px] w-[15px]" aria-hidden />
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
}
