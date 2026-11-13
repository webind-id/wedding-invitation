/**
 * Tanda tangan nama tamu — dibagikan ke semua template.
 * Sumber asli: admin/src/shared/ (lihat contract.ts). Hanya untuk server.
 *
 * Admin membuat tautan ?to=<nama>&k=<tanda tangan> untuk setiap tamu di daftar.
 * Template hanya menampilkan nama bila tanda tangannya cocok; nama yang diketik
 * sendiri di URL (atau tautan tanpa `k`) jatuh ke sapaan bawaan.
 *
 * Memakai PREVIEW_SECRET (lihat preview-token.ts) dengan awalan pesan berbeda
 * ("guest:" vs "preview:"), jadi token pratinjau & token tamu tidak bisa saling
 * dipertukarkan. Tidak kedaluwarsa: tautan yang sudah dikirim tetap berlaku.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const GUEST_NAME_MAX = 80;
/** 16 karakter base64url = 96 bit — cukup kuat, tetap pendek di URL. */
const TOKEN_LENGTH = 16;

/** Bentuk baku nama tamu; admin (menandatangani) & template (memeriksa) wajib memakai ini. */
export function normalizeGuestName(raw: string): string {
  return raw.normalize("NFC").trim().slice(0, GUEST_NAME_MAX);
}

export function signGuestName(slug: string, name: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`guest:${slug}:${normalizeGuestName(name)}`)
    .digest("base64url")
    .slice(0, TOKEN_LENGTH);
}

export function verifyGuestName(slug: string, name: string, token: string | undefined, secret: string | undefined): boolean {
  if (!token || !secret || !normalizeGuestName(name)) return false;
  const expected = Buffer.from(signGuestName(slug, name, secret));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
