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
  /** Rama di kiri (menghadap kanan), Shinta di kanan (menghadap kiri). */
  side: "left" | "right";
  /** Undangan dibuka → wayang naik di depan joglo dan menyambut tamu. */
  isOpen: boolean;
  /** Gerbang dibuka → wayang membuka seperti daun gerbang. */
  isParted: boolean;
}

/** Titik putar di bawah tokoh — tempat dalang memegang gapit (tangkai wayang). */
const GAPIT = "50% 96%";
const PERSPECTIVE = 900;
/** Detik setelah dibuka sebelum wayang naik (pohon sudah setengah tumbuh). */
const GREET_DELAY = 0.9;
/** Selaras dengan transisi `translate` .wayang di globals.css. */
const PART_DELAY = 0.2;

/**
 * Rama & Shinta "dimainkan dalang".
 * 1. Menyambut (`isOpen`): naik dari balik taman ke tengah, berdampingan menutupi joglo, lalu
 *    menunduk menyembah tamu.
 * 2. Membuka (`isParted`): berputar pada gapit seperti daun gerbang yang dibuka (rotateY)
 *    sambil bergeser ke tepi — posisinya dari CSS (`.parted .wayang`, satuan cqw) — lalu
 *    kiprah dua lompatan kecil di sisi joglo.
 * Ketuk wayang → berputar sekali dan melompat (gerak hanya karena interaksi).
 */
export function Wayang({ src, width, height, side, isOpen, isParted }: WayangProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  // Arah "ke luar panggung": kiri = negatif, kanan = positif.
  const dir = side === "left" ? -1 : 1;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { transformOrigin: GAPIT, transformPerspective: PERSPECTIVE });
      if (isReduced) {
        gsap.set(el, { autoAlpha: isOpen ? 1 : 0, y: 0, rotation: 0, rotationY: 0 });
        return;
      }
      if (isParted) {
        gsap.killTweensOf(el);
        gsap
          .timeline({ delay: PART_DELAY })
          .set(el, { autoAlpha: 1 })
          .to(el, { y: 0, duration: 0.4, ease: "power2.out" }, 0)
          // Daun gerbang terbuka: berputar menjauh, lalu kembali menghadap pasangannya di tepi.
          .to(el, { rotationY: dir * 70, rotation: dir * 4, duration: 0.8, ease: "power2.in" }, 0)
          .to(el, { rotationY: 0, rotation: 0, duration: 1.1, ease: "power3.out" }, 0.8)
          // Kiprah: dua lompatan kecil
          .to(el, { y: -14, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 1.9)
          .to(el, { y: -8, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 });
        return;
      }
      if (!isOpen) {
        gsap.set(el, { autoAlpha: 0, y: "55%", rotation: 0, rotationY: 0 });
        return;
      }
      gsap
        .timeline({ delay: GREET_DELAY })
        .to(el, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 0)
        .to(el, { y: 0, duration: 1.4, ease: "power3.out" }, 0)
        // Menyembah: condong ke arah pasangannya/tamu, lalu tegak kembali.
        .to(el, { rotation: -dir * 8, duration: 0.6, ease: "sine.inOut" }, 1.35)
        .to(el, { rotation: 0, duration: 0.7, ease: "sine.inOut" }, 2.15);
    },
    { dependencies: [isOpen, isParted, isReduced], scope: ref },
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
