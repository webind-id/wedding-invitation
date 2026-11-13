/**
 * Validasi file upload (foto & musik undangan). Tipe MIME dari browser
 * tidak dipercaya: isi file dicek lewat "magic bytes".
 */

export type MediaKind = "image" | "audio";

interface MediaType {
  ext: string;
  kind: MediaKind;
  maxBytes: number;
  matches: (b: Uint8Array) => boolean;
}

const MB = 1024 * 1024;
/** Foto dikompres ke WebP setelah diunggah (lib/image.ts), jadi foto HP besar tetap diterima. */
const IMAGE_INPUT_MAX = 10 * MB;
const startsWith = (b: Uint8Array, sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v);

export const MEDIA_TYPES: Record<string, MediaType> = {
  "image/jpeg": { ext: "jpg", kind: "image", maxBytes: IMAGE_INPUT_MAX, matches: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  "image/png": {
    ext: "png",
    kind: "image",
    maxBytes: IMAGE_INPUT_MAX,
    matches: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  "image/webp": {
    ext: "webp",
    kind: "image",
    maxBytes: IMAGE_INPUT_MAX,
    matches: (b) => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8),
  },
  "audio/mpeg": {
    ext: "mp3",
    kind: "audio",
    maxBytes: 10 * MB,
    // Tag ID3, atau langsung frame sync MPEG (11 bit pertama = 1).
    matches: (b) => startsWith(b, [0x49, 0x44, 0x33]) || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0),
  },
};

export type MediaCheck = { ok: true; ext: string; mime: string } | { ok: false; error: string };

export function checkMedia(mime: string, size: number, head: Uint8Array, expected: MediaKind): MediaCheck {
  const type = MEDIA_TYPES[mime];
  if (!type || type.kind !== expected) {
    return { ok: false, error: expected === "image" ? "Format foto harus JPG, PNG, atau WebP." : "Format musik harus MP3." };
  }
  if (size === 0) return { ok: false, error: "File kosong." };
  if (size > type.maxBytes) return { ok: false, error: `Ukuran maksimal ${type.maxBytes / MB} MB.` };
  if (!type.matches(head)) return { ok: false, error: "Isi file tidak sesuai formatnya." };
  return { ok: true, ext: type.ext, mime };
}
