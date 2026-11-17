"use client";

import type { CSSProperties } from "react";
import { petalShower } from "@/lib/scenery";

const DROPS = petalShower(14, 2027);

/**
 * Hujan kelopak mei SEKALI saat undangan dibuka: 14 kelopak/bunga jatuh bergiliran lalu hilang
 * (animasi `forwards`, tidak diulang). Disembunyikan bila prefers-reduced-motion.
 */
export function PetalShower() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-column -translate-x-1/2 overflow-hidden">
      {DROPS.map((d, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="petal-drop"
          style={
            {
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              "--dx": `${d.dx}px`,
              "--rot": `${d.rot}deg`,
              "--dur": `${d.duration}s`,
              "--delay": `${d.delay}s`,
            } as CSSProperties
          }
        >
          <use href={d.kind === "petal" ? "#kl-petal" : "#kl-mei"} />
        </svg>
      ))}
    </div>
  );
}
