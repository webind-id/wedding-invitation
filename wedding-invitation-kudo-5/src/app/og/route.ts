import { ogImageResponse, renderOgImage } from "@/lib/og-render";
import { sampleContent } from "@/shared/sample";

/** Gambar pratinjau halaman demo template (isi contoh). */
export async function GET() {
  try {
    return ogImageResponse(await renderOgImage("demo", sampleContent));
  } catch (err) {
    console.error("[og] gagal membuat gambar pratinjau demo", err);
    return new Response("Gagal membuat gambar", { status: 500 });
  }
}
