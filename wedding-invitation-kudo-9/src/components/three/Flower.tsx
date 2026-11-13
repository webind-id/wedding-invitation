import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { FLOWERS, flowerRings, PAD_PATH, seedPod, type FloraPalette, type FlowerKind } from "@/lib/flora";

interface FlowerProps {
  kind?: FlowerKind;
  palette?: FloraPalette;
  /** Lebar & tinggi bunga (CSS), mis. "14rem" atau "clamp(8rem,20vw,16rem)". */
  size: string;
  rings?: number;
  seed?: number;
  /** Daun teratai di bawah kelopak (lapisan paling belakang). */
  pad?: boolean;
  /** Kemiringan dasar (derajat) — makin besar makin terlihat kedalaman cincinnya. */
  tilt?: number;
  /** Kelopak mekar mengikuti scroll (lihat data-bloom-open di useScrollScene). */
  opensOnScroll?: boolean;
  className?: string;
}

/**
 * Bunga 3D (teratai atau dahlia): tiap cincin kelopak adalah lapisan SVG di kedalaman
 * berbeda (translateZ), jadi terasa bertumpuk seperti cawan saat dimiringkan.
 * Dekoratif — disembunyikan dari pembaca layar.
 */
export function Flower({ kind = "lotus", palette = "lilac", size, rings = 5, seed = 0, pad = false, tilt = 34, opensOnScroll = false, className }: FlowerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shape = FLOWERS[kind];
  const specs = flowerRings(kind, palette, rings, seed);
  const isLotus = kind === "lotus";

  return (
    <div
      aria-hidden
      data-bloom-open={opensOnScroll ? "" : undefined}
      className={cn("flower pointer-events-none relative", className)}
      style={{ width: size, height: size, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          {specs.map((r) => (
            // Teratai: pangkal pucat → ujung berwarna. Dahlia: sebaliknya, pangkal lebih pekat.
            <linearGradient key={r.index} id={`${uid}-p${r.index}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={isLotus ? r.base : r.tip} />
              <stop offset="0.6" stopColor={r.base} />
              <stop offset="1" stopColor={isLotus ? r.tip : "#FFFFFF"} />
            </linearGradient>
          ))}
          <linearGradient id={`${uid}-pad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C4D2C1" />
            <stop offset="1" stopColor="#8DA28B" />
          </linearGradient>
          <radialGradient id={`${uid}-heart`}>
            <stop offset="0" stopColor="#FCE7C9" />
            <stop offset="1" stopColor="#E9B48A" />
          </radialGradient>
        </defs>
      </svg>

      {pad && (
        <svg viewBox="-100 -100 200 200" className="flower-ring" style={{ "--i": -1.5, "--s": 1.3 } as CSSProperties}>
          <g transform={`rotate(${160 + seed * 23})`}>
            <path d={PAD_PATH} fill={`url(#${uid}-pad)`} stroke="rgba(46,39,51,0.08)" strokeWidth="0.8" />
            {Array.from({ length: 9 }, (_, k) => (
              <path key={k} d={`M0 0 L0 -88`} stroke="rgba(255,255,255,0.35)" strokeWidth="1" transform={`rotate(${20 + k * 36})`} />
            ))}
          </g>
        </svg>
      )}

      {specs.map((r) => (
        <svg key={r.index} viewBox="-100 -100 200 200" className="flower-ring" style={{ "--i": r.index, "--s": r.scale } as CSSProperties}>
          {r.angles.map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d={shape.petal} fill={`url(#${uid}-p${r.index})`} stroke="rgba(46,39,51,0.08)" strokeWidth="0.6" transform="scale(1.1)" />
              <path d={shape.vein} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" transform="scale(1.1)" />
            </g>
          ))}
        </svg>
      ))}

      {/* Putik: bakal biji teratai (aprikot bertitik) atau cakram kecil dahlia, sedikit lebih dekat ke kamera. */}
      <svg viewBox="-100 -100 200 200" className="flower-ring" style={{ "--i": specs.length + 0.6, "--s": isLotus ? 0.26 : 0.18 } as CSSProperties}>
        <circle r="36" fill={`url(#${uid}-heart)`} stroke="rgba(197,126,85,0.35)" strokeWidth="1.5" />
        {isLotus && seedPod(7, 18).map((d, k) => <circle key={k} cx={d.x} cy={d.y} r="5" fill="#C57E55" opacity="0.7" />)}
        {isLotus && <circle r="5" fill="#C57E55" opacity="0.7" />}
      </svg>
    </div>
  );
}
