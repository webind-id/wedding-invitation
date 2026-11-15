"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface RusticBotanical3DProps {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Tingkat kemiringan dasar (derajat) */
  tilt?: number;
  /** Jarak kedalaman Z antar lapisan dalam pixel */
  depth?: number;
}

/**
 * Ornamen Botanikal 3D Berlapis (Rustic 3D Botanical Layer):
 * Memiliki beberapa bidang Z bertingkat (terakota, dedaunan zaitun, dan rumput pampas)
 * yang menghasilkan efek paralaks stereoskopik mendalam saat dimiringkan (3D Tilt).
 */
export function RusticBotanical3D({
  size = 180,
  className,
  style,
  tilt = 15,
  depth = 12,
}: RusticBotanical3DProps) {
  const dimension = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      aria-hidden
      className={cn("preserve-3d pointer-events-none relative select-none", className)}
      style={
        {
          width: dimension,
          height: dimension,
          transform: `rotateX(${tilt}deg)`,
          ...style,
        } as CSSProperties
      }
    >
      {/* ── Lapisan 1: Daun Palem Kering Terakota (Bidang Z: -depth) ──────── */}
      <div
        className="preserve-3d absolute inset-0"
        style={{ transform: `translateZ(-${depth}px)` }}
      >
        <svg
          viewBox="0 0 100 120"
          className="h-full w-full overflow-visible drop-shadow-[0_8px_12px_rgba(43,35,29,0.18)]"
        >
          <g transform="translate(50, 110)">
            {/* Tangkai */}
            <path d="M0,0 Q-2,-30 0,-60" fill="none" stroke="#98442B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Kipas Daun Palem Runcing Terakota */}
            {[-45, -30, -15, 0, 15, 30, 45].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 0 -60)`}>
                <path
                  d="M0,-60 C-6,-75 -4,-98 0,-108 C4,-98 6,-75 0,-60 Z"
                  fill="#C86D51"
                  opacity={0.85 + (i % 2) * 0.1}
                />
                <path d="M0,-60 L0,-106" stroke="#FAF6F0" strokeWidth="0.8" opacity={0.4} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* ── Lapisan 2: Ranting Eukaliptus Zaitun (Bidang Z: +depth / 2) ───── */}
      <div
        className="preserve-3d absolute inset-0"
        style={{ transform: `translateZ(${Math.round(depth / 2)}px)` }}
      >
        <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible">
          <g transform="translate(48, 110)">
            {/* Batang melengkung lembut */}
            <path d="M0,0 Q12,-35 -5,-80" fill="none" stroke="#414E36" strokeWidth="1.8" strokeLinecap="round" />
            {/* Daun bulat elips zaitun sage */}
            {[
              { x: -6, y: -25, r: 8, rot: -28 },
              { x: 8, y: -38, r: 9, rot: 32 },
              { x: -8, y: -52, r: 8.5, rot: -34 },
              { x: 7, y: -64, r: 7.5, rot: 30 },
              { x: -3, y: -76, r: 6.5, rot: -15 },
            ].map((leaf, idx) => (
              <ellipse
                key={idx}
                cx={leaf.x}
                cy={leaf.y}
                rx={leaf.r}
                ry={leaf.r * 1.3}
                transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
                fill="#6B7A5C"
                opacity={0.9}
                className="drop-shadow-[0_4px_6px_rgba(43,35,29,0.12)]"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ── Lapisan 3: Rumput Pampas Halus Lembut (Bidang Z: +depth) ───────── */}
      <div
        className="preserve-3d absolute inset-0"
        style={{ transform: `translateZ(${depth}px)` }}
      >
        <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible">
          <g transform="translate(54, 110)">
            {/* Batang pampas */}
            <path d="M0,0 Q-8,-40 8,-90" fill="none" stroke="#C59B58" strokeWidth="1.6" strokeLinecap="round" />
            {/* Serat bulu pampas lembut */}
            {[
              { y: -35, len: 14, rot: 25 },
              { y: -45, len: 18, rot: -30 },
              { y: -55, len: 22, rot: 28 },
              { y: -65, len: 20, rot: -26 },
              { y: -75, len: 16, rot: 22 },
              { y: -85, len: 12, rot: -18 },
            ].map((plume, pIdx) => (
              <path
                key={pIdx}
                d={`M0,${plume.y} Q${plume.rot > 0 ? 8 : -8},${plume.y - 6} ${plume.rot > 0 ? plume.len : -plume.len},${plume.y - 12}`}
                fill="none"
                stroke="#D4A373"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={0.8}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
