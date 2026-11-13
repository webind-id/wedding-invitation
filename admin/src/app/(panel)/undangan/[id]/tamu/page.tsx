import { GuestManager } from "@/components/invitees/GuestManager";
import { guestLinkNotice, withGuestLinks } from "@/lib/guest-link";
import { isUuid } from "@/lib/invitee";
import { loadInvitation } from "@/lib/load";
import { DEFAULT_MESSAGE } from "@/lib/message";
import { urlPattern } from "@/lib/public-url";
import { listInvitees } from "@/lib/repo/invitees";
import { publicUrl } from "@/lib/slug";
import { previewSecret } from "@/shared/preview-token";

export const dynamic = "force-dynamic";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Paralel: daftar tamu cukup butuh id (sudah ada di URL), tidak perlu menunggu undangan.
  // id tidak valid → loadInvitation() memanggil notFound(), jadi daftar tamu tidak diquery.
  const [inv, invitees, pattern] = await Promise.all([loadInvitation(id), isUuid(id) ? listInvitees(id) : [], urlPattern()]);
  const baseLink = publicUrl(pattern, inv.template.base_url, inv.slug);
  // Tautan dibuat di server: ?untuk=<kode>, atau format lama bertanda tangan bila kode belum ada.
  // Secret tidak pernah dikirim ke browser.
  const secret = previewSecret();

  return (
    <GuestManager
      invitationId={inv.id}
      isPublished={inv.status === "published"}
      linkNotice={guestLinkNotice(invitees, secret)}
      initialInvitees={withGuestLinks(invitees, baseLink, inv.slug, secret)}
      initialMessage={inv.message_template || DEFAULT_MESSAGE}
    />
  );
}
