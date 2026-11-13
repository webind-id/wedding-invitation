import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/InvitationShell";
import { inviteeNameByCode, loadInvitation, type LoadedInvitation } from "@/lib/invitation";
import { ogVersion, publicPageUrl, requestOrigin } from "@/lib/og-meta";
import { guestCodeFrom, metadataFor, previewFrom, resolveGuestName, type SearchParams } from "@/lib/page-props";
import { isGatewayRequest } from "@/lib/rate-limit";
import { previewSecret } from "@/shared/preview-token";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Query = Awaited<SearchParams>;

/** Nama di sampul: ?untuk= dari daftar tamu, tautan lama bertanda tangan, atau sapaan bawaan. */
async function guestNameFor(invitation: LoadedInvitation, { untuk, to, k }: Query): Promise<string> {
  const guestCode = guestCodeFrom(untuk);
  return resolveGuestName({
    invitedName: guestCode ? await inviteeNameByCode(invitation.id, guestCode) : null,
    hasCode: Boolean(guestCode),
    slug: invitation.slug,
    to,
    k,
    fallback: invitation.content.defaultGuest,
    secret: previewSecret(),
  });
}

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> {
  const [{ slug }, query, h] = await Promise.all([params, searchParams, headers()]);
  const invitation = await loadInvitation(slug, previewFrom(query.preview));
  if (!invitation) return { title: "Undangan tidak ditemukan" };

  const guestName = await guestNameFor(invitation, query);
  return metadataFor(invitation.content, {
    // Sapaan bawaan ("Bapak/Ibu/Saudara/i") tidak dipakai sebagai nama di pratinjau.
    guestName: guestName === invitation.content.defaultGuest ? null : guestName,
    pageUrl: publicPageUrl(h, invitation.slug, isGatewayRequest(h)),
    // Draf (pratinjau admin) tidak punya gambar — route /og hanya melayani undangan terbit.
    imageUrl: invitation.isPreview ? undefined : `${requestOrigin(h)}/${invitation.slug}/og?v=${ogVersion(invitation.content)}`,
  });
}

/**
 * Undangan dari database. Tautan tamu dari admin:
 *   /<slug>?untuk=pak-budi-keluarga-k7q2        (nama dicari di daftar tamu)
 *   /<slug>?to=Nama&k=<tanda tangan>           (format lama, tetap didukung)
 */
export default async function InvitationPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(query.preview));
  if (!invitation) notFound();

  const guestName = await guestNameFor(invitation, query);
  return <InvitationShell content={invitation.content} slug={invitation.slug} guestName={guestName} isPreview={invitation.isPreview} />;
}
