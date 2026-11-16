import { cn } from "@/lib/cn";

/** Pembatas bagian: seutas tali emas dengan tiga lampion mungil tergantung. */
export function LanternDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center py-4 select-none", className)}>
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
        <path d="M2 8 Q100 26 198 8" stroke="#E7C27A" strokeOpacity="0.55" strokeWidth="1" />
        {[
          { x: 60, y: 16.5, s: 0.8 },
          { x: 100, y: 17, s: 1 },
          { x: 140, y: 16.5, s: 0.8 },
        ].map(({ x, y, s }) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <line x1="0" y1="0" x2="0" y2="4" stroke="#E7C27A" strokeOpacity="0.6" strokeWidth="0.8" />
            <path d="M-6 4 H6 L4.4 17 H-4.4 Z" fill="url(#lantern-paper)" />
            <circle cx="0" cy="18.5" r="1.4" fill="#FFE9A8" />
          </g>
        ))}
        <defs>
          <linearGradient id="lantern-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF1C9" />
            <stop offset="0.55" stopColor="#F8B23A" />
            <stop offset="1" stopColor="#C9561F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
