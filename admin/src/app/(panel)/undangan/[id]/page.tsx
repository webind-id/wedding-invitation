import { ContentEditor } from "@/components/editor/ContentEditor";
import { loadInvitation } from "@/lib/load";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await loadInvitation(id);
  return <ContentEditor invitationId={inv.id} initial={inv.content} />;
}
