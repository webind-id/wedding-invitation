import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { NewInvitationForm } from "@/components/invitations/NewInvitationForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { listInvitations, type InvitationStatus } from "@/lib/repo/invitations";
import { listTemplates } from "@/lib/repo/templates";
import { urlPattern } from "@/lib/public-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Undangan" };

type Param = string | string[] | undefined;
type Params = Promise<{ q?: Param; template?: Param; status?: Param; baru?: Param }>;

const one = (v: Param): string | undefined => (Array.isArray(v) ? v[0] : v);

const STATUSES: { value: InvitationStatus | ""; label: string }[] = [
  { value: "", label: "Semua status" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draft" },
];

export default async function InvitationsPage({ searchParams }: { searchParams: Params }) {
  const raw = await searchParams;
  const params = { q: one(raw.q), template: one(raw.template), status: one(raw.status), baru: one(raw.baru) };
  const status = params.status === "published" || params.status === "draft" ? params.status : undefined;
  const templateId = params.template && /^[0-9a-f-]{36}$/i.test(params.template) ? params.template : undefined;

  const [templates, invitations, pattern] = await Promise.all([
    listTemplates(),
    listInvitations({ q: params.q, templateId, status }),
    urlPattern(),
  ]);
  const activeTemplates = templates.filter((t) => t.is_active);
  const isFiltered = Boolean(params.q || templateId || status);

  return (
    <>
      <PageHeader
        eyebrow="Kelola"
        title="Undangan"
        description={`${invitations.length} undangan${isFiltered ? " cocok dengan filter" : ""}`}
        actions={<NewInvitationForm templates={activeTemplates} urlPattern={pattern} defaultOpen={params.baru === "1"} />}
      />

      {/* Filter disimpan di URL agar bisa dibagikan & bertahan saat refresh. */}
      <form className="card mb-4 flex flex-wrap gap-3 p-3" role="search">
        <label className="relative min-w-52 flex-1">
          <span className="sr-only">Cari</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={params.q} placeholder="Cari judul atau slug…" className="input pl-9" />
        </label>
        <select name="template" defaultValue={templateId ?? ""} className="input w-auto" aria-label="Filter template">
          <option value="">Semua template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className="input w-auto" aria-label="Filter status">
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Terapkan
        </button>
        {isFiltered && (
          <Link href="/undangan" className="btn-outline">
            Reset
          </Link>
        )}
      </form>

      <div className="card overflow-hidden">
        {invitations.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted">
            {isFiltered ? "Tidak ada undangan yang cocok." : "Belum ada undangan."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Undangan</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Template</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">Diperbarui</th>
                <th className="w-10 px-5 py-3">
                  <span className="sr-only">Buka</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invitations.map((inv) => (
                <tr key={inv.id} className="group relative hover:bg-paper">
                  <td className="px-5 py-3.5">
                    <Link href={`/undangan/${inv.id}`} className="font-semibold after:absolute after:inset-0">
                      {inv.title}
                    </Link>
                    <p className="text-xs text-muted">/{inv.slug}</p>
                  </td>
                  <td className="hidden px-5 py-3.5 md:table-cell">{inv.template.name}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="hidden px-5 py-3.5 text-xs text-muted lg:table-cell">{formatDateTime(inv.updated_at)}</td>
                  <td className="px-5 py-3.5">
                    <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-ink" aria-hidden />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
