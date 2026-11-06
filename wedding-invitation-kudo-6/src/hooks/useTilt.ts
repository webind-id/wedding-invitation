"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./useScrollScene";

/**
 * Objek 3D condong mengikuti kursor (hanya perangkat dengan mouse, tanpa reduced motion).
 * Bergerak hanya saat kursor bergerak — tidak ada animasi menganggur yang berulang.
 */
export function useTilt(target: RefObject<HTMLElement | null>, maxDeg = 8) {
  useGSAP(
    () => {
      const el = target.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const toX = gsap.quickTo(el, "rotationX", { duration: 1.1, ease: "power3.out" });
        const toY = gsap.quickTo(el, "rotationY", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          toY(nx * maxDeg * 2);
          toX(-ny * maxDeg * 2);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { dependencies: [maxDeg] },
  );
}
