import { afterEach, describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { fingerprint, SESSION_TTL_SECONDS, sessionSecret, signSession, verifySession } from "@/lib/session";
import { createPreviewToken, PREVIEW_TTL_SECONDS, previewSecret, verifyPreviewToken } from "@/shared/preview-token";

const SECRET = "x".repeat(40);
const NOW = 1_800_000_000_000;

describe("session", () => {
  it("round-trips username + version", async () => {
    const token = await signSession("admin", "v1", SECRET, NOW);
    expect(await verifySession(token, SECRET, NOW)).toEqual({ sub: "admin", ver: "v1", exp: NOW / 1000 + SESSION_TTL_SECONDS });
  });

  it("rejects wrong secret, tampering, expiry and junk", async () => {
    const token = await signSession("admin", "v1", SECRET, NOW);
    expect(await verifySession(token, "y".repeat(40), NOW)).toBeNull();
    const forged = Buffer.from(JSON.stringify({ sub: "root", ver: "v1", exp: 9e12 })).toString("base64url");
    expect(await verifySession(`${forged}.${token.split(".")[1]}`, SECRET, NOW)).toBeNull();
    expect(await verifySession(token, SECRET, NOW + SESSION_TTL_SECONDS * 1000)).toBeNull();
    for (const junk of [undefined, "abc", "a.b.c", "!!.??"]) expect(await verifySession(junk, SECRET, NOW)).toBeNull();
  });

  it("fingerprints change with the hash", async () => {
    expect(await fingerprint("a")).not.toBe(await fingerprint("b"));
    expect(await fingerprint("a")).toHaveLength(16);
  });
});

describe("secrets from env", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("ignores secrets shorter than 32 chars", () => {
    vi.stubEnv("SESSION_SECRET", "short");
    vi.stubEnv("PREVIEW_SECRET", "short");
    expect(sessionSecret()).toBeUndefined();
    expect(previewSecret()).toBeUndefined();
    vi.stubEnv("SESSION_SECRET", SECRET);
    vi.stubEnv("PREVIEW_SECRET", SECRET);
    expect(sessionSecret()).toBe(SECRET);
    expect(previewSecret()).toBe(SECRET);
  });
});

describe("preview token", () => {
  it("is bound to the slug and expires", () => {
    const token = createPreviewToken("cahya-wahyu", SECRET, NOW);
    expect(verifyPreviewToken("cahya-wahyu", token, SECRET, NOW)).toBe(true);
    expect(verifyPreviewToken("other-slug", token, SECRET, NOW)).toBe(false);
    expect(verifyPreviewToken("cahya-wahyu", token, "z".repeat(40), NOW)).toBe(false);
    expect(verifyPreviewToken("cahya-wahyu", token, SECRET, NOW + PREVIEW_TTL_SECONDS * 1000)).toBe(false);
  });

  it("rejects malformed tokens and a missing secret", () => {
    for (const bad of [undefined, "", "123", "abc.def", "1.2.3"]) {
      expect(verifyPreviewToken("s", bad, SECRET, NOW)).toBe(false);
    }
    expect(verifyPreviewToken("s", createPreviewToken("s", SECRET, NOW), undefined, NOW)).toBe(false);
  });
});

describe("password", () => {
  it("verifies the right password only", async () => {
    const stored = await hashPassword("rahasia-panjang");
    expect(await verifyPassword("rahasia-panjang", stored)).toBe(true);
    expect(await verifyPassword("salah", stored)).toBe(false);
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });
});

describe("rate limiting", () => {
  it("blocks after the limit and recovers", () => {
    const limiter = createRateLimiter(2, 1000);
    expect([limiter.check("a", 0), limiter.check("a", 1), limiter.check("a", 2)]).toEqual([true, true, false]);
    expect(limiter.check("a", 1_002)).toBe(true);
  });

  it("prefers platform IP headers over spoofable ones", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "6.6.6.6, 2.2.2.2" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3", "x-forwarded-for": "6.6.6.6" }))).toBe("3.3.3.3");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
