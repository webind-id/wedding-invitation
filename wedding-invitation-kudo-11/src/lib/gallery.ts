import type { Moment } from "@/shared/contract";

export interface Tile {
  span: string;
  frame: string;
}

/**
 * Pemetaan ubin galeri bento piksel:
 * - tall: row-span-2
 * - wide: col-span-2
 * - square: tiap persegi ke-4 berukuran 2x2, lainnya 1x1
 */
export function tileFor(moments: Moment[], index: number): Tile {
  const shape = moments[index]?.shape;
  if (shape === "tall") return { span: "row-span-2", frame: "border-2 border-ink shadow-pixel" };
  if (shape === "wide") return { span: "col-span-2", frame: "border-2 border-ink shadow-pixel" };
  const squareRank = moments.slice(0, index).filter((m) => m.shape === "square").length;
  return squareRank % 4 === 0
    ? { span: "col-span-2 row-span-2", frame: "border-2 border-ink shadow-pixel-lg" }
    : { span: "", frame: "border-2 border-ink shadow-pixel" };
}
