"use client";

import { Download } from "lucide-react";
import { useState, useTransition } from "react";
import { exportGuestbookAction } from "@/app/(panel)/undangan/[id]/_actions/guests";
import { downloadFile } from "@/lib/download";

export function GuestbookTools({ invitationId, slug, disabled }: { invitationId: string; slug: string; disabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function exportCsv() {
    startTransition(async () => {
      const result = await exportGuestbookAction(invitationId);
      if (!result.ok) return setError(result.error);
      setError(null);
      downloadFile(`rsvp-${slug}.csv`, result.data);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {error && <p className="error-text mt-0">{error}</p>}
      <button type="button" onClick={exportCsv} disabled={disabled || isPending} className="btn-outline btn-sm">
        <Download className="h-3.5 w-3.5" aria-hidden /> {isPending ? "Menyiapkan…" : "Ekspor CSV"}
      </button>
    </div>
  );
}
