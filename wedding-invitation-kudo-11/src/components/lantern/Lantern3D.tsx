import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { LANTERN_PALETTE, lanternGeometry, type LanternVariant } from "@/lib/lanterns";

interface Lantern3DProps {
  /** Lebar lampion di bagian atas (px). */
  size?: number;
  variant?: LanternVariant;
  /** Lama satu putaran (detik). 0 = diam dengan sudut tetap. */
  spin?: number;
  /** Kemiringan kamera (derajat) — negatif = sedikit dilihat dari bawah. */
  tilt?: number;
  /** Teks kecil (mis. monogram) yang tercetak di dua sisi lampion. */
  label?: string;
  /** Tampilkan pendar cahaya di sekeliling lampion. */
  glow?: boolean;
  /** Versi datar 2D — jauh lebih ringan untuk lampion latar yang kecil & buram. */
  flat?: boolean;
  sides?: number;
  className?: string;
  style?: CSSProperties;
}

const HEIGHT_RATIO = 1.3;

function faceBackground(variant: LanternVariant): string {
  const p = LANTERN_PALETTE[variant];
  return [
    // tepi sisi sedikit gelap (rangka bambu)
    "linear-gradient(to right, rgba(80,22,6,0.4), transparent 10%, transparent 90%, rgba(80,22,6,0.4))",
    // rusuk horizontal kertas
    "repeating-linear-gradient(to bottom, transparent 0 22%, rgba(110,35,10,0.16) 22% 23%)",
    // api di dalam menerangi bagian bawah
    "radial-gradient(ellipse 75% 55% at 50% 88%, rgba(255,246,214,0.9), transparent 70%)",
    `linear-gradient(to bottom, ${p.top} 0%, ${p.mid} 55%, ${p.bottom} 100%)`,
  ].join(",");
}

/**
 * Lampion langit 3D dari CSS murni: prisma terpancung bersisi enam yang berputar
 * pelan, dengan api berkedip di mulut bawah dan pendar hangat di sekelilingnya.
 * Geometri sisi dihitung di `lanternGeometry()` agar tepi-tepinya bertemu rapat.
 */
export function Lantern3D({
  size = 64,
  variant = "amber",
  spin = 16,
  tilt = -10,
  label,
  glow = true,
  flat = false,
  sides = 6,
  className,
  style,
}: Lantern3DProps) {
  const height = Math.round(size * HEIGHT_RATIO);
  const palette = LANTERN_PALETTE[variant];
  const geo = lanternGeometry(size, height, 0.7, sides);
  const background = faceBackground(variant);
  const labelFaces = new Set([0, Math.floor(geo.sides / 2)]);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative select-none", className)}
      style={{ width: size, height: height + size * 0.2, ...style }}
    >
      {glow && (
        <span
          className="animate-halo absolute left-1/2 top-[55%] rounded-full"
          style={{
            width: size * 2.8,
            height: size * 2.8,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${palette.glow} 0%, transparent 65%)`,
          }}
        />
      )}

      {flat ? (
        <div
          className="absolute inset-x-0 top-0"
          style={{ height, clipPath: geo.clipPath, background, borderRadius: `${size * 0.12}px ${size * 0.12}px 0 0` }}
        />
      ) : (
        <div className="absolute inset-x-0 top-0" style={{ height, perspective: size * 7 }}>
          <div
            className={cn("preserve-3d relative h-full w-full", spin > 0 && "animate-lantern-spin")}
            style={
              {
                "--spin": `${spin}s`,
                "--lantern-tilt": `${tilt}deg`,
                transform: spin > 0 ? undefined : `rotateX(${tilt}deg) rotateY(18deg)`,
              } as CSSProperties
            }
          >
            {geo.faces.map((face, i) => (
              <div
                key={face.angle}
                className="absolute flex items-center justify-center"
                style={{
                  left: (size - geo.faceWidth) / 2,
                  top: (height - geo.faceHeight) / 2,
                  width: geo.faceWidth,
                  height: geo.faceHeight,
                  clipPath: geo.clipPath,
                  background,
                  filter: i % 2 ? "brightness(0.9)" : undefined,
                  transform: `rotateY(${face.angle}deg) translateZ(${geo.translateZ}px) rotateX(${-geo.tilt}deg)`,
                }}
              >
                {label && labelFaces.has(i) && (
                  <span
                    className="font-serif font-bold leading-none tracking-wide"
                    style={{ fontSize: Math.max(8, size * 0.26), color: "rgba(110,30,8,0.72)" }}
                  >
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Api kecil di mulut bawah lampion */}
      <span
        className="animate-flame absolute left-1/2 rounded-full"
        style={{
          top: height * 0.86,
          width: Math.max(4, size * 0.16),
          height: Math.max(6, size * 0.24),
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 70%, #FFFFFF 0%, #FFE9A8 35%, rgba(248,178,58,0.85) 60%, transparent 75%)",
          filter: `drop-shadow(0 0 ${Math.max(3, size * 0.1)}px rgba(255, 200, 90, 0.9))`,
        }}
      />
    </div>
  );
}
