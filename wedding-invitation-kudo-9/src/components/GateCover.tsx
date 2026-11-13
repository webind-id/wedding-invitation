"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { formatDotDate } from "@/lib/datetime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "./InvitationContext";
import { Flower } from "./three/Flower";
import { WisteriaCurtain } from "./three/Wisteria";
import { WaxSeal } from "./ui/WaxSeal";

interface GateCoverProps {
  guestName: string;
  /** Dipanggil setelah urutan pembukaan selesai. */
  onOpen: () => void;
}

/** Gambar garis teratai di muka kartu lipat — satu gambar utuh yang terbelah dua oleh lipatan. */
function GateArt() {
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect x="10" y="10" width="180" height="230" rx="4" fill="none" stroke="rgba(244,241,246,0.35)" strokeWidth="0.8" />
      <rect x="15" y="15" width="170" height="220" rx="2" fill="none" stroke="rgba(244,241,246,0.2)" strokeWidth="0.6" />
      <g fill="none" stroke="rgba(244,241,246,0.5)" strokeWidth="0.9" transform="translate(100 196)">
        <path d="M0 0 C-10 -14 -10 -40 0 -60 C10 -40 10 -14 0 0Z" />
        <path d="M0 0 C-22 -8 -34 -30 -30 -52 C-16 -42 -6 -22 0 0Z" />
        <path d="M0 0 C22 -8 34 -30 30 -52 C16 -42 6 -22 0 0Z" />
        <path d="M0 0 C-30 -2 -50 -16 -56 -34 C-36 -30 -16 -16 0 0Z" />
        <path d="M0 0 C30 -2 50 -16 56 -34 C36 -30 16 -16 0 0Z" />
        <path d="M-70 10 C-40 4 40 4 70 10" />
        <path d="M-50 18 C-25 14 25 14 50 18" opacity="0.6" />
      </g>
      <g fill="rgba(244,241,246,0.4)">
        {[30, 48, 66, 134, 152, 170].map((x, k) => (
          <circle key={x} cx={x} cy={30 + (k % 3) * 9} r="2.2" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Kartu undangan lipat (gatefold) 3D. Lapisan: kartu dalam (nama) → dua daun pintu
 * (muka plum bergambar teratai, sisi dalam lilac) → segel lilin di lipatan.
 * Saat dibuka: segel pecah, kedua daun berputar membuka ke samping, kartu dalam mendekat ke kamera.
 */
export function GateCover({ guestName, onOpen }: GateCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  useTilt(stageRef, 8);
  useTilt(gardenRef, 3);

  useEffect(() => buttonRef.current?.focus({ preventScroll: true }), []);

  // Posisi awal lapisan yang akan dianimasikan (GSAP memegang transform-nya).
  useGSAP(
    () => {
      gsap.set(leftRef.current, { z: 2, rotationY: 0, transformOrigin: "0% 50%" });
      gsap.set(rightRef.current, { z: 2, rotationY: 0, transformOrigin: "100% 50%" });
      gsap.set(innerRef.current, { z: 0 });
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
    const chrome = rootRef.current?.querySelectorAll("[data-chrome]") ?? [];
    gsap
      .timeline({ onComplete: onOpen })
      .to(chrome, { autoAlpha: 0, y: 8, duration: 0.5, ease: "power1.out" }, 0)
      .to(stageRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" }, 0)
      .to(sealRef.current, { scale: 1.12, duration: 0.18, ease: "power1.out" }, 0)
      .to(sealRef.current, { scale: 0.3, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0.18)
      .to(leftRef.current, { rotationY: -158, duration: 1.4, ease: "power3.inOut" }, 0.45)
      .to(rightRef.current, { rotationY: 158, duration: 1.4, ease: "power3.inOut" }, 0.55)
      .to([leftRef.current, rightRef.current], { autoAlpha: 0, duration: 0.6, ease: "power1.in" }, 1.75)
      .to(innerRef.current, { scale: 1.35, duration: 1.2, ease: "power2.inOut" }, 1.7)
      .to(rootRef.current, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, 2.45);
  }

  const date = formatDotDate(content.events[0].start, content.timeZone);

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-labelledby="cover-title" className="dusk-paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Wisteria di atas & kolam teratai di bawah — condong pelan mengikuti kursor. */}
      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div ref={gardenRef} className="preserve-3d absolute inset-0">
          <WisteriaCurtain className="opacity-90" />
          <Flower kind="lotus" palette="lilac" size="clamp(9rem,28vw,17rem)" seed={1} pad className="absolute -bottom-[5%] -left-[8%]" />
          <Flower kind="lotus" palette="moon" size="clamp(5rem,13vw,8rem)" seed={4} pad tilt={46} className="absolute bottom-[10%] left-[22%] hidden sm:block" />
          <Flower kind="dahlia" palette="plum" size="clamp(8rem,24vw,14rem)" seed={2} className="absolute -bottom-[6%] -right-[6%]" />
          <Flower kind="lotus" palette="apricot" size="clamp(4.5rem,11vw,7rem)" seed={8} pad tilt={44} className="absolute bottom-[3%] right-[22%]" />
        </div>
      </div>

      <div data-chrome>
        <p className="label rise-in relative" style={{ animationDelay: "200ms" }}>
          Undangan Pernikahan
        </p>
      </div>

      <div className="rise-in relative mt-8 [perspective:1600px]" style={{ animationDelay: "500ms" }}>
        <div ref={stageRef} className="preserve-3d">
          <div className="preserve-3d relative aspect-[4/5] w-[min(70vw,330px)]">
            {/* Kartu dalam: nama pasangan */}
            <div ref={innerRef} className="veil-card absolute inset-0 flex flex-col items-center justify-center rounded-[1.25rem] px-5 text-center">
              <p className="label text-[0.56rem]">The Wedding of</p>
              <p id="cover-title" className="mt-3 font-script text-[clamp(2.3rem,9vw,3.3rem)] leading-[1.05] text-ink">
                {pair[0].nickname}
                <span className="block font-display text-[0.5em] italic text-lavender">&amp;</span>
                {pair[1].nickname}
              </p>
              <p className="mt-4 font-display text-sm tracking-[0.32em] text-ink/70">{date}</p>
            </div>

            {/* Daun kiri */}
            <div ref={leftRef} className="preserve-3d absolute inset-y-0 left-0 w-1/2">
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-l-[1.25rem] bg-gradient-to-br from-[#7A5689] to-[#4E3159] shadow-[0_40px_70px_-30px_rgba(46,39,51,0.6)]">
                <div className="absolute inset-y-0 left-0 w-[200%]">
                  <GateArt />
                </div>
              </div>
              <div className="backface-hidden gate-liner absolute inset-0 rounded-r-[1.25rem]" style={{ transform: "rotateY(180deg)" }} />
            </div>

            {/* Daun kanan */}
            <div ref={rightRef} className="preserve-3d absolute inset-y-0 right-0 w-1/2">
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-r-[1.25rem] bg-gradient-to-bl from-[#7A5689] to-[#4E3159] shadow-[0_40px_70px_-30px_rgba(46,39,51,0.6)]">
                <div className="absolute inset-y-0 right-0 w-[200%]">
                  <GateArt />
                </div>
                <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-black/20" />
              </div>
              <div className="backface-hidden gate-liner absolute inset-0 rounded-l-[1.25rem]" style={{ transform: "rotateY(180deg)" }} />
            </div>

            {/* Segel lilin di lipatan — tombol utama */}
            <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%) translateZ(6px)" }}>
              <div ref={sealRef}>
                <button type="button" onClick={open} aria-label="Buka undangan" className="block rounded-full transition duration-500 ease-silk hover:scale-105 focus-visible:outline-offset-8">
                  <WaxSeal monogram={monogram} size="clamp(3.6rem,15vw,5rem)" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-chrome className="relative mt-10">
        <div className="rise-in flex flex-col items-center text-center" style={{ animationDelay: "900ms" }}>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-ink/55">Kepada Yth.</p>
          <p className="mt-1 max-w-[80vw] truncate font-display text-[clamp(1.2rem,4.5vw,1.5rem)] italic text-ink">{guestName}</p>
          <button ref={buttonRef} type="button" onClick={open} disabled={isOpening} className="btn-plum mt-6">
            Buka Undangan
          </button>
          <p className="mt-3 text-xs text-ink/55">Sentuh segel untuk membuka kartu</p>
        </div>
      </div>
    </div>
  );
}
