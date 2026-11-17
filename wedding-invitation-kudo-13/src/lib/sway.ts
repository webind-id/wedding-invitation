import type { CSSProperties } from "react";

/**
 * Waktu goyang pohon yang deterministik (dari seed): tiap pohon/pelepah mulai di titik siklus
 * berbeda (delay negatif) dengan durasi sedikit berbeda, agar tidak bergerak serempak. Tanpa
 * Math.random → server & browser menghasilkan style yang sama (tanpa hydration mismatch).
 */
export function swayTiming(seed: number, index: number, baseSeconds: number, spreadSeconds = 0): { delay: number; duration: number } {
  const a = fraction(seed * 9301 + index * 49297 + 233);
  const b = fraction(seed * 7919 + index * 104729 + 17);
  return { delay: -round1(a * baseSeconds), duration: round1(baseSeconds + b * spreadSeconds) };
}

/** Style untuk elemen ber-kelas sway-*: titik putar (koordinat viewBox) + waktu animasi. */
export function swayStyle(origin: { x: number; y: number }, timing: { delay: number; duration: number }): CSSProperties {
  return {
    transformOrigin: `${origin.x}px ${origin.y}px`,
    ["--sway-delay" as string]: `${timing.delay}s`,
    ["--sway-dur" as string]: `${timing.duration}s`,
  };
}

function fraction(n: number): number {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
