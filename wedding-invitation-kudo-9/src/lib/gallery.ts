import type { Moment } from "@/shared/contract";

export interface Tile {
  /** Kelas grid span. */
  span: string;
  /** Kelas bingkai foto. */
  frame: string;
}

/**
 * Bento: bentuk ubin mengikuti bentuk foto dari admin.
 *   tall   → 1×2, bingkai kapsul tegak
 *   wide   → 2×1, bingkai pil
 *   square → 2×2 untuk foto persegi pertama & tiap persegi ke-4, selain itu 1×1
 * Baris berukuran tetap + grid-flow dense, jadi celah terisi otomatis.
 */
export function tileFor(moments: Moment[], index: number): Tile {
  const shape = moments[index].shape;
  if (shape === "tall") return { span: "row-span-2", frame: "capsule" };
  if (shape === "wide") return { span: "col-span-2", frame: "rounded-full" };
  const squareRank = moments.slice(0, index).filter((m) => m.shape === "square").length;
  return squareRank % 4 === 0 ? { span: "col-span-2 row-span-2", frame: "rounded-[2.25rem]" } : { span: "", frame: "rounded-[1.75rem]" };
}

