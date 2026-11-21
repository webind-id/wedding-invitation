import "server-only";
import { randomUUID } from "node:crypto";
import { checkGuestFile, GUEST_FILE_BUCKET, GUEST_FILE_HEAD_BYTES, safeFileName, type GuestFileMeta } from "./guest-file";
import { db } from "./supabase";

export type GuestFileUpload = { ok: true; meta: GuestFileMeta } | { ok: false; error: string };

/** Masa berlaku tautan unduhan untuk admin. */
const DOWNLOAD_TTL_SECONDS = 60;

/**
 * Simpan file daftar tamu klien APA ADANYA (byte yang sama, tanpa konversi) di bucket
 * PRIVAT client-files, di bawah `folder` (mis. "<invitationId>/<formId>").
 */
export async function uploadGuestFile(folder: string, file: File): Promise<GuestFileUpload> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkGuestFile(file.name, file.size, bytes.subarray(0, GUEST_FILE_HEAD_BYTES));
  if (!check.ok) return check;

  const path = `${folder}/${randomUUID()}.${check.ext}`;
  const { error } = await db().storage.from(GUEST_FILE_BUCKET).upload(path, bytes, { contentType: check.mime, upsert: false });
  if (error) {
    console.error("[guest-file] upload", error);
    return { ok: false, error: "Gagal mengunggah file. Coba lagi beberapa saat lagi." };
  }
  return {
    ok: true,
    meta: { path, name: safeFileName(file.name, check.ext), size: file.size, mime: check.mime, uploaded_at: new Date().toISOString() },
  };
}

export async function removeGuestFile(path: string): Promise<void> {
  const { error } = await db().storage.from(GUEST_FILE_BUCKET).remove([path]);
  if (error) console.error("[guest-file] hapus", error);
}

/** Tautan unduhan sementara (bucket privat) dengan nama file asli klien. */
export async function guestFileDownloadUrl(meta: GuestFileMeta): Promise<string | null> {
  const { data, error } = await db().storage.from(GUEST_FILE_BUCKET).createSignedUrl(meta.path, DOWNLOAD_TTL_SECONDS, { download: meta.name });
  if (error) {
    console.error("[guest-file] signed url", error);
    return null;
  }
  return data.signedUrl;
}
