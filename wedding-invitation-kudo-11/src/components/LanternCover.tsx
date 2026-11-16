"use client";

import { useGSAP } from "@gsap/react";
import { Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "./InvitationContext";
import { Lantern3D } from "./lantern/Lantern3D";
import { LanternSky } from "./lantern/LanternSky";

interface LanternCoverProps {
  guestName: string;
  /** Dipanggil setelah urutan pembukaan selesai. */
  onOpen: () => void;
}

/**
 * Sampul "Lampion Malam": langit malam dengan lampion yang terus terbang naik,
 * lampion monogram 3D besar di tengah (condong mengikuti kursor), dan nama tamu.
 *
 * Saat dibuka: api lampion membesar → cahaya hangat memenuhi layar → lampion
 * terbang tinggi ke langit → sampul memudar dan halaman utama tampil.
 */
export function LanternCover({ guestName, onOpen }: LanternCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lanternRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);

  useTilt(stageRef, 12);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  useGSAP(
    () => {
      gsap.set(flareRef.current, { autoAlpha: 0, scale: 0.4 });
    },
    { scope: rootRef },
  );

  function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);

    if (isReduced) {
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.4, onComplete: onOpen });
      return;
    }

    const chrome = rootRef.current?.querySelectorAll("[data-chrome]") ?? [];
    gsap
      .timeline({ onComplete: onOpen })
      .to(chrome, { autoAlpha: 0, y: 12, duration: 0.5, ease: "power2.out", stagger: 0.05 }, 0)
      .to(stageRef.current, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.out" }, 0)
      // 1. Api menyala: lampion sedikit membesar, cahaya mulai berpendar
      .to(lanternRef.current, { scale: 1.15, duration: 0.6, ease: "power2.out" }, 0.2)
      .to(flareRef.current, { autoAlpha: 0.9, scale: 1, duration: 1.1, ease: "power2.out" }, 0.3)
      // 2. Lampion dilepas terbang ke langit
      .to(lanternRef.current, { y: "-75vh", scale: 0.45, duration: 1.8, ease: "power2.in" }, 0.8)
      // 3. Sampul memudar ke halaman utama
      .to(rootRef.current, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 2.1);
  }

  const firstEvent = content.events[0];
  const dateStr = firstEvent ? formatLongDate(firstEvent.start, content.timeZone) : "";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-couple-title"
      className="night-sky-deep fixed inset-0 z-50 flex select-none flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Bulan & langit lampion */}
      <div aria-hidden className="moon-disc pointer-events-none absolute right-[8%] top-[7%] h-16 w-16 opacity-90 sm:h-24 sm:w-24" />
      <LanternSky mode="rise" count={18} seed={7} options={{ minDuration: 16, maxDuration: 34 }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950 to-transparent" />

      {/* Cahaya hangat yang memenuhi layar saat lampion dinyalakan */}
      <div
        ref={flareRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,214,140,0.55) 0%, rgba(245,165,36,0.25) 30%, transparent 60%)" }}
      />

      <div data-chrome className="rise-in relative z-10 mb-2 text-center">
        <span className="badge-gold">The Wedding Of</span>
      </div>

      {/* Lampion monogram 3D */}
      <div className="rise-in relative z-10 [perspective:1200px]" style={{ animationDelay: "0.15s" }}>
        <div ref={stageRef} className="preserve-3d">
          <div ref={lanternRef} className="relative mx-auto mb-4 mt-12 cursor-pointer" onClick={handleOpen}>
            <Lantern3D size={112} variant="amber" spin={18} label={monogram} className="sm:hidden" />
            <Lantern3D size={136} variant="amber" spin={18} label={monogram} className="hidden sm:block" />
            {/* tali gantung di atas lampion */}
            <span aria-hidden className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold/60" />
          </div>
        </div>
      </div>

      <div data-chrome className="rise-in relative z-10 text-center" style={{ animationDelay: "0.3s" }}>
        <h1 id="cover-couple-title" className="font-serif text-4xl font-semibold leading-tight text-moon sm:text-5xl">
          {pair[0].nickname}
          <span className="text-glow mx-3 font-serif text-4xl font-normal italic text-ember-300 sm:text-5xl">&amp;</span>
          {pair[1].nickname}
        </h1>
        {dateStr && <p className="mt-2 font-sans text-xs uppercase tracking-[0.3em] text-gold-light/90">{dateStr}</p>}
      </div>

      <div
        data-chrome
        className="rise-in relative z-10 mt-8 flex w-full max-w-xs flex-col items-center text-center"
        style={{ animationDelay: "0.45s" }}
      >
        <div className="w-full rounded-2xl border border-gold/25 bg-night-800/70 px-4 py-3 backdrop-blur-md">
          <p className="mb-0.5 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-moon-subtle">
            {content.coverGreeting || "Kepada Yth."}
          </p>
          <p className="truncate font-serif text-xl font-semibold text-gold-light">{guestName}</p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          className="btn-ember group relative mt-4 w-full overflow-hidden px-8 py-3"
        >
          <Flame className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden />
          <span>Nyalakan Lampion</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        <p className="mt-2 text-[0.7rem] text-moon-subtle">Sentuh lampion atau tombol untuk membuka undangan</p>
      </div>
    </div>
  );
}
