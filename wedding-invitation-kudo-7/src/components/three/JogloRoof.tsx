import { useId } from "react";
import { cn } from "@/lib/cn";

const FRINGE_X = Array.from({ length: 25 }, (_, i) => i * 16);

/**
 * Atap rumah joglo tiga susun: brunjung (curam, di puncak) → penanggap → penitih (emper lebar),
 * dengan molo bermustaka di bubungan dan lisplang bertumpal di tepi bawah.
 */
export function JogloRoof({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const tiles = `url(#${uid}-tiles)`;

  return (
    <svg viewBox="0 0 400 176" className={cn("block w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A3825" />
          <stop offset="1" stopColor="#2B1D14" />
        </linearGradient>
        {/* Deret sirap: garis mendatar + sambungan berselang. */}
        <pattern id={`${uid}-tiles`} width="14" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 7.5 H14 M4 0 V7.5 M11 0 V3.5" stroke="#DCC08A" strokeOpacity="0.12" strokeWidth="0.8" fill="none" />
        </pattern>
      </defs>

      {/* Mustaka (hiasan ujung molo) melengkung ke atas */}
      <g fill="none" stroke="#B8914E" strokeWidth="2.4" strokeLinecap="round">
        <path d="M150 24 C 140 22, 136 12, 142 6 C 146 2, 152 6, 148 10" />
        <path d="M250 24 C 260 22, 264 12, 258 6 C 254 2, 248 6, 252 10" />
      </g>

      <g stroke="#B8914E" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M108 92 L292 92 L352 128 L48 128Z" fill={`url(#${uid}-roof)`} />
        <path d="M108 92 L292 92 L352 128 L48 128Z" fill={tiles} stroke="none" />
        <path d="M48 128 L352 128 L400 152 L0 152Z" fill={`url(#${uid}-roof)`} />
        <path d="M48 128 L352 128 L400 152 L0 152Z" fill={tiles} stroke="none" />
        <path d="M150 24 L250 24 L292 92 L108 92Z" fill={`url(#${uid}-roof)`} />
        <path d="M150 24 L250 24 L292 92 L108 92Z" fill={tiles} stroke="none" />
      </g>
      {/* Molo (bubungan) */}
      <path d="M146 24 H254" stroke="#DCC08A" strokeWidth="3" strokeLinecap="round" />

      {/* Lisplang + lambrekin bergigi */}
      <rect x="0" y="152" width="400" height="10" fill="#3E2615" stroke="#B8914E" strokeWidth="1" />
      <g fill="#B8914E">
        {FRINGE_X.map((x) => (
          <path key={x} d={`M${x} 162 L${x + 16} 162 L${x + 8} 172Z`} fillOpacity={x % 32 === 0 ? 0.9 : 0.55} />
        ))}
      </g>
    </svg>
  );
}
