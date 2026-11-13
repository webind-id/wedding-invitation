import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Satu daun pintu gebyok berukir (sisi kiri). Sisi kanan memakai `isMirrored`.
 * Tiga panel: lung-lungan (sulur) di atas, kawung di tengah, wajikan di bawah;
 * ukiran disapu prada.
 */
export function GebyokDoor({ isMirrored, className }: { isMirrored?: boolean; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg viewBox="0 0 100 280" preserveAspectRatio="none" className={cn("block h-full w-full", className)} style={isMirrored ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5E3820" />
          <stop offset="0.55" stopColor="#7A4A2A" />
          <stop offset="1" stopColor="#4E2D18" />
        </linearGradient>
      </defs>

      <rect width="100" height="280" fill={`url(#${uid}-wood)`} />
      <rect x="1" y="1" width="98" height="278" fill="none" stroke="#2B1D14" strokeWidth="2" />

      {/* Bingkai panel (cekung) */}
      <g fill="#3E2615" fillOpacity="0.5" stroke="#B8914E" strokeOpacity="0.55" strokeWidth="1">
        <rect x="10" y="12" width="80" height="88" />
        <rect x="10" y="108" width="80" height="68" />
        <rect x="10" y="184" width="80" height="84" />
      </g>

      <g fill="none" stroke="#DCC08A" strokeWidth="1.6" strokeLinecap="round">
        {/* Lung-lungan: dua sulur simetris dari batang tengah, bunga di puncak */}
        <path d="M50 94 V40" />
        <path d="M50 86 C 50 70, 24 72, 24 54 C 24 40, 42 38, 42 50 C 42 56, 36 56, 36 52" />
        <path d="M50 86 C 50 70, 76 72, 76 54 C 76 40, 58 38, 58 50 C 58 56, 64 56, 64 52" />
        <path d="M50 66 C 40 62, 34 66, 30 74" />
        <path d="M50 66 C 60 62, 66 66, 70 74" />
        {/* Kawung */}
        <ellipse cx="50" cy="127" rx="7" ry="11" />
        <ellipse cx="50" cy="157" rx="7" ry="11" />
        <ellipse cx="35" cy="142" rx="11" ry="7" />
        <ellipse cx="65" cy="142" rx="11" ry="7" />
        {/* Wajikan bersusun */}
        <path d="M50 194 L82 226 L50 258 L18 226Z" />
        <path d="M50 208 L68 226 L50 244 L32 226Z" />
      </g>
      <g fill="#DCC08A">
        <circle cx="50" cy="34" r="4" />
        <circle cx="50" cy="142" r="2.4" />
        <circle cx="50" cy="226" r="3" />
      </g>

      {/* Gelang pintu di tepi tengah */}
      <circle cx="90" cy="146" r="5" fill="none" stroke="#DCC08A" strokeWidth="1.8" />
      <circle cx="90" cy="140" r="1.6" fill="#DCC08A" />
    </svg>
  );
}
