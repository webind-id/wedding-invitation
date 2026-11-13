import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { WISTERIA_TONES, wisteriaFlorets, wisteriaHeight } from "@/lib/flora";

interface StrandSpec {
  /** Posisi horizontal (persen lebar tirai). */
  left: number;
  length: number;
  /** Lebar untai (CSS). */
  width: string;
  /** Kedalaman parallax (px) — untai depan bergerak lebih cepat. */
  depth: number;
  /** Ayunan mengikuti scroll (derajat), berporos di pangkal. */
  sway: number;
  seed: number;
}

/** Satu untai wisteria: kuntum kecil mengecil & makin pekat ke bawah. */
export function WisteriaStrand({ length = 14, seed = 0, width = "3.5rem", className, style }: { length?: number; seed?: number; width?: string; className?: string; style?: CSSProperties }) {
  const florets = wisteriaFlorets(length, seed);
  const height = wisteriaHeight(length);
  return (
    <svg aria-hidden viewBox={`-30 0 60 ${height}`} className={cn("wisteria-strand pointer-events-none overflow-visible", className)} style={{ width, ...style }}>
      <path d={`M0 0 C2 ${height * 0.3} -3 ${height * 0.6} ${florets[florets.length - 1].x} ${height - 10}`} fill="none" stroke="#7F977E" strokeWidth="1.2" opacity="0.6" />
      {florets.map((f, k) => (
        <g key={k}>
          <ellipse cx={f.x - f.r * 0.45} cy={f.y} rx={f.r * 0.62} ry={f.r * 0.8} fill={WISTERIA_TONES[f.tone]} />
          <ellipse cx={f.x + f.r * 0.45} cy={f.y + 1} rx={f.r * 0.62} ry={f.r * 0.8} fill={WISTERIA_TONES[Math.min(3, f.tone + 1)]} opacity="0.92" />
          <circle cx={f.x} cy={f.y - f.r * 0.3} r={f.r * 0.3} fill="#FFFFFF" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

const DEFAULT_STRANDS: StrandSpec[] = [
  { left: 4, length: 11, width: "3rem", depth: -30, sway: 6, seed: 1 },
  { left: 14, length: 16, width: "3.8rem", depth: 40, sway: -8, seed: 2 },
  { left: 27, length: 9, width: "2.6rem", depth: -50, sway: 5, seed: 3 },
  { left: 66, length: 13, width: "3.2rem", depth: 30, sway: -6, seed: 4 },
  { left: 79, length: 18, width: "4rem", depth: 70, sway: 9, seed: 5 },
  { left: 92, length: 10, width: "2.8rem", depth: -20, sway: -5, seed: 6 },
];

/**
 * Tirai wisteria yang menjuntai dari dahan di atas. Tiap untai ada di lapisan parallax
 * sendiri dan berayun pelan mengikuti scroll — tidak ada animasi berulang.
 */
export function WisteriaCurtain({ strands = DEFAULT_STRANDS, className }: { strands?: StrandSpec[]; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 top-0", className)}>
      {/* Dahan */}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full">
        <path d="M-20 18 C 200 40, 380 4, 600 22 S 980 42, 1220 14" fill="none" stroke="#6E856F" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
        <path d="M-20 18 C 200 40, 380 4, 600 22 S 980 42, 1220 14" fill="none" stroke="#C4D2C1" strokeWidth="1.5" strokeLinecap="round" transform="translate(0 -1.5)" />
      </svg>
      {strands.map((s) => (
        <div key={s.seed} data-depth={s.depth} className="absolute top-3" style={{ left: `${s.left}%` }}>
          <div data-spin={s.sway} className="origin-top">
            <WisteriaStrand length={s.length} seed={s.seed} width={s.width} />
          </div>
        </div>
      ))}
    </div>
  );
}
