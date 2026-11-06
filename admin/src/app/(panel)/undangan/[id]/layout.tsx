import { ChevronLeft, Eye, Globe } from "lucide-react";
import Link from "next/link";
import { InvitationTabs } from "@/components/invitations/InvitationTabs";
import { CopyButton } from "@/components/ui/CopyButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { loadInvitation } from "@/lib/load";
import { publicInvitationUrl } from "@/lib/public-url";
import { createPreviewToken, previewSecret } from "@/shared/preview-token";

export default async function InvitationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = await loadInvitation(id);
  const publicUrl = await publicInvitationUrl(inv.template.base_url, inv.slug);
  const secret = previewSecret();
  const previewUrl = secret ? `${publicUrl}?preview=${createPreviewToken(inv.slug, secret)}` : null;

  return (
    <>
      <Link href="/undangan" className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden /> Semua undangan
      </Link>

      <header className="mb-6 mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate font-display text-3xl italic sm:text-4xl">{inv.title}</h1>
            <StatusBadge status={inv.status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>
              Template <b className="text-ink">{inv.template.name}</b>
            </span>
            <span aria-hidden>·</span>
            <span className="break-all">{publicUrl}</span>
            <CopyButton value={publicUrl} label="Salin" />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Eye className="h-4 w-4" aria-hidden /> Pratinjau
            </a>
          ) : (
            <span className="btn-outline opacity-50" title="Isi PREVIEW_SECRET di .env.local">
              <Eye className="h-4 w-4" aria-hidden /> Pratinjau
            </span>
          )}
          {inv.status === "published" && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Globe className="h-4 w-4" aria-hidden /> Buka undangan
            </a>
          )}
        </div>
      </header>

      <InvitationTabs id={inv.id} />
      <div className="mt-6">{children}</div>
    </>
  );
}
