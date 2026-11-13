import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/InvitationShell";
import { inviteeNameByCode, loadInvitation } from "@/lib/invitation";
import { guestCodeFrom, metadataFor, previewFrom, resolveGuestName, type SearchParams } from "@/lib/page-props";
import { previewSecret } from "@/shared/preview-token";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  return invitation ? metadataFor(invitation.content) : { title: "Undangan tidak ditemukan" };
}

/**
 * Undangan dari database. Tautan tamu dari admin:
 *   /<slug>?untuk=pak-budi-keluarga-k7q2        (nama dicari di daftar tamu)
 *   /<slug>?to=Nama&k=<tanda tangan>           (format lama, tetap didukung)
 */
export default async function InvitationPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, { untuk, to, k, preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  if (!invitation) notFound();

  const guestCode = guestCodeFrom(untuk);
  const guestName = resolveGuestName({
    invitedName: guestCode ? await inviteeNameByCode(invitation.id, guestCode) : null,
    hasCode: Boolean(guestCode),
    slug: invitation.slug,
    to,
    k,
    fallback: invitation.content.defaultGuest,
    secret: previewSecret(),
  });

  return <InvitationShell content={invitation.content} slug={invitation.slug} guestName={guestName} isPreview={invitation.isPreview} />;
}
