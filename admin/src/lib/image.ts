/**
 * Semua foto yang diunggah (admin & formulir klien) disimpan sebagai WebP:
 * - diperkecil agar sisi terpanjang ≤ IMAGE_MAX_DIMENSION (tidak pernah diperbesar),
 * - orientasi EXIF diterapkan (foto HP tidak miring),
 * - SEMUA metadata dibuang — EXIF dari HP bisa berisi lokasi GPS rumah.
 */
import sharp from "sharp";

/** Cukup tajam untuk layar retina selebar 1200px; jauh lebih kecil dari foto HP asli. */
export const IMAGE_MAX_DIMENSION = 2400;
export const WEBP_QUALITY = 80;
/** Tolak "bom piksel" (file kecil dengan resolusi raksasa). */
const MAX_INPUT_PIXELS = 60_000_000;

export async function toWebp(input: Uint8Array): Promise<Uint8Array> {
  const output = await sharp(input, { failOn: "error", limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({ width: IMAGE_MAX_DIMENSION, height: IMAGE_MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer(); // tanpa .withMetadata() → EXIF/ICC/XMP tidak ikut
  return new Uint8Array(output);
}
