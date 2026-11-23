/**
 * Token pratinjau undangan draft — dibagikan ke semua template.
 * Sumber asli: admin/src/shared/ (lihat contract.ts). Hanya untuk server.
 *
 * Admin membuat tautan ?preview=<exp>.<sig>; template memverifikasinya
 * dengan PREVIEW_SECRET yang sama. Token terikat ke satu slug dan kedaluwarsa.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const PREVIEW_TTL_SECONDS = 60 * 60 * 24;
const MIN_SECRET_LENGTH = 32;

export function previewSecret(): string | undefined {
  const secret = process.env.PREVIEW_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : undefined;
}

function sign(slug: string, exp: number, secret: string): string {
  return createHmac("sha256", secret).update(`preview:${slug}:${exp}`).digest("base64url");
}

export function createPreviewToken(slug: string, secret: string, nowMs: number = Date.now()): string {
  const exp = Math.floor(nowMs / 1000) + PREVIEW_TTL_SECONDS;
  return `${exp}.${sign(slug, exp, secret)}`;
}

export function verifyPreviewToken(
  slug: string,
  token: string | undefined,
  secret: string | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const [expStr, sig, extra] = token.split(".");
  const exp = Number(expStr);
  if (!sig || extra !== undefined || !Number.isInteger(exp) || exp * 1000 <= nowMs) return false;

  const expected = Buffer.from(sign(slug, exp, secret));
  const actual = Buffer.from(sig);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
