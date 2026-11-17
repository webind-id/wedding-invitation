import { describe, expect, it } from "vitest";
import { galleryLayout, MAX_DOTS, slideIndex } from "@/lib/gallery";

describe("galleryLayout", () => {
  it("shows a single photo on its own, without swipe hint or dots", () => {
    expect(galleryLayout(1)).toEqual({ isCarousel: false, showSwipeHint: false, showDots: false });
  });

  it("turns two or more photos into a carousel with dots", () => {
    expect(galleryLayout(2)).toEqual({ isCarousel: true, showSwipeHint: true, showDots: true });
  });

  it("swaps dots for a counter when there are too many to fit", () => {
    expect(galleryLayout(MAX_DOTS).showDots).toBe(true);
    expect(galleryLayout(MAX_DOTS + 1).showDots).toBe(false);
  });
});

describe("slideIndex", () => {
  it("rounds to the nearest slide", () => {
    expect(slideIndex(0, 300, 5)).toBe(0);
    expect(slideIndex(160, 300, 5)).toBe(1);
    expect(slideIndex(890, 300, 5)).toBe(3);
  });

  it("clamps to the available slides", () => {
    expect(slideIndex(-50, 300, 5)).toBe(0);
    expect(slideIndex(5000, 300, 5)).toBe(4);
    expect(slideIndex(100, 0, 5)).toBe(0);
  });
});
