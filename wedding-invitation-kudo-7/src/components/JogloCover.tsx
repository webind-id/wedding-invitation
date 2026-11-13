"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { formatDotDate } from "@/lib/datetime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "./InvitationContext";
import { GebyokDoor } from "./three/GebyokDoor";
import { Gunungan } from "./three/Gunungan";
import { JogloRoof } from "./three/JogloRoof";

interface JogloCoverProps {
  guestName: string;
  /** Dipanggil setelah urutan pembukaan selesai. */
  onOpen: () => void;
}

/** Sudut istirahat gunungan — sedikit menghadap ke pintu. */
const REST_TURN = 24;

/** Saka (tiang kayu) dengan umpak batu di kaki dan sunduk di kepala. */
function Saka() {
  return (
    <div aria-hidden className="relative h-full w-[8%] shrink-0">
      <div className="absolute inset-x-[-30%] top-0 h-[5%] bg-[#3E2615] shadow-[inset_0_-1px_0_rgba(184,145,78,0.7)]" />
      <div className="absolute inset-x-0 bottom-[7%] top-[5%] bg-gradient-to-r from-[#4E2D18] via-[#7A4A2A] to-[#4E2D18]" />
      <div className="absolute inset-x-[-40%] bottom-0 h-[8%] bg-gradient-to-b from-[#9A8E7C] to-[#6F6556] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
    </div>
  );
}

/**
 * Pembuka: fasad rumah joglo di malam hari dengan pintu gebyok tertutup, diapit dua gunungan.
 * Saat dimuat, gunungan diputar masuk (sekali). Saat dibuka: gunungan berputar menyingkir,
 * kedua daun pintu mengayun ke dalam, cahaya dari pendopo menguat, lalu kamera maju menembus pintu.
 * GSAP memegang transform pintu, gunungan, dan rumah — atur lewat gsap.set, bukan CSS inline.
 */
export function JogloCover({ guestName, onOpen }: JogloCoverProps) {
  const { content, pair } = useInvitation();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const leftKayonRef = useRef<HTMLDivElement>(null);
  const rightKayonRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  useTilt(tiltRef, 6);

  useEffect(() => buttonRef.current?.focus({ preventScroll: true }), []);

  // Posisi awal + gunungan "dimainkan" masuk sekali.
  useGSAP(
    () => {
      gsap.set(leftDoorRef.current, { rotationY: 0, transformOrigin: "0% 50%" });
      gsap.set(rightDoorRef.current, { rotationY: 0, transformOrigin: "100% 50%" });
      gsap.set(glowRef.current, { autoAlpha: 0.35 });
      gsap.set(flashRef.current, { autoAlpha: 0 });
      gsap.set(leftKayonRef.current, { rotationY: REST_TURN, transformOrigin: "50% 100%" });
      gsap.set(rightKayonRef.current, { rotationY: -REST_TURN, transformOrigin: "50% 100%" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from([leftKayonRef.current, rightKayonRef.current], {
          rotationY: (i: number) => (i === 0 ? -540 : 540),
          y: 40,
          autoAlpha: 0,
          duration: 2.6,
          delay: 0.6,
          ease: "power3.out",
          stagger: 0.18,
        });
      });
      return () => mm.revert();
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
      .to(chrome, { autoAlpha: 0, y: 10, duration: 0.5, ease: "power1.out" }, 0)
      .to(tiltRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" }, 0)
      // Gunungan berputar sekali lagi lalu menyingkir ke luar layar.
      .to(leftKayonRef.current, { rotationY: "-=360", xPercent: -160, autoAlpha: 0, duration: 1.4, ease: "power2.in" }, 0.05)
      .to(rightKayonRef.current, { rotationY: "+=360", xPercent: 160, autoAlpha: 0, duration: 1.4, ease: "power2.in" }, 0.05)
      // Pintu gebyok mengayun ke dalam.
      .to(leftDoorRef.current, { rotationY: -112, duration: 1.7, ease: "power2.inOut" }, 0.55)
      .to(rightDoorRef.current, { rotationY: 112, duration: 1.7, ease: "power2.inOut" }, 0.55)
      .to(glowRef.current, { autoAlpha: 1, duration: 1.2, ease: "power1.inOut" }, 0.7)
      // Kamera maju menembus pintu.
      .to(houseRef.current, { scale: 3.6, yPercent: 14, duration: 1.7, ease: "power2.in" }, 1.55)
      .to(flashRef.current, { autoAlpha: 1, duration: 0.8, ease: "power1.in" }, 2.35);
  }

  const date = formatDotDate(content.events[0].start, content.timeZone);

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-labelledby="cover-title" className="malam-sky fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 text-gading">
      {/* Lantai pendopo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-transparent via-[#2B1D14]/80 to-[#120C08]" />

      <div data-chrome className="relative text-center">
        <p className="label rise-in text-prada-light" style={{ animationDelay: "200ms" }}>
          Sugeng Rawuh
        </p>
        <p className="rise-in mt-2 font-serif text-sm italic text-gading/60" style={{ animationDelay: "350ms" }}>
          Undangan Pawiwahan
        </p>
      </div>

      <div className="rise-in relative mt-5 [perspective:1400px] sm:mt-8" style={{ animationDelay: "450ms" }}>
        <div ref={tiltRef} className="preserve-3d">
          <div ref={houseRef} className="preserve-3d relative w-[min(88vw,440px)]" style={{ transformOrigin: "50% 66%" }}>
            <JogloRoof className="relative z-10 drop-shadow-[0_10px_14px_rgba(0,0,0,0.5)]" />

            {/* Fasad: saka — kusen & pintu — saka */}
            <div className="relative -mt-[2%] flex h-[clamp(14rem,40svh,21rem)] items-stretch justify-between px-[6%]">
              <Saka />

              <div className="relative mx-[5%] flex flex-1 flex-col pt-[4%]">
                {/* Papan nama di atas kusen */}
                <div className="panel-dark relative z-10 mx-auto w-[92%] px-3 py-2 text-center">
                  <p className="font-display text-[0.55rem] uppercase tracking-[0.34em] text-prada-light/80">The Wedding of</p>
                  <p id="cover-title" className="truncate font-serif text-[clamp(1.05rem,4.6vw,1.45rem)] italic leading-tight text-prada-light">
                    {pair[0].nickname} <span className="text-gading/60">&amp;</span> {pair[1].nickname}
                  </p>
                </div>

                {/* Kusen + daun pintu */}
                <div className="relative flex-1 border-x-[6px] border-t-[6px] border-[#3E2615] shadow-[0_0_0_1px_rgba(184,145,78,0.45)] [perspective:900px]">
                  {/* Cahaya pendopo di balik pintu */}
                  <div ref={glowRef} aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,#FBF8F1_0%,#F5EEE1_25%,#DCC08A_55%,#6E4426_100%)]" />
                  <div ref={leftDoorRef} className="backface-hidden absolute inset-y-0 left-0 w-1/2">
                    <GebyokDoor />
                  </div>
                  <div ref={rightDoorRef} className="backface-hidden absolute inset-y-0 right-0 w-1/2">
                    <GebyokDoor isMirrored />
                  </div>
                  <button type="button" onClick={open} disabled={isOpening} tabIndex={-1} aria-hidden className="absolute inset-0 cursor-pointer" />
                </div>
              </div>

              <Saka />
            </div>

            {/* Bebatur (lantai bertingkat) */}
            <div aria-hidden className="mx-auto h-2.5 w-[94%] bg-gradient-to-b from-[#8C8070] to-[#5E5548]" />
            <div aria-hidden className="mx-auto h-3 w-full bg-gradient-to-b from-[#6F6556] to-[#3A332B]" />

            {/* Gunungan pengapit — di depan fasad */}
            <div className="pointer-events-none absolute -left-[9%] bottom-[1%] [perspective:800px]" style={{ transform: "translateZ(60px)" }}>
              <span aria-hidden className="absolute -bottom-1 left-1/2 h-3 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[6px]" />
              <div ref={leftKayonRef} className="preserve-3d">
                <Gunungan size="clamp(5.6rem,25vw,8.6rem)" />
              </div>
            </div>
            <div className="pointer-events-none absolute -right-[9%] bottom-[1%] [perspective:800px]" style={{ transform: "translateZ(60px)" }}>
              <span aria-hidden className="absolute -bottom-1 left-1/2 h-3 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[6px]" />
              <div ref={rightKayonRef} className="preserve-3d">
                <Gunungan size="clamp(5.6rem,25vw,8.6rem)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-chrome className="relative mt-7 text-center sm:mt-10">
        <div className="rise-in flex flex-col items-center" style={{ animationDelay: "900ms" }}>
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gading/55">Kepada Yth.</p>
          <p className="mt-1 max-w-[80vw] truncate font-serif text-[clamp(1.2rem,5vw,1.55rem)] italic text-gading">{guestName}</p>
          <button ref={buttonRef} type="button" onClick={open} disabled={isOpening} className="btn-prada mt-5">
            Buka Undangan
          </button>
          <p className="mt-3 font-serif text-sm italic text-gading/45">{date} · ketuk pintu untuk masuk</p>
        </div>
      </div>

      {/* Kilau gading saat menembus pintu — menyambung ke latar hero. */}
      <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 bg-gading" />
    </div>
  );
}
