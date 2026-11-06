"use client";

import { Globe, Lock } from "lucide-react";
import { useState, useTransition } from "react";
import { setStatusAction } from "@/app/(panel)/undangan/[id]/_actions/settings";
import { formatDateTime } from "@/lib/format";
import type { InvitationStatus } from "@/lib/repo/invitations";

interface PublishCardProps {
  invitationId: string;
  status: InvitationStatus;
  publishedAt: string | null;
}

export function PublishCard({ invitationId, status, publishedAt }: PublishCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isLive = status === "published";

  function toggle() {
    if (isLive && !window.confirm("Tarik undangan? Tamu akan melihat halaman tidak ditemukan.")) return;
    startTransition(async () => {
      const result = await setStatusAction(invitationId, !isLive);
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <section className={isLive ? "card border-moss/30 bg-moss/5 p-5" : "card p-5"}>
      <h2 className="flex items-center gap-2 font-semibold">
        {isLive ? <Globe className="h-4 w-4 text-moss" aria-hidden /> : <Lock className="h-4 w-4 text-muted" aria-hidden />}
        {isLive ? "Terbit" : "Draft"}
      </h2>
      <p className="mt-1 text-xs text-muted">
        {isLive && publishedAt
          ? `Bisa diakses tamu sejak ${formatDateTime(publishedAt)}.`
          : "Hanya bisa dilihat lewat tautan Pratinjau."}
      </p>
      {error && <p className="error-text">{error}</p>}
      <button type="button" onClick={toggle} disabled={isPending} className={isLive ? "btn-outline mt-4 w-full" : "btn-accent mt-4 w-full"}>
        {isPending ? "Memproses…" : isLive ? "Tarik ke draft" : "Terbitkan sekarang"}
      </button>
    </section>
  );
}
