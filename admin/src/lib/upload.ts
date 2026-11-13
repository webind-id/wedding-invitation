import "server-only";
import { randomUUID } from "node:crypto";
import { toWebp } from "./image";
import { checkMedia, type MediaKind } from "./media";
import { db, MEDIA_BUCKET } from "./supabase";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const CACHE_SECONDS = "31536000";

/**
 * Simpan satu file media ke Supabase Storage di bawah `folder` (mis. "<invitationId>" atau
 * "<invitationId>/klien"). Dipakai editor admin dan formulir klien.
 * - Isi file dicek lewat magic bytes (lib/media.ts) — MIME dari browser tidak dipercaya.
 * - Foto selalu disimpan sebagai WebP yang sudah diperkecil & tanpa metadata (lib/image.ts).
 */
export async function uploadMedia(folder: string, file: File, kind: MediaKind): Promise<UploadResult> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkMedia(file.type, file.size, bytes.subarray(0, 16), kind);
  if (!check.ok) return check;

  let body: Uint8Array = bytes;
  let mime = check.mime;
  let ext = check.ext;
  if (kind === "image") {
    try {
      body = await toWebp(bytes);
      mime = "image/webp";
      ext = "webp";
    } catch (err) {
      console.error("[upload] konversi WebP gagal", err instanceof Error ? err.message : err);
      return { ok: false, error: "Foto tidak bisa diproses. Coba file JPG/PNG lain." };
    }
  }

  const path = `${folder}/${randomUUID()}.${ext}`;
  const storage = db().storage.from(MEDIA_BUCKET);
  const { error } = await storage.upload(path, body, { contentType: mime, cacheControl: CACHE_SECONDS, upsert: false });
  if (error) {
    console.error("[upload]", error);
    return { ok: false, error: "Gagal mengunggah file. Pastikan bucket invitation-media sudah dibuat (schema.sql)." };
  }
  return { ok: true, url: storage.getPublicUrl(path).data.publicUrl };
}
