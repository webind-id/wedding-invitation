"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteEntryAction } from "@/app/(panel)/undangan/[id]/_actions/guests";

/** Moderasi: hapus ucapan yang tidak pantas. */
export function DeleteEntryButton({ invitationId, entryId, name }: { invitationId: string; entryId: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Hapus ucapan dari ${name}?`)) return;
    startTransition(async () => {
      const result = await deleteEntryAction(invitationId, entryId);
      if (!result.ok) window.alert(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Hapus ucapan dari ${name}`}
      className="h-8 w-8 shrink-0 rounded-lg text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-40"
    >
      <Trash2 className="mx-auto h-4 w-4" />
    </button>
  );
}
