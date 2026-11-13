import { loadInvitation } from "@/lib/invitation";
import { ogImageResponse, renderOgImage } from "@/lib/og-render";

export const dynamic = "force-dynamic";

/** Gambar pratinjau tautan undangan (og:image). Hanya undangan terbit — draf tidak pernah dipratinjau. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = await loadInvitation(slug);
  if (!invitation) return new Response("Tidak ditemukan", { status: 404 });
  try {
    return ogImageResponse(await renderOgImage(invitation.slug, invitation.content));
  } catch (err) {
    console.error("[og] gagal membuat gambar pratinjau", err);
    return new Response("Gagal membuat gambar", { status: 500 });
  }
}
