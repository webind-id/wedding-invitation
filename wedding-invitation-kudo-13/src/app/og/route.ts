import { ogImageResponse, renderOgImage } from "@/lib/og-render";
import { klentengDemoContent } from "@/lib/klenteng-defaults";

/** Gambar pratinjau halaman demo template (isi contoh). */
export async function GET() {
  try {
    return ogImageResponse(await renderOgImage("demo", klentengDemoContent));
  } catch (err) {
    console.error("[og] gagal membuat gambar pratinjau demo", err);
    return new Response("Gagal membuat gambar", { status: 500 });
  }
}
