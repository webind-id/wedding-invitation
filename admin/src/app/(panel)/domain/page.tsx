import { BookOpen, CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DomainForm } from "@/components/domain/DomainForm";
import { GatewayCheck } from "@/components/domain/GatewayCheck";
import { CopyButton } from "@/components/ui/CopyButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import { subdomainPattern } from "@/lib/domain";
import { getDomain } from "@/lib/public-url";
import { listInvitations } from "@/lib/repo/invitations";
import { publicUrl } from "@/lib/slug";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Domain" };

/** Apakah fungsi resolve_invitation_host (migrasi 001/002) sudah ada? */
async function gatewayFunctionReady(): Promise<boolean> {
  const { error } = await db().rpc("resolve_invitation_host", { p_slug: "cek-domain" });
  if (error) console.error("[domain] resolve_invitation_host", error);
  return !error;
}

function Step({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  const Icon = ok ? CheckCircle2 : CircleAlert;
  return (
    <li className="flex gap-2.5 text-sm">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", ok ? "text-moss" : "text-clay")} aria-hidden />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export default async function DomainPage() {
  const [{ settings, ready }, functionReady, invitations] = await Promise.all([getDomain(), gatewayFunctionReady(), listInvitations({}, 200)]);
  const pattern = subdomainPattern(settings);
  const publishedCount = invitations.filter((i) => i.status === "published").length;

  return (
    <>
      <PageHeader
        eyebrow="Pengaturan"
        title="Domain & subdomain"
        description="Atur alamat undangan untuk semua klien, mis. cahya-wahyu.kudostack.com."
        actions={
          <Link href="/panduan" className="btn-outline">
            <BookOpen className="h-4 w-4" aria-hidden /> Panduan pemasangan
          </Link>
        }
      />

      {!ready && (
        <p role="alert" className="mb-6 max-w-5xl rounded-2xl border border-clay/30 bg-clay/10 px-5 py-4 text-sm text-ink">
          <b>Satu langkah lagi:</b> jalankan <code>supabase/migrations/002_domain_settings.sql</code> di Supabase → SQL Editor, lalu muat ulang
          halaman ini. Sebelum itu pengaturan belum bisa disimpan.
        </p>
      )}

      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
        <DomainForm settings={settings} isReady={ready} publishedCount={publishedCount} exampleSlug={invitations[0]?.slug ?? "cahya-wahyu"} />

        <div className="space-y-6">
          <section className="card p-5" aria-labelledby="setup-title">
            <h2 id="setup-title" className="font-semibold">
              Status
            </h2>
            <ul className="mt-3 space-y-2.5">
              <Step ok={ready && functionReady}>{ready && functionReady ? "Database siap" : "Migrasi 001 & 002 belum lengkap"}</Step>
              <Step ok={Boolean(settings.rootDomain)}>{settings.rootDomain ? <>Domain induk: <b className="break-all">{settings.rootDomain}</b></> : "Domain induk belum diisi"}</Step>
              <Step ok={settings.enabled}>{settings.enabled ? "Subdomain aktif di semua tautan" : "Subdomain nonaktif — tautan memakai alamat template"}</Step>
            </ul>
            <p className="mt-4 text-xs text-muted">
              DNS wildcard dan Cloudflare Worker diatur di dashboard Cloudflare —{" "}
              <Link href="/panduan" className="font-semibold text-clay hover:underline">
                lihat langkahnya
              </Link>
              .
            </p>
          </section>
          <GatewayCheck rootDomain={settings.rootDomain} />
        </div>
      </div>

      <section className="card mt-8 max-w-5xl overflow-hidden" aria-labelledby="addresses-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-6 py-4">
          <h2 id="addresses-title" className="font-semibold">
            Alamat undangan
          </h2>
          <p className="text-xs text-muted">{pattern ? "Subdomain per undangan" : "Alamat app template + /slug"}</p>
        </div>
        {invitations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">Belum ada undangan.</p>
        ) : (
          <ul className="divide-y divide-line">
            {invitations.map((inv) => {
              const url = publicUrl(pattern, inv.template.base_url, inv.slug);
              return (
                <li key={inv.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3">
                  <Link href={`/undangan/${inv.id}/pengaturan`} className="w-44 shrink-0 truncate text-sm font-medium hover:text-clay">
                    {inv.title}
                  </Link>
                  <span className="min-w-0 flex-1 break-all font-mono text-xs text-ink/80">{url}</span>
                  <span className="text-xs text-muted">{inv.template.name}</span>
                  <StatusBadge status={inv.status} />
                  <span className="flex items-center gap-1">
                    <CopyButton value={url} />
                    {inv.status === "published" && (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1 text-muted hover:bg-clay/10 hover:text-clay" aria-label={`Buka ${inv.title}`}>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
