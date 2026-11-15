import { afterEach, describe, expect, it, vi } from "vitest";
import { fail, ok, requestJson } from "@/lib/api";

describe("response helpers", () => {
  it("wraps data and errors in the envelope", async () => {
    expect(await ok({ a: 1 }, { status: 201 }).json()).toEqual({ success: true, data: { a: 1 } });
    const res = fail("nope", 400);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false, error: "nope" });
  });
});

describe("requestJson", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns data on success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ok({ x: 1 })));
    await expect(requestJson("/x")).resolves.toEqual({ x: 1 });
  });

  it("throws the server error message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => fail("Sesi berakhir", 401)));
    await expect(requestJson("/x")).rejects.toThrow("Sesi berakhir");
  });

  it("throws a generic error for non-JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("oops", { status: 502 })));
    await expect(requestJson("/x")).rejects.toThrow("Permintaan gagal (502).");
  });
});
