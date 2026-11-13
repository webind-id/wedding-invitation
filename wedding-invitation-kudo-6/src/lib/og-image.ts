import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Bahan gambar pratinjau tautan: huruf, foto sampul yang sudah dipotong, dan konversi ke JPEG.
 * WhatsApp paling andal dengan JPEG ≤ ~300 KB, jadi hasil render (PNG) dikompres di sini.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");
const COVER_FETCH_TIMEOUT_MS = 8000;
const COVER_MAX_BYTES = 12 * 1024 * 1024;
const JPEG_QUALITY = 82;

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 700;
  style: "normal" | "italic";
}

const FONT_FILES: { file: string; name: string; weight: OgFont["weight"]; style: OgFont["style"] }[] = [
  { file: "allura-latin-400-normal.woff", name: "Allura", weight: 400, style: "normal" },
  { file: "cormorant-garamond-latin-500-normal.woff", name: "Cormorant", weight: 500, style: "normal" },
  { file: "cormorant-garamond-latin-500-italic.woff", name: "Cormorant", weight: 500, style: "italic" },
  { file: "manrope-latin-500-normal.woff", name: "Manrope", weight: 500, style: "normal" },
  { file: "manrope-latin-700-normal.woff", name: "Manrope", weight: 700, style: "normal" },
];

let fontsPromise: Promise<OgFont[]> | null = null;

/** Huruf untuk renderer gambar (WOFF statis di public/og/fonts), dimuat sekali per proses. */
export function ogFonts(): Promise<OgFont[]> {
  fontsPromise ??= Promise.all(
    FONT_FILES.map(async ({ file, ...meta }) => {
      const buf = await readFile(path.join(PUBLIC_DIR, "og", "fonts", file));
      return { ...meta, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer };
    }),
  ).catch((err) => {
    fontsPromise = null;
    throw err;
  });
  return fontsPromise;
}

/** Host storage Supabase project ini — satu-satunya asal foto https yang boleh diambil server. */
function allowedRemoteHost(): string | null {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).host : null;
  } catch {
    return null;
  }
}

/**
 * Baca foto sampul: file di public/ template, atau https dari storage Supabase project ini.
 * Asal lain ditolak (URL foto bisa diisi lewat formulir klien — cegah server mengambil URL sembarang).
 */
async function readCover(src: string): Promise<Buffer | null> {
  if (src.startsWith("/") && !src.startsWith("//")) {
    const file = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(src.split("?")[0])));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return null;
    return readFile(file).catch(() => null);
  }
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.host !== allowedRemoteHost()) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(COVER_FETCH_TIMEOUT_MS), redirect: "error" });
    if (!res.ok || Number(res.headers.get("content-length") ?? 0) > COVER_MAX_BYTES) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.byteLength <= COVER_MAX_BYTES ? buf : null;
  } catch {
    return null;
  }
}

/** Foto sampul dipotong ke ukuran panel (fokus otomatis ke bagian paling menarik) sebagai data URL JPEG. */
export async function coverDataUrl(src: string, width: number, height: number): Promise<string | null> {
  if (!src) return null;
  const input = await readCover(src);
  if (!input) return null;
  try {
    const jpeg = await sharp(input, { limitInputPixels: 60_000_000 })
      .rotate()
      .resize(width, height, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 86 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Hasil render (PNG) → JPEG kecil untuk pratinjau chat. */
export async function toJpeg(png: ArrayBuffer): Promise<Buffer> {
  return sharp(Buffer.from(png)).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
}
