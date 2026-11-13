"use client";

import { AlertTriangle, Download, Link2, MessageCircle, RefreshCw, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { createClientFormAction, importClientFormAction, revokeClientFormAction } from "@/app/(panel)/undangan/[id]/_actions/client-form";
import { CopyButton } from "@/components/ui/CopyButton";
import type { ClientFormAvailability, SubmissionSummary } from "@/lib/client-form";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";

export type PanelState =
  | { kind: "not-ready" }
  | { kind: "none" }
  | {
      kind: "form";
      link: string;
      availability: ClientFormAvailability;
      status: "open" | "submitted" | "imported";
      expiresAt: string;
      updatedAt: string;
      submittedAt: string | null;
      importedAt: string | null;
      hasDraft: boolean;
      /** Ringkasan kiriman yang lolos validasi; null bila belum dikirim / tidak valid. */
      summary: SubmissionSummary | null;
    };

interface ClientFormPanelProps {
  invitationId: string;
  invitationTitle: string;
  state: PanelState;
}

type Notice = { tone: "ok" | "err"; text: string } | null;

export function ClientFormPanel({ invitationId, invitationTitle, state }: ClientFormPanelProps) {
  const [isBusy, startBusy] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);
  const [includeGuests, setIncludeGuests] = useState(true);

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>, okText: string) {
    setNotice(null);
    startBusy(async () => {
      const result = await action();
      setNotice(result.ok ? { tone: "ok", text: okText } : { tone: "err", text: result.error });
    });
  }

  function create() {
    run(() => createClientFormAction(invitationId), "Tautan baru dibuat. Tautan lama tidak berlaku lagi.");
  }

  function revoke() {
    if (!window.confirm("Cabut tautan? Klien tidak bisa membuka formulir lagi (isian yang tersimpan tetap ada).")) return;
    run(() => revokeClientFormAction(invitationId), "Tautan dicabut.");
  }

  function importNow() {
    if (!window.confirm("Ganti konten undangan dengan kiriman klien? Konten saat ini akan ditimpa.")) return;
    setNotice(null);
    startBusy(async () => {
      const result = await importClientFormAction(invitationId, includeGuests);
      if (!result.ok) return setNotice({ tone: "err", text: result.error });
      const { guestsAdded, guestsSkipped } = result.data;
      const guestText = includeGuests ? ` ${guestsAdded} tamu ditambahkan${guestsSkipped ? `, ${guestsSkipped} dilewati (tidak valid/sudah ada)` : ""}.` : "";
      setNotice({ tone: "ok", text: `Konten undangan diperbarui dari kiriman klien.${guestText}` });
    });
  }

  if (state.kind === "not-ready") {
    return (
      <section className="card flex gap-3 p-5 text-sm">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
        <p>
          Fitur formulir klien butuh tabel baru. Jalankan <code className="rounded bg-paper px-1">supabase/migrations/004_client_forms.sql</code> di Supabase → SQL
          Editor, lalu muat ulang halaman ini.
        </p>
      </section>
    );
  }

  const message = (link: string) =>
    `Halo! Silakan lengkapi data untuk undangan "${invitationTitle}" lewat tautan ini:\n${link}\n\nAnda bisa menyimpan draf dan melanjutkan kapan saja. Terima kasih 🙏`;

  return (
    <div className="space-y-4">
      {notice && (
        <p role="status" className={cn("rounded-xl px-4 py-3 text-sm", notice.tone === "ok" ? "bg-moss/10 text-moss" : "bg-danger/10 text-danger")}>
          {notice.text}
        </p>
      )}

      {state.kind === "none" ? (
        <section className="card p-6">
          <h2 className="font-semibold">Minta klien mengisi datanya sendiri</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Buat tautan rahasia khusus undangan ini, lalu kirim ke pasangan. Mereka mengisi mempelai, acara, foto & musik, kisah, rekening, dan daftar tamu.
            Kiriman masuk ke sini untuk Anda tinjau sebelum diimpor ke undangan.
          </p>
          <button type="button" onClick={create} disabled={isBusy} className="btn-accent mt-5">
            <Link2 className="h-4 w-4" aria-hidden /> Buat tautan formulir
          </button>
        </section>
      ) : (
        <>
          <section className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Tautan formulir klien</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {state.availability === "open"
                    ? `Berlaku sampai ${formatDateTime(state.expiresAt)}`
                    : state.availability === "expired"
                      ? `Kedaluwarsa sejak ${formatDateTime(state.expiresAt)}`
                      : "Sudah diimpor — formulir ditutup untuk klien"}
                </p>
              </div>
              <span
                className={cn(
                  "badge",
                  state.status === "submitted" ? "bg-clay/10 text-clay" : state.status === "imported" ? "bg-moss/15 text-moss" : "bg-ink/5 text-muted",
                )}
              >
                {state.status === "submitted" ? "Menunggu ditinjau" : state.status === "imported" ? "Sudah diimpor" : state.hasDraft ? "Klien sedang mengisi" : "Belum diisi"}
              </span>
            </div>

            {state.availability === "open" && (
              <>
                <input readOnly value={state.link} className="input mt-4 font-mono text-xs" aria-label="Tautan formulir klien" onFocus={(e) => e.target.select()} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton value={state.link} label="Salin tautan" />
                  <CopyButton value={message(state.link)} label="Salin pesan" />
                  <a href={`https://wa.me/?text=${encodeURIComponent(message(state.link))}`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Kirim via WhatsApp
                  </a>
                </div>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <button type="button" onClick={create} disabled={isBusy} className="btn-outline btn-sm">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Buat tautan baru
              </button>
              {state.availability === "open" && (
                <button type="button" onClick={revoke} disabled={isBusy} className="btn-danger btn-sm">
                  <XCircle className="h-3.5 w-3.5" aria-hidden /> Cabut tautan
                </button>
              )}
              {state.hasDraft && state.status !== "submitted" && (
                <span className="self-center text-xs text-muted">Draf klien terakhir disimpan {formatDateTime(state.updatedAt)}</span>
              )}
            </div>
          </section>

          {state.status === "submitted" && (
            <section className="card p-5">
              <h2 className="font-semibold">Kiriman klien</h2>
              <p className="mt-0.5 text-xs text-muted">Dikirim {state.submittedAt ? formatDateTime(state.submittedAt) : "-"}</p>
              {state.summary ? (
                <>
                  <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Pasangan", state.summary.couple],
                      ["Acara pertama", state.summary.firstEvent ? formatDateTime(state.summary.firstEvent) : "-"],
                      ["Acara", String(state.summary.events)],
                      ["Bab kisah", String(state.summary.story)],
                      ["Foto galeri", String(state.summary.gallery)],
                      ["Rekening", String(state.summary.accounts)],
                      ["Musik", state.summary.hasMusic ? "Ada" : "Tidak ada"],
                      ["Tamu", String(state.summary.guests)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-paper p-3">
                        <dt className="text-xs text-muted">{label}</dt>
                        <dd className="mt-0.5 truncate font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeGuests} onChange={(e) => setIncludeGuests(e.target.checked)} disabled={state.summary.guests === 0} />
                    Tambahkan juga {state.summary.guests} tamu ke tab Tamu (kontak yang sudah ada dilewati)
                  </label>
                  <p className="mt-3 flex items-start gap-2 text-xs text-clay">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    Impor mengganti seluruh konten undangan dengan kiriman ini. Tinjau dulu bila Anda sudah mengedit konten.
                  </p>
                  <button type="button" onClick={importNow} disabled={isBusy} className="btn-accent mt-4">
                    <Download className="h-4 w-4" aria-hidden /> {isBusy ? "Mengimpor…" : "Impor ke undangan"}
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm text-danger">Kiriman tidak lolos validasi. Minta klien membuka tautan, memperbaiki isian bertanda merah, lalu mengirim ulang.</p>
              )}
            </section>
          )}

          {state.status === "imported" && state.importedAt && (
            <p className="text-sm text-muted">
              Diimpor {formatDateTime(state.importedAt)}. Butuh revisi dari klien? Klik <b>Buat tautan baru</b> — klien melanjutkan dari isian terakhir undangan.
            </p>
          )}
        </>
      )}
    </div>
  );
}
