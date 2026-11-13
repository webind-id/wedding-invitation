import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/InvitationShell";
import { loadInvitation } from "@/lib/invitation";
import { metadataFor, previewFrom, verifiedGuestName, type SearchParams } from "@/lib/page-props";
import { previewSecret } from "@/shared/preview-token";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  return invitation ? metadataFor(invitation.content) : { title: "Undangan tidak ditemukan" };
}

/** Undangan dari database: /<slug>?to=Nama%20Tamu&k=<tanda tangan dari admin> */
export default async function InvitationPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, { to, k, preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  if (!invitation) notFound();

  return (
    <InvitationShell
      content={invitation.content}
      slug={invitation.slug}
      guestName={verifiedGuestName(invitation.slug, to, k, invitation.content.defaultGuest, previewSecret())}
      isPreview={invitation.isPreview}
    />
  );
}
