import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { FLOWERS } from "@/lib/flora";

/** Kelopak teratai lepas yang melayang — ornamen kecil untuk lapisan parallax. Diam, tanpa animasi berulang. */
export function Petal({ size = "2.5rem", rotate = 0, tone = "#CDBCDD", className, style }: { size?: string; rotate?: number; tone?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="-40 -95 80 100" className={cn("pointer-events-none drop-shadow-[0_6px_6px_rgba(46,39,51,0.14)]", className)} style={{ width: size, height: size, ...style }}>
      <g transform={`rotate(${rotate} 0 -44)`}>
        <path d={FLOWERS.lotus.petal} fill={tone} opacity="0.9" />
        <path d={FLOWERS.lotus.vein} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
