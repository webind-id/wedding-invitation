import { readFile } from "node:fs/promises";
import path from "node:path";
import { CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";
import { marked } from "marked";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { subdomainPattern } from "@/lib/domain";
import { getDomain } from "@/lib/public-url";
import { listInvitations } from "@/lib/repo/invitations";
import { publicUrl } from "@/lib/slug";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panduan subdomain" };

const DOC_PATH = path.join(process.cwd(), "docs", "SUBDOMAIN.md");

/** Apakah migrasi 001 (fungsi resolve_invitation_host) sudah dijalankan? */
async function gatewayFunctionReady(): Promise<boolean> {
  const { error } = await db().rpc("resolve_invitation_host", { p_slug: "cek-panduan" });
  if (error) console.error("[panduan] resolve_invitation_host", error);
  return !error;
}

function Check({ ok, title, children }: { ok: boolean; title: string; children: React.ReactNode }) {
  const Icon = ok ? CheckCircle2 : CircleAlert;
  return (
    <li className="flex gap-3">
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ok ? "text-moss" : "text-clay")} aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5 text-sm text-muted">{children}</div>
      </div>
    </li>
  );
}

export default async function GuidePage() {
  const [markdown, functionReady, recent, domain] = await Promise.all([
    readFile(DOC_PATH, "utf8"),
    gatewayFunctionReady(),
    listInvitations({}, 3),
    getDomain(),
  ]);
  const pattern = subdomainPattern(domain.settings);
  // Sumbernya file dokumentasi di repo (bukan masukan pengguna), jadi aman dirender sebagai HTML.
  const html = await marked.parse(markdown, { gfm: true });

  return (
    <>
      <PageHeader eyebrow="Panduan" title="Subdomain undangan" description="Setiap undangan di alamatnya sendiri, mis. cahya-wahyu.kudostack.com — lewat Cloudflare." />

      <section className="card mb-8 p-6" aria-labelledby="status-title">
        <h2 id="status-title" className="font-semibold">
          Status konfigurasi
        </h2>
        <ul className="mt-5 space-y-4">
          <Check ok={functionReady && domain.ready} title="Migrasi database">
            {functionReady && domain.ready ? "001 & 002 sudah dijalankan." : "Belum lengkap — jalankan supabase/migrations/001 lalu 002 (langkah 3)."}
          </Check>
          <Check ok={Boolean(pattern)} title="Subdomain di admin">
            {pattern ? (
              <code className="text-ink">{pattern}</code>
            ) : (
              <>Belum aktif — atur di menu Domain (langkah 7).</>
            )}{" "}
            <Link href="/domain" className="font-semibold text-clay hover:underline">
              Buka pengaturan domain
            </Link>
          </Check>
        </ul>

        {recent.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Alamat undangan terbaru</p>
            <ul className="mt-3 space-y-2 text-sm">
              {recent.map((inv) => {
                const url = publicUrl(pattern, inv.template.base_url, inv.slug);
                return (
                  <li key={inv.id} className="flex flex-wrap items-center gap-x-3">
                    <span className="font-medium">{inv.title}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all text-clay hover:underline">
                      {url} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      <article className="doc card max-w-4xl p-6 sm:p-10" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
