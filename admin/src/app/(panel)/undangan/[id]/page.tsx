import { ContentEditor } from "@/components/editor/ContentEditor";
import { loadInvitation } from "@/lib/load";
import { emptyContent } from "@/shared/empty-content";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await loadInvitation(id);
  // Tampilkan placeholder untuk semua bagian selain teks undangan.
  const initial = emptyContent(inv.content);
  return <ContentEditor invitationId={inv.id} initial={initial} />;
}
