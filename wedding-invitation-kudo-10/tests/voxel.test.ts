import { describe, expect, it } from "vitest";
import {
  CLOUD_MATRIX,
  FLOWER_MATRIX,
  HEART_MATRIX,
  SPARKLE_MATRIX,
  buildVoxelLayers,
  extractPoints,
  matrixToSvgRects,
  projectIso,
} from "@/lib/voxel";

describe("voxel geometry & pixel art", () => {
  it("projects 2D/3D points to isometric coordinates deterministically", () => {
    const origin = projectIso(0, 0, 0);
    expect(origin).toEqual({ x: 0, y: 0 });

    const p1 = projectIso(10, 10, 0);
    expect(p1.x).toBe(0);
    expect(p1.y).toBeGreaterThan(0);

    const withZ = projectIso(10, 10, 15);
    expect(withZ.y).toBe(p1.y - 15);
  });

  it("extracts point coordinates for given matrix values", () => {
    const outline = extractPoints(HEART_MATRIX, 1);
    expect(outline.length).toBeGreaterThan(0);
    for (const pt of outline) {
      expect(HEART_MATRIX[pt.y][pt.x]).toBe(1);
    }

    const fill = extractPoints(HEART_MATRIX, 2);
    expect(fill.length).toBeGreaterThan(0);
    for (const pt of fill) {
      expect(HEART_MATRIX[pt.y][pt.x]).toBe(2);
    }
  });

  it("builds multi-layer 3D voxel stacks", () => {
    const layers = buildVoxelLayers(8);
    expect(layers).toHaveLength(3);
    expect(layers[0].z).toBe(-8);
    expect(layers[1].z).toBe(0);
    expect(layers[2].z).toBe(8);
  });

  it("converts pixel matrices into SVG rectangles", () => {
    const palette = { 1: "#1A162B", 2: "#F472B6", 3: "#FBBF24" };
    const rects = matrixToSvgRects(FLOWER_MATRIX, palette, 5);
    expect(rects.length).toBeGreaterThan(0);
    for (const r of rects) {
      expect(r.width).toBe(5);
      expect(r.height).toBe(5);
      expect(Object.values(palette)).toContain(r.color);
    }
  });

  it("verifies matrix dimensions", () => {
    expect(HEART_MATRIX).toHaveLength(8);
    expect(HEART_MATRIX[0]).toHaveLength(9);
    expect(FLOWER_MATRIX).toHaveLength(7);
    expect(FLOWER_MATRIX[0]).toHaveLength(7);
    expect(SPARKLE_MATRIX).toHaveLength(7);
    expect(SPARKLE_MATRIX[0]).toHaveLength(7);
    expect(CLOUD_MATRIX).toHaveLength(6);
    expect(CLOUD_MATRIX[0]).toHaveLength(14);
  });
});
