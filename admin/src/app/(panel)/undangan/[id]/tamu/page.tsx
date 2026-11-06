import { GuestManager } from "@/components/invitees/GuestManager";
import { loadInvitation } from "@/lib/load";
import { DEFAULT_MESSAGE } from "@/lib/message";
import { listInvitees } from "@/lib/repo/invitees";
import { publicInvitationUrl } from "@/lib/public-url";

export const dynamic = "force-dynamic";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await loadInvitation(id);
  const invitees = await listInvitees(inv.id);

  return (
    <GuestManager
      invitationId={inv.id}
      baseLink={await publicInvitationUrl(inv.template.base_url, inv.slug)}
      isPublished={inv.status === "published"}
      initialInvitees={invitees}
      initialMessage={inv.message_template || DEFAULT_MESSAGE}
    />
  );
}
