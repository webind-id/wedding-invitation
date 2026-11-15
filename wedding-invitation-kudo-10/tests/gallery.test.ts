import { describe, expect, it } from "vitest";
import { tileFor } from "@/lib/gallery";
import type { Moment } from "@/shared/contract";

const base: Moment = { src: "/images/moment-1.webp", alt: "", shape: "square" };

describe("tileFor", () => {
  it("gives tall moments row-span-2", () => {
    expect(tileFor([{ ...base, shape: "tall" }], 0).span).toBe("row-span-2");
  });

  it("gives wide moments col-span-2", () => {
    expect(tileFor([{ ...base, shape: "wide" }], 0).span).toBe("col-span-2");
  });

  it("gives the first square 2x2 and subsequent squares 1x1 until the 5th", () => {
    const list: Moment[] = Array.from({ length: 5 }, () => ({ ...base, shape: "square" }));
    expect(tileFor(list, 0).span).toBe("col-span-2 row-span-2");
    expect(tileFor(list, 1).span).toBe("");
    expect(tileFor(list, 4).span).toBe("col-span-2 row-span-2");
  });
});
