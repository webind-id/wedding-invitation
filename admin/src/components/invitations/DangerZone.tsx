"use client";

import { Copy, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteInvitationAction, duplicateAction } from "@/app/(panel)/undangan/[id]/_actions/settings";

export function DangerZone({ invitationId, slug }: { invitationId: string; slug: string }) {
  const [confirmSlug, setConfirmSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      setError(result.ok ? null : (result.error ?? "Gagal."));
    });
  }

  return (
    <>
      <section className="card p-5">
        <h2 className="font-semibold">Duplikat</h2>
        <p className="mt-1 text-xs text-muted">Salin konten & template ke undangan draft baru — cocok untuk pasangan berikutnya.</p>
        <button type="button" onClick={() => run(() => duplicateAction(invitationId))} disabled={isPending} className="btn-outline mt-4 w-full">
          <Copy className="h-4 w-4" aria-hidden /> Duplikat undangan
        </button>
      </section>

      <section className="card border-danger/30 p-5">
        <h2 className="font-semibold text-danger">Hapus undangan</h2>
        <p className="mt-1 text-xs text-muted">
          Menghapus undangan beserta seluruh daftar tamu dan ucapannya. Ketik <b className="text-ink">{slug}</b> untuk konfirmasi.
        </p>
        <input
          value={confirmSlug}
          onChange={(e) => setConfirmSlug(e.target.value)}
          aria-label="Ketik slug untuk konfirmasi"
          className="input mt-3"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => run(() => deleteInvitationAction(invitationId, confirmSlug))}
          disabled={isPending || confirmSlug !== slug}
          className="btn-danger mt-3 w-full"
        >
          <Trash2 className="h-4 w-4" aria-hidden /> Hapus permanen
        </button>
        {error && <p className="error-text">{error}</p>}
      </section>
    </>
  );
}
