/**
 * Geometri piksel & koordinat voxel untuk elemen 3D CSS & SVG (Piksel Asmara / kudo-10).
 * Fungsi murni, deterministik, dan dapat diuji unit test.
 */

export interface VoxelPoint {
  x: number;
  y: number;
}

export interface VoxelLayer {
  z: number;
  scale?: number;
  color: string;
  points: VoxelPoint[];
}

/** Matriks pixel art 9x8 untuk bentuk hati romantis */
export const HEART_MATRIX: readonly (readonly number[])[] = [
  [0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 2, 2, 1, 0, 1, 2, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
] as const;

/** Matriks pixel art 7x7 untuk bunga mekar 8-bit */
export const FLOWER_MATRIX: readonly (readonly number[])[] = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 1, 0],
  [1, 2, 2, 3, 2, 2, 1],
  [1, 2, 3, 3, 3, 2, 1],
  [1, 2, 2, 3, 2, 2, 1],
  [0, 1, 2, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
] as const;

/** Matriks pixel art 7x7 untuk kilau / bintang berkedip 8-bit */
export const SPARKLE_MATRIX: readonly (readonly number[])[] = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [0, 1, 2, 3, 2, 1, 0],
  [1, 2, 3, 3, 3, 2, 1],
  [0, 1, 2, 3, 2, 1, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
] as const;

/** Matriks pixel art 14x6 untuk awan piksel bertingkat */
export const CLOUD_MATRIX: readonly (readonly number[])[] = [
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
] as const;

/** Menghitung proyeksi isometrik (sudut 30 derajat) */
export function projectIso(x: number, y: number, z = 0): { x: number; y: number } {
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);
  const isoX = (x - y) * cos30;
  const isoY = (x + y) * sin30 - z;
  return { x: Math.round(isoX * 100) / 100, y: Math.round(isoY * 100) / 100 };
}

/** Mengambil titik dari matriks berdasarkan nilai piksel */
export function extractPoints(matrix: readonly (readonly number[])[], targetValue: number): VoxelPoint[] {
  const points: VoxelPoint[] = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === targetValue) {
        points.push({ x: c, y: r });
      }
    }
  }
  return points;
}

/** Menghitung lapisan voxel dengan offset Z untuk efek 3D stereoskopik */
export function buildVoxelLayers(spread = 6): VoxelLayer[] {
  return [
    {
      z: -spread,
      color: "rgba(26, 22, 43, 0.25)",
      points: extractPoints(HEART_MATRIX, 1),
    },
    {
      z: 0,
      color: "#DB2777",
      points: extractPoints(HEART_MATRIX, 1),
    },
    {
      z: spread,
      color: "#F472B6",
      points: extractPoints(HEART_MATRIX, 2),
    },
  ];
}

/** Membuat SVG path d-string dari array balok piksel (ukuran pixelSize) */
export function matrixToSvgRects(
  matrix: readonly (readonly number[])[],
  palette: Record<number, string>,
  pixelSize = 4,
): { color: string; x: number; y: number; width: number; height: number }[] {
  const rects: { color: string; x: number; y: number; width: number; height: number }[] = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      const val = matrix[r][c];
      if (val > 0 && palette[val]) {
        rects.push({
          color: palette[val],
          x: c * pixelSize,
          y: r * pixelSize,
          width: pixelSize,
          height: pixelSize,
        });
      }
    }
  }
  return rects;
}
