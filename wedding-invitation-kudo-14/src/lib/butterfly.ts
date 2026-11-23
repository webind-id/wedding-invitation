/**
 * Jalur terbang kupu-kupu: titik-titik tujuan acak di dalam satu area, arah hadap, dan lama
 * terbang. Murni & deterministik (seed yang sama → jalur yang sama), jadi mudah diuji dan
 * posisi awal sama di server maupun browser.
 */

/** PRNG mulberry32 — cepat dan cukup acak untuk dekorasi. */
export function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Point {
  x: number;
  y: number;
}

/** Area terbang dalam pecahan lebar/tinggi wadah (0–1). */
export interface FlightArea {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** Lompatan terdekat & terjauh antartitik, dalam pecahan lebar wadah — agar tidak bergetar di tempat atau melesat. */
const MIN_HOP = 0.12;
const MAX_HOP = 0.42;
/** Kecepatan terbang (px/detik) dan batas lama satu lintasan. */
const SPEED = 70;
const MIN_LEG_S = 1.4;
const MAX_LEG_S = 4.2;
const MAX_TRIES = 12;

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Titik awal (pecahan 0–1) di dalam area, dari seed. */
export function startPoint(seed: number, area: FlightArea): Point {
  const r = seededRandom(seed);
  return { x: round1Frac(area.x0 + r() * (area.x1 - area.x0)), y: round1Frac(area.y0 + r() * (area.y1 - area.y0)) };
}

/**
 * Titik tujuan berikutnya (pecahan 0–1): acak di dalam area, tetapi tidak terlalu dekat atau
 * terlalu jauh dari posisi sekarang. Bila tak ada titik yang memenuhi setelah beberapa percobaan
 * (area sempit), titik acak terakhir dipakai — tetap di dalam area.
 */
export function nextPoint(rand: () => number, from: Point, area: FlightArea): Point {
  let candidate = from;
  for (let i = 0; i < MAX_TRIES; i++) {
    candidate = { x: area.x0 + rand() * (area.x1 - area.x0), y: area.y0 + rand() * (area.y1 - area.y0) };
    const hop = Math.hypot(candidate.x - from.x, candidate.y - from.y);
    if (hop >= MIN_HOP && hop <= MAX_HOP) break;
  }
  return { x: round1Frac(candidate.x), y: round1Frac(candidate.y) };
}

/**
 * Sudut putar (derajat) agar kepala kupu-kupu menghadap arah terbang. Gambar kupu-kupu
 * menghadap ke atas, jadi terbang ke kanan = 90°, ke bawah = 180°, ke kiri = -90°.
 */
export function headingDeg(from: Point, to: Point): number {
  if (from.x === to.x && from.y === to.y) return 0;
  return round1((Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90);
}

/** Lama satu lintasan (detik) dari jarak dalam piksel, dibatasi agar tidak terlalu cepat atau lambat. */
export function legSeconds(distancePx: number): number {
  return round1(clamp(distancePx / SPEED, MIN_LEG_S, MAX_LEG_S));
}

function round1Frac(n: number): number {
  return Math.round(n * 1000) / 1000;
}
