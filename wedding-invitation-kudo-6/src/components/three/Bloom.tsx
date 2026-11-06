import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { bloomRings, LEAF_PATH, PALETTES, PETAL_PATH, PETAL_SHEEN, type BloomPalette } from "@/lib/bloom";

interface BloomProps {
  palette?: BloomPalette;
  /** Lebar & tinggi bunga (CSS), mis. "14rem" atau "clamp(8rem,20vw,16rem)". */
  size: string;
  rings?: number;
  seed?: number;
  /** Jumlah daun pearl di belakang kelopak. */
  leaves?: number;
  /** Kemiringan dasar (derajat) — makin besar makin terlihat kedalaman cincinnya. */
  tilt?: number;
  /** Kelopak mekar mengikuti scroll (lihat data-bloom-open di useScrollScene). */
  opensOnScroll?: boolean;
  className?: string;
}

/**
 * Bunga sculptural 3D: tiap cincin kelopak adalah lapisan SVG di kedalaman berbeda
 * (translateZ), sehingga terasa berlapis saat dimiringkan oleh kursor atau scroll.
 * Dekoratif — disembunyikan dari pembaca layar.
 */
export function Bloom({ palette = "blush", size, rings = 5, seed = 0, leaves = 0, tilt = 28, opensOnScroll = false, className }: BloomProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const specs = bloomRings(palette, rings, seed);
  const center = PALETTES.champagne[1];

  return (
    <div
      aria-hidden
      data-bloom-open={opensOnScroll ? "" : undefined}
      className={cn("bloom pointer-events-none relative", className)}
      style={{ width: size, height: size, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          {specs.map((r) => (
            <radialGradient key={r.index} id={`${uid}-p${r.index}`} cx="0.5" cy="1" r="1.05">
              <stop offset="0" stopColor={r.base} />
              <stop offset="0.75" stopColor={r.edge} />
              <stop offset="1" stopColor="#FFFFFF" />
            </radialGradient>
          ))}
          <linearGradient id={`${uid}-sheen`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#D2C7B7" />
            <stop offset="1" stopColor="#F5EFE6" />
          </linearGradient>
          <radialGradient id={`${uid}-heart`}>
            <stop offset="0" stopColor="#FFF8EC" />
            <stop offset="1" stopColor={center[1]} />
          </radialGradient>
        </defs>
      </svg>

      {leaves > 0 && (
        <svg viewBox="-100 -100 200 200" className="bloom-ring" style={{ "--i": -1, "--s": 1.25 } as CSSProperties}>
          {Array.from({ length: leaves }, (_, k) => (
            <path key={k} d={LEAF_PATH} fill={`url(#${uid}-leaf)`} stroke="rgba(57,49,47,0.08)" strokeWidth="0.6" transform={`rotate(${200 + seed * 13 + k * (140 / leaves)})`} />
          ))}
        </svg>
      )}

      {specs.map((r) => (
        <svg key={r.index} viewBox="-100 -100 200 200" className="bloom-ring" style={{ "--i": r.index, "--s": r.scale } as CSSProperties}>
          {r.angles.map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d={PETAL_PATH} fill={`url(#${uid}-p${r.index})`} stroke="rgba(57,49,47,0.07)" strokeWidth="0.6" transform="scale(1.18)" />
              <path d={PETAL_SHEEN} fill={`url(#${uid}-sheen)`} opacity="0.55" transform="scale(1.18)" />
            </g>
          ))}
        </svg>
      ))}

      {/* Putik: lingkaran kecil champagne, sedikit lebih dekat ke kamera. */}
      <svg viewBox="-100 -100 200 200" className="bloom-ring" style={{ "--i": specs.length + 0.5, "--s": 0.22 } as CSSProperties}>
        <circle r="34" fill={`url(#${uid}-heart)`} />
        {Array.from({ length: 9 }, (_, k) => (
          <circle key={k} r="6" cx={Math.round(Math.cos((k * 2 * Math.PI) / 9) * 2000) / 100} cy={Math.round(Math.sin((k * 2 * Math.PI) / 9) * 2000) / 100} fill={center[1]} opacity="0.85" />
        ))}
      </svg>
    </div>
  );
}
