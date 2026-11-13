import { useId } from "react";
import { cn } from "@/lib/cn";
import { GUNUNGAN_WIDTH, gununganOutline, treeOfLife } from "@/lib/gunungan";

/** Bidang termasuk gapit (tangkai tanduk) di bawah alas. */
const VIEW_HEIGHT = 360;
const VIEWBOX = `0 0 ${GUNUNGAN_WIDTH} ${VIEW_HEIGHT}`;
/** Jumlah lapisan tepi — ketebalan kulit saat gunungan diputar. */
const EDGE_LAYERS = 5;
const OUTLINE = gununganOutline();
const TREE = treeOfLife(6);
/** Bidang dalam (isian bata) = garis luar diperkecil di sekitar pusat badan. */
const INNER = "translate(100 172) scale(0.84) translate(-100 -172)";
const INNER_RIM = "translate(100 172) scale(0.92) translate(-100 -172)";
const TUMPAL_X = Array.from({ length: 8 }, (_, i) => 54 + i * 12);

interface GununganProps {
  /** Lebar CSS (tinggi mengikuti proporsi). */
  size: string;
  className?: string;
  /** Tampilkan gapit di bawah alas. */
  hasGapit?: boolean;
}

function Gapit({ color }: { color: string }) {
  return <path d="M97 294 L103 294 L101.6 358 L98.4 358Z" fill={color} />;
}

/** Muka depan: tepi prada, bidang bata, pohon hayat, gapura, dan tumpal di alas. */
function Front({ uid, hasGapit }: { uid: string; hasGapit: boolean }) {
  return (
    <svg viewBox={VIEWBOX} className="gunungan-layer backface-hidden" style={{ ["--i" as string]: 0 }} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E6CD97" />
          <stop offset="0.5" stopColor="#B8914E" />
          <stop offset="1" stopColor="#8A6630" />
        </linearGradient>
        <radialGradient id={`${uid}-field`} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#A8503A" />
          <stop offset="0.6" stopColor="#8E3B2A" />
          <stop offset="1" stopColor="#5C2418" />
        </radialGradient>
      </defs>

      {hasGapit && <Gapit color="#4A2C17" />}
      <path d={OUTLINE} fill={`url(#${uid}-rim)`} />
      <path d={OUTLINE} transform={INNER_RIM} fill="none" stroke="#5A3417" strokeOpacity="0.55" strokeWidth="1" />
      <path d={OUTLINE} transform={INNER} fill={`url(#${uid}-field)`} />
      {/* Cecek — titik-titik tatahan khas wayang kulit di sepanjang tepi bidang. */}
      <path d={OUTLINE} transform={INNER} fill="none" stroke="#E6CD97" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0 5.4" />

      {/* Pohon hayat */}
      <g fill="none" stroke="#DCC08A" strokeWidth="2" strokeLinecap="round">
        {TREE.branches.map((b, i) => (
          <path key={i} d={b.d} />
        ))}
      </g>
      <path d={TREE.trunk} fill="#DCC08A" />
      {TREE.branches.map((b, i) => (
        <g key={i}>
          <ellipse cx={b.leaf.cx} cy={b.leaf.cy} rx={b.leaf.rx} ry={b.leaf.ry} transform={`rotate(${b.leaf.rotate} ${b.leaf.cx} ${b.leaf.cy})`} fill="#4F5B3A" stroke="#DCC08A" strokeWidth="0.6" />
          <circle cx={b.bud.cx} cy={b.bud.cy} r={b.bud.r} fill="#2E4756" stroke="#E6CD97" strokeWidth="0.8" />
        </g>
      ))}
      <circle cx={TREE.crown.cx} cy={TREE.crown.cy} r={TREE.crown.r} fill="#E6CD97" stroke="#8A6630" strokeWidth="0.8" />

      {/* Gapura di kaki pohon */}
      <g stroke="#E6CD97" strokeWidth="0.9">
        <path d="M86 219 L114 219 L106 211 L94 211Z" fill="#3E2615" />
        <path d="M76 227 L124 227 L116 219 L84 219Z" fill="#3E2615" />
        <rect x="80" y="227" width="40" height="22" fill="#6E4426" />
        <rect x="88" y="231" width="11" height="18" fill="#2B1D14" />
        <rect x="101" y="231" width="11" height="18" fill="#2B1D14" />
        <rect x="72" y="249" width="56" height="7" fill="#3E2615" />
      </g>
      <circle cx="100" cy="208" r="2.4" fill="#E6CD97" />

      {/* Tumpal (deret segitiga) pada alas */}
      <g fill="#3E2615" fillOpacity="0.55">
        {TUMPAL_X.map((x) => (
          <path key={x} d={`M${x} 292 L${x + 6} 277 L${x + 12} 292Z`} />
        ))}
      </g>
    </svg>
  );
}

/** Muka belakang: kulit sogan polos dengan bekas tatahan yang samar. */
function Back({ hasGapit }: { hasGapit: boolean }) {
  return (
    <svg
      viewBox={VIEWBOX}
      className="gunungan-layer backface-hidden"
      style={{ transform: `translateZ(${-EDGE_LAYERS * 0.9}px) rotateY(180deg)` }}
      aria-hidden
    >
      {hasGapit && <Gapit color="#4A2C17" />}
      <path d={OUTLINE} fill="#6E4426" />
      <path d={OUTLINE} transform={INNER} fill="none" stroke="#A9784A" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0 5.4" />
      <g fill="none" stroke="#8A5A35" strokeWidth="1.8" strokeLinecap="round">
        {TREE.branches.map((b, i) => (
          <path key={i} d={b.d} />
        ))}
      </g>
      <path d={TREE.trunk} fill="#8A5A35" />
    </svg>
  );
}

/**
 * Gunungan (kayon) wayang kulit dalam CSS 3D — bukan WebGL.
 * Muka depan + {EDGE_LAYERS} lapisan tepi bertumpuk di sumbu Z + muka belakang,
 * sehingga saat diputar (rotateY) terlihat tebal seperti kulit tatah sungguhan.
 * Pembungkus di atasnya yang memegang transform (GSAP / data-*).
 */
export function Gunungan({ size, className, hasGapit = true }: GununganProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className={cn("preserve-3d relative", className)} style={{ width: size, aspectRatio: `${GUNUNGAN_WIDTH} / ${VIEW_HEIGHT}` }}>
      {Array.from({ length: EDGE_LAYERS }, (_, i) => (
        <svg key={i} viewBox={VIEWBOX} className="gunungan-layer" style={{ ["--i" as string]: i + 1 }} aria-hidden>
          <path d={OUTLINE} fill={i === EDGE_LAYERS - 1 ? "#2B1D14" : "#4A2C17"} />
        </svg>
      ))}
      <Back hasGapit={hasGapit} />
      <Front uid={uid} hasGapit={hasGapit} />
    </div>
  );
}
