import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { PETAL_PATH } from "@/lib/bloom";

/** Kelopak lepas yang tergeletak di udara — ornamen kecil untuk lapisan parallax. Diam, tanpa animasi berulang. */
export function Petal({ size = "2.5rem", rotate = 0, tone = "#E8C9CC", className, style }: { size?: string; rotate?: number; tone?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="-40 -90 80 100" className={cn("pointer-events-none drop-shadow-[0_6px_6px_rgba(57,49,47,0.12)]", className)} style={{ width: size, height: size, ...style }}>
      <g transform={`rotate(${rotate} 0 -40)`}>
        <path d={PETAL_PATH} fill={tone} opacity="0.92" />
        <path d="M0 -6 C-6 -30 -6 -50 0 -70" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
