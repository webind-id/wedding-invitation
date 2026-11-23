"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/hooks/useScrollScene";
import { headingDeg, legSeconds, nextPoint, seededRandom, startPoint, type FlightArea, type Point } from "@/lib/butterfly";

interface ButterflyProps {
  seed: number;
  /** Lebar kupu-kupu (px). */
  size: number;
  /** Area terbang dalam pecahan lebar/tinggi wadah (0–1). */
  area: FlightArea;
  /** Detik sebelum muncul & mulai terbang. */
  delay?: number;
  /** Lama setengah kepakan (detik) — kupu-kupu kecil mengepak lebih cepat. */
  flap?: number;
}

/** Sesekali berhenti sejenak di satu titik, seperti kupu-kupu yang melayang. */
const HOVER_CHANCE = 0.25;
const HOVER_S = 0.7;
const TURN_S = 0.45;

/**
 * Kupu-kupu yang terbang bebas dan mengepakkan sayap (PENGECUALIAN aturan "tanpa animasi
 * berulang", atas permintaan pemilik produk).
 * - Sayap: gambar yang sama dibelah dua di sumbu badan; tiap belahan diputar rotateY (CSS
 *   `.kupu-wing`, globals.css) sehingga sayap benar-benar menutup-membuka.
 * - Terbang: GSAP dari titik ke titik acak (`lib/butterfly.ts`) di dalam area wadah; kepala
 *   diputar ke arah terbang.
 * Hanya bergerak saat wadahnya terlihat (kepakan ikut `is-swaying` dari useSwayZone); di
 * prefers-reduced-motion kupu-kupu diam hinggap dengan sayap terbuka.
 */
export function Butterfly({ seed, size, area, delay = 0, flap = 0.3 }: ButterflyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const start = startPoint(seed, area);

  useEffect(() => {
    const el = ref.current;
    const box = el?.offsetParent as HTMLElement | null;
    if (!el || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const rand = seededRandom(seed * 31 + 7);
    let at: Point = start;
    let leg: gsap.core.Timeline | null = null;
    let isVisible = true;

    // Dihitung dari ukuran wadah tiap lintasan, jadi tetap benar saat layar berubah ukuran.
    const toPx = (p: Point) => ({ x: p.x * box.clientWidth - size / 2, y: p.y * box.clientHeight - size / 2 });

    function fly() {
      const to = nextPoint(rand, at, area);
      const from = toPx(at);
      const dest = toPx(to);
      const pause = rand() < HOVER_CHANCE ? HOVER_S : 0;
      at = to;
      leg = gsap
        .timeline({ onComplete: fly, paused: !isVisible })
        .to(el, { rotation: `${headingDeg(from, dest)}_short`, duration: TURN_S, ease: "sine.inOut" })
        .to(el, { ...dest, duration: legSeconds(Math.hypot(dest.x - from.x, dest.y - from.y)), ease: "sine.inOut" }, 0.1)
        .to({}, { duration: pause });
    }

    // GSAP mengambil alih posisi: left/top awal (untuk SSR) diganti transform x/y.
    gsap.set(el, { left: 0, top: 0, ...toPx(start), rotation: Math.round(rand() * 360) });
    const intro = gsap.to(el, { autoAlpha: 1, duration: 0.8, delay, onComplete: fly });

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) leg?.resume();
      else leg?.pause();
    });
    io.observe(box);

    return () => {
      io.disconnect();
      intro.kill();
      leg?.kill();
    };
    // `start` & `area` berasal dari props statis; seed cukup sebagai kunci.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, size, delay]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="kupu"
      style={
        {
          width: size,
          left: `calc(${start.x * 100}% - ${size / 2}px)`,
          top: `calc(${start.y * 100}% - ${size / 2}px)`,
          "--flap": `${flap}s`,
        } as CSSProperties
      }
    >
      <span className="kupu-wing is-l" />
      <span className="kupu-wing is-r" />
    </div>
  );
}
