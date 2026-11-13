/** Kisah pasangan sebagai jalur pendakian: tiap bab adalah satu pos, bab terakhir adalah puncak. */

export interface Checkpoint {
  label: string;
  elevation: number;
  isSummit: boolean;
}

export interface TrailSpec {
  /** Ketinggian basecamp (mdpl). */
  base: number;
  /** Ketinggian puncak (mdpl). */
  summit: number;
  summitName: string;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function trailCheckpoints(count: number, { base, summit, summitName }: TrailSpec): Checkpoint[] {
  const n = Math.max(0, Math.floor(count));
  if (n === 0) return [];
  if (n === 1) return [{ label: summitName, elevation: summit, isSummit: true }];
  return Array.from({ length: n }, (_, i) => {
    const isSummit = i === n - 1;
    const label = i === 0 ? "Basecamp" : isSummit ? summitName : `Pos ${i}`;
    const raw = base + (summit - base) * (i / (n - 1));
    const elevation = i === 0 ? base : isSummit ? summit : Math.round(raw / 10) * 10;
    return { label, elevation, isSummit };
  });
}

/** Ketinggian (dibulatkan) pada progres 0–1 sepanjang jalur. */
export function altitudeAt(progress: number, base: number, summit: number): number {
  return Math.round(base + (summit - base) * clamp01(progress));
}
