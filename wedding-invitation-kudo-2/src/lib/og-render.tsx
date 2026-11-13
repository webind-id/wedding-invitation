import "server-only";
import { ImageResponse } from "next/og";
import { OG_PHOTO, OgCard } from "@/components/og/OgCard";
import { couplePair, type InvitationContent } from "@/shared/contract";
import { formatLongDate } from "./datetime";
import { coverDataUrl, ogFonts, toJpeg } from "./og-image";
import { OG_SIZE, ogVersion } from "./og-meta";

const CACHE_LIMIT = 40;
/** Hasil render per (kunci, versi) — render pertama ±0,5 s, berikutnya instan. */
const cache = new Map<string, Buffer>();

/** Gambar pratinjau tautan (JPEG 1200×630) untuk satu undangan. */
export async function renderOgImage(cacheKey: string, content: InvitationContent): Promise<Buffer> {
  const key = `${cacheKey}:${ogVersion(content)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const [a, b] = couplePair(content);
  const firstEvent = content.events[0];
  const [fonts, photo] = await Promise.all([ogFonts(), coverDataUrl(content.coverPhoto, OG_PHOTO.width, OG_PHOTO.height)]);
  const png = await new ImageResponse(
    <OgCard first={a.nickname} second={b.nickname} date={firstEvent ? formatLongDate(firstEvent.start, content.timeZone) : ""} venue={firstEvent?.venue ?? ""} photo={photo} />,
    { ...OG_SIZE, fonts },
  ).arrayBuffer();
  const jpeg = await toJpeg(png);

  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
  cache.set(key, jpeg);
  return jpeg;
}

/** Header respons gambar: URL membawa ?v=<versi>, jadi aman di-cache lama oleh WhatsApp/CDN. */
export function ogImageResponse(jpeg: Buffer): Response {
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(jpeg.byteLength),
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
