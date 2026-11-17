"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/hooks/useScrollScene";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

interface WayangProps {
  src: string;
  width: number;
  height: number;
  /** Sisi panggung. Rama di kiri (menghadap kanan), Shinta di kanan (menghadap kiri). */
  side: "left" | "right";
  /** Pembukaan dimulai saat undangan dibuka. */
  isOpen: boolean;
  /** Detik setelah dibuka sebelum wayang diangkat (setelah daun menyibak). */
  delay?: number;
}

/** Titik putar di bawah tokoh — tempat dalang memegang gapit (tangkai wayang). */
const GAPIT = "50% 96%";
const PERSPECTIVE = 900;

/**
 * Wayang yang "dimainkan dalang", sekali jalan saat undangan dibuka:
 *   1. diangkat dari gedebog: naik dari bawah, miring, masih membelakangi lawannya;
 *   2. diputar (rotateY 180° → 0°) hingga saling berhadapan;
 *   3. diayun beberapa kali di gapit, makin lama makin kecil;
 *   4. kiprah: dua lompatan kecil, lalu diam.
 * Ketuk wayang → berputar sekali dan melompat (gerak hanya karena interaksi, tidak berulang sendiri).
 */
export function Wayang({ src, width, height, side, isOpen, delay = 1.6 }: WayangProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  // Arah "ke luar panggung": kiri = negatif, kanan = positif.
  const dir = side === "left" ? -1 : 1;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { transformOrigin: GAPIT, transformPerspective: PERSPECTIVE });
      if (!isOpen) {
        gsap.set(el, { autoAlpha: 0, x: dir * 90, y: "45%", rotation: dir * 18, rotationY: 180 });
        return;
      }
      if (isReduced) {
        gsap.set(el, { autoAlpha: 1, x: 0, y: 0, rotation: 0, rotationY: 0 });
        return;
      }
      gsap
        .timeline({ delay })
        // 1. Diangkat dari gedebog
        .to(el, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 0)
        .to(el, { x: 0, y: 0, duration: 1.3, ease: "power3.out" }, 0)
        // 2. Diputar menghadap lawan
        .to(el, { rotationY: 0, duration: 1.1, ease: "power2.inOut" }, 0.55)
        // 3. Diayun di gapit, makin kecil
        .to(el, { rotation: -dir * 9, duration: 0.55, ease: "sine.inOut" }, 0.6)
        .to(el, { rotation: dir * 5, duration: 0.5, ease: "sine.inOut" })
        .to(el, { rotation: -dir * 2.5, duration: 0.45, ease: "sine.inOut" })
        .to(el, { rotation: 0, duration: 0.4, ease: "sine.out" })
        // 4. Kiprah: dua lompatan kecil
        .to(el, { y: -16, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, ">-0.1")
        .to(el, { y: -9, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 });
    },
    { dependencies: [isOpen, isReduced], scope: ref },
  );

  function play() {
    const el = ref.current;
    if (!el || isReduced || gsap.isTweening(el)) return;
    gsap
      .timeline()
      .to(el, { rotationY: dir * -360, duration: 0.9, ease: "power2.inOut" })
      .set(el, { rotationY: 0 })
      .to(el, { y: -20, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, 0.55)
      .to(el, { rotation: -dir * 6, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.55);
  }

  return (
    <div className={cn("scene-el wayang", side === "left" ? "is-l" : "is-r")}>
      <div ref={ref} data-wayang onClick={play} className="h-full cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={width} height={height} decoding="async" draggable={false} />
      </div>
    </div>
  );
}
