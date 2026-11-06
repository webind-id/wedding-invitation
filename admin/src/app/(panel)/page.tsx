import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { dashboardStats, listInvitations } from "@/lib/repo/invitations";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([dashboardStats(), listInvitations({}, 6)]);
  const sentPct = stats.invitees ? Math.round((stats.sent / stats.invitees) * 100) : 0;

  const tiles = [
    { label: "Undangan", value: stats.invitations, hint: `${stats.published} terbit · ${stats.invitations - stats.published} draft` },
    { label: "Template", value: stats.templates, hint: "desain tersedia" },
    { label: "Konfirmasi RSVP", value: stats.rsvps, hint: "dari semua undangan" },
    { label: "Undangan terkirim", value: `${sentPct}%`, hint: `${stats.sent} dari ${stats.invitees} tamu` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Ringkasan"
        title="Selamat datang"
        actions={
          <Link href="/undangan?baru=1" className="btn-accent">
            <Plus className="h-4 w-4" aria-hidden /> Undangan baru
          </Link>
        }
      />

      <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {tiles.map((t, i) => (
          <div key={t.label} className={i === 0 ? "card bg-ink p-5 text-paper" : "card p-5"}>
            <dt className={i === 0 ? "text-xs text-paper/60" : "text-xs text-muted"}>{t.label}</dt>
            <dd className="mt-2 font-display text-4xl">{t.value}</dd>
            <dd className={i === 0 ? "mt-1 text-xs text-paper/50" : "mt-1 text-xs text-muted"}>{t.hint}</dd>
          </div>
        ))}
      </dl>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">Terakhir diperbarui</h2>
          <Link href="/undangan" className="text-xs font-semibold text-clay hover:underline">
            Lihat semua
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Belum ada undangan. Pastikan sudah ada template, lalu buat undangan pertama.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((inv) => (
              <li key={inv.id}>
                <Link href={`/undangan/${inv.id}`} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-paper">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{inv.title}</p>
                    <p className="truncate text-xs text-muted">
                      /{inv.slug} · {inv.template.name}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                  <span className="hidden text-xs text-muted sm:block">{formatDateTime(inv.updated_at)}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
