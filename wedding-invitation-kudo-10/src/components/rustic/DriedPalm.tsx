import { cn } from "@/lib/cn";

interface DriedPalmProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  mirror?: boolean;
}

/**
 * Ilustrasi SVG Daun Palem Kering (Sun Palm Spear)
 * Ciri khas utama dekorasi rustic bohemian untuk outdoor & garden wedding.
 */
export function DriedPalm({
  className,
  size = 120,
  color = "#C86D51",
  opacity = 0.85,
  mirror = false,
}: DriedPalmProps) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", mirror && "-scale-x-100", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Batang Bawah */}
      <path
        d="M50 128 L50 82"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Sirip Daun Palem Kering Berbentuk Kipas / Palm Spear */}
      {/* Sirip Tengah */}
      <path
        d="M50 85 C49 50 49 20 50 8 C51 20 51 50 50 85 Z"
        fill={color}
        fillOpacity="0.8"
      />
      {/* Lipatan Bilah Kiri */}
      <path
        d="M50 85 C46 55 42 28 38 18 C44 26 47 48 50 85 Z"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        d="M50 85 C42 60 34 38 28 30 C36 38 43 58 50 85 Z"
        fill={color}
        fillOpacity="0.7"
      />
      <path
        d="M50 85 C38 65 26 48 18 44 C26 52 38 68 50 85 Z"
        fill={color}
        fillOpacity="0.45"
      />
      <path
        d="M50 85 C34 70 20 58 10 58 C18 64 32 74 50 85 Z"
        fill={color}
        fillOpacity="0.65"
      />

      {/* Lipatan Bilah Kanan */}
      <path
        d="M50 85 C54 55 58 28 62 18 C56 26 53 48 50 85 Z"
        fill={color}
        fillOpacity="0.6"
      />
      <path
        d="M50 85 C58 60 66 38 72 30 C64 38 57 58 50 85 Z"
        fill={color}
        fillOpacity="0.75"
      />
      <path
        d="M50 85 C62 65 74 48 82 44 C74 52 62 68 50 85 Z"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        d="M50 85 C66 70 80 58 90 58 C82 64 68 74 50 85 Z"
        fill={color}
        fillOpacity="0.6"
      />

      {/* Garis Urat Daun Halus */}
      <path
        d="M50 85 L50 10 M50 85 L38 20 M50 85 L62 20 M50 85 L28 32 M50 85 L72 32 M50 85 L18 46 M50 85 L82 46 M50 85 L10 60 M50 85 L90 60"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
