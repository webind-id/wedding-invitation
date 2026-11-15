import { cn } from "@/lib/cn";

interface EucalyptusStemProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  mirror?: boolean;
}

/**
 * Tangkai Daun Eukaliptus Kering (Silver Dollar / Dried Eucalyptus)
 * Elemen botani hijau olive yang lembut & romantis.
 */
export function EucalyptusStem({
  className,
  size = 110,
  color = "#6B7A5C",
  opacity = 0.85,
  mirror = false,
}: EucalyptusStemProps) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 80 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", mirror && "-scale-x-100", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Batang Utama Melengkung Alami */}
      <path
        d="M38 108 C39 85 41 55 42 12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Daun Bulat Khas Eukaliptus Berpasangan Bertingkat */}
      {/* Tingkat 1 (Paling Bawah) */}
      <ellipse
        cx="25"
        cy="92"
        rx="14"
        ry="9"
        transform="rotate(-25 25 92)"
        fill={color}
        fillOpacity="0.75"
        stroke={color}
        strokeWidth="0.8"
      />
      <ellipse
        cx="53"
        cy="88"
        rx="14"
        ry="9"
        transform="rotate(22 53 88)"
        fill={color}
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Tingkat 2 */}
      <ellipse
        cx="23"
        cy="70"
        rx="13"
        ry="8.5"
        transform="rotate(-20 23 70)"
        fill={color}
        fillOpacity="0.8"
        stroke={color}
        strokeWidth="0.8"
      />
      <ellipse
        cx="56"
        cy="66"
        rx="13"
        ry="8.5"
        transform="rotate(18 56 66)"
        fill={color}
        fillOpacity="0.7"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Tingkat 3 */}
      <ellipse
        cx="26"
        cy="48"
        rx="12"
        ry="8"
        transform="rotate(-15 26 48)"
        fill={color}
        fillOpacity="0.7"
        stroke={color}
        strokeWidth="0.8"
      />
      <ellipse
        cx="55"
        cy="45"
        rx="12"
        ry="8"
        transform="rotate(16 55 45)"
        fill={color}
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Tingkat 4 (Atas) */}
      <ellipse
        cx="30"
        cy="28"
        rx="10"
        ry="6.5"
        transform="rotate(-10 30 28)"
        fill={color}
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="0.8"
      />
      <ellipse
        cx="52"
        cy="26"
        rx="10"
        ry="6.5"
        transform="rotate(12 52 26)"
        fill={color}
        fillOpacity="0.75"
        stroke={color}
        strokeWidth="0.8"
      />

      {/* Kuncup Pucuk */}
      <ellipse
        cx="41"
        cy="12"
        rx="7"
        ry="5"
        transform="rotate(5 41 12)"
        fill={color}
        fillOpacity="0.9"
      />
    </svg>
  );
}
