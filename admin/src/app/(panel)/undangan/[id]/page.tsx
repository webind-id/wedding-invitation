import { ContentEditor } from "@/components/editor/ContentEditor";
import { loadInvitation } from "@/lib/load";
import { sampleContent } from "@/shared/sample";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await loadInvitation(id);
  // Isi field yang mungkin belum ada di konten lama dengan nilai contoh.
  const initial = { ...sampleContent, ...inv.content };
  return <ContentEditor invitationId={inv.id} initial={initial} />;
}
