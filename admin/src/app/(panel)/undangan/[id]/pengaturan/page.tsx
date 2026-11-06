import { DangerZone } from "@/components/invitations/DangerZone";
import { MetaForm } from "@/components/invitations/MetaForm";
import { PublishCard } from "@/components/invitations/PublishCard";
import { loadInvitation } from "@/lib/load";
import { listTemplates } from "@/lib/repo/templates";
import { urlPattern } from "@/lib/public-url";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [inv, templates, pattern] = await Promise.all([loadInvitation(id), listTemplates(), urlPattern()]);
  // Template nonaktif tetap muncul bila sedang dipakai undangan ini.
  const choices = templates.filter((t) => t.is_active || t.id === inv.template_id);

  return (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <MetaForm
        invitationId={inv.id}
        title={inv.title}
        slug={inv.slug}
        templateId={inv.template_id}
        urlPattern={pattern}
        templates={choices.map(({ id: tid, name, code, base_url }) => ({ id: tid, name, code, base_url }))}
      />
      <div className="space-y-6">
        <PublishCard invitationId={inv.id} status={inv.status} publishedAt={inv.published_at} />
        <DangerZone invitationId={inv.id} slug={inv.slug} />
      </div>
    </div>
  );
}
