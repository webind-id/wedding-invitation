import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/InvitationShell";
import { loadInvitation } from "@/lib/invitation";
import { guestNameFrom, metadataFor, previewFrom, type SearchParams } from "@/lib/page-props";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  return invitation ? metadataFor(invitation.content) : { title: "Undangan tidak ditemukan" };
}

/** Undangan dari database: /<slug>?to=Nama%20Tamu */
export default async function InvitationPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, { to, preview }] = await Promise.all([params, searchParams]);
  const invitation = await loadInvitation(slug, previewFrom(preview));
  if (!invitation) notFound();

  return (
    <InvitationShell
      content={invitation.content}
      slug={invitation.slug}
      guestName={guestNameFrom(to, invitation.content.defaultGuest)}
      isPreview={invitation.isPreview}
    />
  );
}
