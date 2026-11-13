import { cn } from "@/lib/cn";

const BUD_GAP = 7;
const VIEW_HEIGHT = 120;

interface Strand {
  x: number;
  length: number;
}

/** Panjang untaian bergelombang (deterministik) agar tirai melati tidak terlihat seragam. */
function strands(count: number, width: number): Strand[] {
  const gap = width / (count + 1);
  return Array.from({ length: count }, (_, i) => ({
    x: gap * (i + 1),
    length: 34 + Math.round(Math.abs(Math.sin(i * 1.7 + 0.6)) * 58),
  }));
}

/**
 * Ronce melati — untaian kuncup melati yang menjuntai seperti pada sanggul dan
 * keris pengantin Jawa. SVG statis; gerak datang dari parallax pembungkusnya.
 */
export function Ronce({ count = 9, width = 240, className }: { count?: number; width?: number; className?: string }) {
  const list = strands(count, width);
  const swag = list.map((s, i) => (i === 0 ? `M0 4 Q${s.x / 2} 14 ${s.x} 6` : `Q${(list[i - 1].x + s.x) / 2} 16 ${s.x} 6`)).join(" ") + ` Q${(list[list.length - 1].x + width) / 2} 14 ${width} 4`;

  return (
    <svg viewBox={`0 0 ${width} ${VIEW_HEIGHT}`} className={cn("block", className)} aria-hidden>
      <path d={swag} fill="none" stroke="#4F5B3A" strokeWidth="1.2" />
      {list.map((s) => {
        const buds = Math.floor(s.length / BUD_GAP);
        const endY = 6 + buds * BUD_GAP;
        return (
          <g key={s.x}>
            <path d={`M${s.x} 6 V${endY}`} stroke="#4F5B3A" strokeOpacity="0.6" strokeWidth="0.7" />
            {Array.from({ length: buds }, (_, b) => (
              <ellipse key={b} cx={s.x} cy={10 + b * BUD_GAP} rx="2.5" ry="3.4" fill="#FBF8F1" stroke="#D9CFB8" strokeWidth="0.5" />
            ))}
            {/* Kuncup penutup dengan kelopak hijau */}
            <path d={`M${s.x - 3} ${endY + 2} Q${s.x} ${endY + 10} ${s.x + 3} ${endY + 2}`} fill="#4F5B3A" />
            <ellipse cx={s.x} cy={endY + 9} rx="3.2" ry="4.4" fill="#FBF8F1" stroke="#D9CFB8" strokeWidth="0.5" />
          </g>
        );
      })}
    </svg>
  );
}
