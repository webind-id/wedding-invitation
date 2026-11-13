import { describe, expect, it } from "vitest";
import { tileFor } from "@/lib/gallery";
import type { Moment } from "@/shared/contract";

const m = (shape: Moment["shape"]): Moment => ({ src: `/${shape}.webp`, alt: "", shape });

describe("tileFor", () => {
  it("gives tall photos a two-row capsule", () => {
    expect(tileFor([m("tall")], 0)).toEqual({ span: "row-span-2", frame: "capsule" });
  });

  it("gives wide photos a two-column pill", () => {
    expect(tileFor([m("wide")], 0)).toEqual({ span: "col-span-2", frame: "rounded-full" });
  });

  it("makes the first square and every fourth square after it large", () => {
    const moments = [m("square"), m("tall"), m("square"), m("square"), m("square"), m("square")];
    const large = moments.map((_, i) => tileFor(moments, i).span === "col-span-2 row-span-2");
    expect(large).toEqual([true, false, false, false, false, true]);
  });
});
