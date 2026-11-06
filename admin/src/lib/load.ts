import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isUuid } from "./invitee";
import { getInvitation, type InvitationRow } from "./repo/invitations";

/** Muat undangan sekali per request (dipakai layout + halaman tab), 404 bila tidak ada. */
export const loadInvitation = cache(async (id: string): Promise<InvitationRow> => {
  if (!isUuid(id)) notFound();
  const invitation = await getInvitation(id);
  if (!invitation) notFound();
  return invitation;
});
