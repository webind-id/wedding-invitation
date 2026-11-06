"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { formatDotDate } from "@/lib/datetime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "./InvitationContext";
import { Bloom } from "./three/Bloom";
import { WaxSeal } from "./ui/WaxSeal";

interface EnvelopeCoverProps {
  guestName: string;
  /** Dipanggil setelah urutan pembukaan selesai. */
  onOpen: () => void;
}

/**
 * Amplop digital 3D. Lapisan (dari belakang): punggung → kartu undangan → kantong depan
 * → tutup (dengan lapisan dalam pink) → segel lilin. Saat dibuka: segel pecah, tutup
 * berputar terbuka, kartu terangkat keluar, amplop turun menjauh, kartu mendekat ke kamera.
 */
export function EnvelopeCover({ guestName, onOpen }: EnvelopeCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  useTilt(stageRef, 7);
  useTilt(gardenRef, 3);

  useEffect(() => buttonRef.current?.focus({ preventScroll: true }), []);

  // Posisi awal lapisan yang akan dianimasikan (GSAP memegang transform-nya).
  useGSAP(
    () => {
      gsap.set(flapRef.current, { z: 3, rotationX: 0, transformOrigin: "50% 0%" });
      gsap.set(letterRef.current, { z: 1 });
    },
    { scope: rootRef },
  );

  function open() {
    if (isOpening) return;
    setIsOpening(true);
    if (isReduced) {
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.4, onComplete: onOpen });
      return;
    }
    const shell = rootRef.current?.querySelectorAll("[data-shell]") ?? [];
    const chrome = rootRef.current?.querySelectorAll("[data-chrome]") ?? [];
    gsap
      .timeline({ onComplete: onOpen })
      // Teks di sekitar amplop menyingkir dulu agar tutup yang terbuka tidak menimpanya.
      .to(chrome, { autoAlpha: 0, y: 8, duration: 0.5, ease: "power1.out" }, 0)
      .to(stageRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" }, 0)
      .to(sealRef.current, { scale: 1.12, duration: 0.18, ease: "power1.out" }, 0)
      .to(sealRef.current, { scale: 0.3, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0.18)
      .to(flapRef.current, { rotationX: 180, duration: 1, ease: "power2.inOut" }, 0.4)
      // Setelah melewati 90°, tutup berada di belakang kartu.
      .set(flapRef.current, { z: -1 }, 0.9)
      .to(letterRef.current, { yPercent: -62, duration: 1.1, ease: "power3.inOut" }, 1.15)
      .to([...shell, flapRef.current], { y: "45vh", autoAlpha: 0, duration: 1, ease: "power2.in" }, 2.2)
      .to(letterRef.current, { yPercent: -20, scale: 1.3, duration: 1.1, ease: "power2.inOut" }, 2.2)
      .to(rootRef.current, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, 2.85);
  }

  const date = formatDotDate(content.events[0].start, content.timeZone);

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-labelledby="cover-title" className="pearl-paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Taman bunga di sudut — condong pelan mengikuti kursor, lebih lambat dari amplop (kedalaman). */}
      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div ref={gardenRef} className="preserve-3d absolute inset-0">
          <Bloom palette="blush" size="clamp(11rem,34vw,22rem)" seed={1} leaves={3} className="absolute -left-[8%] -top-[6%]" />
          <Bloom palette="champagne" size="clamp(5rem,12vw,8rem)" seed={4} tilt={40} className="absolute left-[18%] top-[16%] hidden sm:block" />
          <Bloom palette="pearl" size="clamp(12rem,36vw,24rem)" seed={2} leaves={4} className="absolute -bottom-[8%] -right-[8%]" />
          <Bloom palette="blush" size="clamp(6rem,14vw,10rem)" seed={7} tilt={36} className="absolute -bottom-[2%] left-[6%]" />
          <Bloom palette="champagne" size="clamp(4.5rem,10vw,7rem)" seed={9} className="absolute right-[10%] top-[8%]" />
        </div>
      </div>

      <div data-chrome>
        <p className="label rise-in relative" style={{ animationDelay: "200ms" }}>
          Undangan Pernikahan
        </p>
      </div>

      <div className="rise-in relative mt-10 [perspective:1400px]" style={{ animationDelay: "500ms" }}>
        <div ref={stageRef} className="preserve-3d">
          <div className="preserve-3d relative aspect-[3/2] w-[min(86vw,440px)]">
            {/* Punggung amplop */}
            <div data-shell className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#EFE8DE] to-[#E2D9CC] shadow-[0_40px_70px_-30px_rgba(57,49,47,0.45)]" />

            {/* Kartu undangan di dalam amplop */}
            <div ref={letterRef} className="pearl-card absolute inset-x-[5%] bottom-[4%] top-[6%] flex flex-col items-center justify-center rounded-[4px] px-4 text-center">
              <p className="label text-[0.55rem]">The Wedding of</p>
              <p id="cover-title" className="mt-1 font-script text-[clamp(2rem,8vw,3rem)] leading-tight text-ink">
                {pair[0].nickname} <span className="font-display text-[0.6em] italic text-champagne-deep">&amp;</span> {pair[1].nickname}
              </p>
              <p className="mt-1 font-display text-sm tracking-[0.3em] text-ink/70">{date}</p>
            </div>

            {/* Kantong depan (bukaan berbentuk V) + nama tamu */}
            <svg data-shell viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full [filter:drop-shadow(0_-2px_3px_rgba(57,49,47,0.08))]" style={{ transform: "translateZ(2px)" }}>
              <defs>
                <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F6F2EB" />
                  <stop offset="1" stopColor="#EAE3D9" />
                </linearGradient>
              </defs>
              <path d="M0 0 L150 112 L300 0 L300 200 L0 200Z" fill="url(#pocket)" />
              <path d="M0 200 L150 112 L300 200" fill="none" stroke="rgba(57,49,47,0.08)" strokeWidth="0.8" />
            </svg>
            <div data-shell className="absolute inset-x-0 bottom-[5%] text-center sm:bottom-[8%]" style={{ transform: "translateZ(2.5px)" }}>
              <p className="text-[0.56rem] uppercase tracking-[0.28em] text-ink/50 sm:text-[0.62rem]">Kepada Yth.</p>
              <p className="mx-auto mt-1 max-w-[80%] truncate font-display text-[clamp(1.05rem,4vw,1.35rem)] italic text-ink">{guestName}</p>
            </div>

            {/* Tutup: sisi luar pearl, sisi dalam berlapis kertas pink */}
            <div ref={flapRef} className="preserve-3d absolute inset-x-0 top-0 h-[58%]">
              <svg viewBox="0 0 300 116" preserveAspectRatio="none" className="backface-hidden absolute inset-0 h-full w-full [filter:drop-shadow(0_3px_4px_rgba(57,49,47,0.12))]">
                <defs>
                  <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F1EBE2" />
                    <stop offset="1" stopColor="#E5DDD1" />
                  </linearGradient>
                </defs>
                <path d="M0 0 L300 0 L150 116Z" fill="url(#flap)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />
              </svg>
              <div className="backface-hidden envelope-liner absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ transform: "rotateX(180deg)" }} />
            </div>

            {/* Segel lilin — tombol utama */}
            <div className="absolute left-1/2 top-[58%]" style={{ transform: "translate(-50%, -50%) translateZ(4px)" }}>
              <div ref={sealRef}>
                <button type="button" onClick={open} aria-label="Buka undangan" className="block rounded-full transition duration-500 ease-silk hover:scale-105 focus-visible:outline-offset-8">
                  <WaxSeal monogram={monogram} size="clamp(3.4rem,13vw,4.75rem)" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-chrome className="relative mt-14">
        <div className="rise-in flex flex-col items-center gap-3" style={{ animationDelay: "900ms" }}>
        <button ref={buttonRef} type="button" onClick={open} disabled={isOpening} className="btn-pearl">
          Buka Undangan
        </button>
          <p className="text-xs text-ink/50">Sentuh segel lilin untuk membuka</p>
        </div>
      </div>
    </div>
  );
}
