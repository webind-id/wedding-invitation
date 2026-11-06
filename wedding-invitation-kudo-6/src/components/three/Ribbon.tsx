import { useId } from "react";
import { cn } from "@/lib/cn";

const PATHS = {
  wave: "M-40 190 C 160 40, 360 300, 580 170 S 920 30, 1240 150",
  loop: "M-40 230 C 200 230, 300 70, 460 95 C 620 120, 560 265, 470 245 C 380 225, 420 85, 610 72 C 820 58, 990 225, 1240 120",
} as const;

/**
 * Pita satin yang "terbentang" mengikuti scroll: tiga goresan pada jalur yang sama —
 * bayangan, kain champagne→pink, dan kilau tipis — memberi kesan satin tanpa efek emas mengilap.
 */
export function Ribbon({ variant = "wave", className }: { variant?: keyof typeof PATHS; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const d = PATHS[variant];

  return (
    <svg aria-hidden viewBox="0 0 1200 300" preserveAspectRatio="none" className={cn("pointer-events-none w-full overflow-visible", className)}>
      <defs>
        <linearGradient id={`${uid}-satin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D7BE99" />
          <stop offset="0.35" stopColor="#EED9D3" />
          <stop offset="0.55" stopColor="#E8C9CC" />
          <stop offset="0.8" stopColor="#E7D3B4" />
          <stop offset="1" stopColor="#D7BE99" />
        </linearGradient>
      </defs>
      <path data-draw d={d} fill="none" stroke="rgba(57,49,47,0.08)" strokeWidth="18" strokeLinecap="round" transform="translate(0 6)" />
      <path data-draw d={d} fill="none" stroke={`url(#${uid}-satin)`} strokeWidth="14" strokeLinecap="round" />
      <path data-draw d={d} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" transform="translate(0 -3.5)" />
    </svg>
  );
}
