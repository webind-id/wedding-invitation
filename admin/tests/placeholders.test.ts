import { describe, expect, it } from "vitest";
import { examplePlaceholder } from "@/lib/placeholders";
import { sampleContent } from "@/shared/sample";

describe("examplePlaceholder", () => {
  it("shows the sample value as an example", () => {
    expect(examplePlaceholder(["bride", "fullName"])).toBe(`mis. ${sampleContent.bride.fullName}`);
    expect(examplePlaceholder(["events", 0, "venue"])).toBe(`mis. ${sampleContent.events[0].venue}`);
  });

  it("reuses the last sample row for extra list items", () => {
    const last = sampleContent.events[sampleContent.events.length - 1];
    expect(examplePlaceholder(["events", 9, "name"])).toBe(`mis. ${last.name}`);
  });

  it("skips non-text, empty, and URL/file samples, and shortens long text", () => {
    expect(examplePlaceholder(["events", 0, "untilFinished"])).toBeUndefined();
    expect(examplePlaceholder(["nope", "x"])).toBeUndefined();
    expect(examplePlaceholder(["coverPhoto"], { coverPhoto: "/images/cover.webp" })).toBeUndefined();
    expect(examplePlaceholder(["a"], { a: "  " })).toBeUndefined();
    expect(examplePlaceholder(["list", 0], { list: [] })).toBeUndefined();
    const long = examplePlaceholder(["t"], { t: "x".repeat(500) })!;
    expect(long.length).toBeLessThanOrEqual(145);
    expect(long.endsWith("…")).toBe(true);
  });
});
