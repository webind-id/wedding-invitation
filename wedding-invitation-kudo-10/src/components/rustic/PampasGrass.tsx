import { cn } from "@/lib/cn";

interface PampasGrassProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  mirror?: boolean;
}

/**
 * Ilustrasi SVG Rumput Pampas Kering (Dried Pampas Grass)
 * Siluet bulu-bulu lembut hangat khas dekorasi bohemian pernikahan outdoor.
 */
export function PampasGrass({
  className,
  size = 100,
  color = "#D4A373",
  opacity = 0.8,
  mirror = false,
}: PampasGrassProps) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 70 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", mirror && "-scale-x-100", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Batang Utama */}
      <path
        d="M30 118 C33 90 35 60 40 10"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Bulir-bulir Pampas Bertebaran Mengembang */}
      {/* Kiri */}
      <path d="M37 70 C25 65 14 55 10 40" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />
      <path d="M38 60 C26 55 18 45 12 32" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
      <path d="M39 50 C28 44 20 34 16 22" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M39 40 C30 33 24 24 22 14" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />

      {/* Kanan */}
      <path d="M37 75 C48 70 58 62 62 50" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M38 65 C50 58 60 50 63 36" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M39 54 C51 46 58 36 60 25" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
      <path d="M40 42 C49 34 54 26 55 16" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.75" />

      {/* Ranting Bulu Halus (Feather Tuft Effect) */}
      <path
        d="M38 30 C32 18 36 10 40 8 C44 10 46 18 42 30 Z"
        fill={color}
        fillOpacity="0.35"
      />
      <path
        d="M35 55 C24 45 28 32 37 38 C42 42 45 52 35 55 Z"
        fill={color}
        fillOpacity="0.25"
      />
      <path
        d="M40 60 C52 50 48 35 41 42 C38 46 36 55 40 60 Z"
        fill={color}
        fillOpacity="0.3"
      />
    </svg>
  );
}
