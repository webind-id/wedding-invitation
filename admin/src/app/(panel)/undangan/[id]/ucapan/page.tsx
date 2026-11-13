import Link from "next/link";
import { GuestbookTools } from "@/components/guestbook/GuestbookTools";
import { DeleteEntryButton } from "@/components/guestbook/DeleteEntryButton";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { ATTENDANCE_LABEL, type Attendance } from "@/lib/guestbook";
import { isUuid } from "@/lib/invitee";
import { loadInvitation } from "@/lib/load";
import { GUESTBOOK_PAGE_SIZE, guestbookPage } from "@/lib/repo/guestbook";

export const dynamic = "force-dynamic";

const BADGE: Record<Attendance, string> = {
  hadir: "bg-moss/15 text-moss",
  tidak_hadir: "bg-clay/10 text-clay",
  ragu: "bg-ink/5 text-muted",
};

export default async function GuestbookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hal?: string }>;
}) {
  const { id } = await params;
  const page = Math.max(1, Number.parseInt((await searchParams).hal ?? "1", 10) || 1);
  // Paralel: ucapan cukup butuh id. id tidak valid → loadInvitation() memanggil notFound().
  const [inv, guestbook] = await Promise.all([loadInvitation(id), isUuid(id) ? guestbookPage(id, page) : null]);
  if (!guestbook) return null;
  const { entries, total, summary } = guestbook;
  const pages = Math.max(1, Math.ceil(total / GUESTBOOK_PAGE_SIZE));

  const tiles = [
    { label: "Hadir", value: summary.hadir, hint: `${summary.heads} orang` },
    { label: "Berhalangan", value: summary.tidak_hadir },
    { label: "Belum pasti", value: summary.ragu },
    { label: "Total respons", value: total },
  ];

  return (
    <>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4">
            <dt className="text-xs text-muted">{t.label}</dt>
            <dd className="mt-1 font-display text-3xl">{t.value}</dd>
            {t.hint && <dd className="text-xs font-medium text-moss">{t.hint}</dd>}
          </div>
        ))}
      </dl>

      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-semibold">Ucapan masuk</h2>
          <GuestbookTools invitationId={inv.id} slug={inv.slug} disabled={total === 0} />
        </div>
        {entries.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted">Belum ada RSVP atau ucapan.</p>
        ) : (
          <ul className="divide-y divide-line">
            {entries.map((e) => (
              <li key={e.id} className="flex gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{e.name}</p>
                    <span className={cn("badge", BADGE[e.attendance])}>
                      {ATTENDANCE_LABEL[e.attendance]}
                      {e.attendance === "hadir" && ` · ${e.party_size} org`}
                    </span>
                    <time dateTime={e.created_at} className="text-xs text-muted">
                      {formatDateTime(e.created_at)}
                    </time>
                  </div>
                  {e.message && <p className="mt-1.5 whitespace-pre-line text-sm text-ink/80">{e.message}</p>}
                </div>
                <DeleteEntryButton invitationId={inv.id} entryId={e.id} name={e.name} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {pages > 1 && (
        <nav aria-label="Halaman" className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link href={`?hal=${page - 1}`} className="btn-outline btn-sm">
              Sebelumnya
            </Link>
          )}
          <span className="text-muted">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link href={`?hal=${page + 1}`} className="btn-outline btn-sm">
              Berikutnya
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
