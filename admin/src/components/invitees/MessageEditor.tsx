"use client";

import { MessageSquareText, RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { saveMessageAction } from "@/app/(panel)/undangan/[id]/_actions/guests";
import { DEFAULT_MESSAGE } from "@/lib/message";

interface MessageEditorProps {
  invitationId: string;
  value: string;
  onChange: (value: string) => void;
}

/** Template pesan undangan — disimpan per undangan di database. */
export function MessageEditor({ invitationId, value, onChange }: MessageEditorProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [saved, setSaved] = useState(value);
  const isDirty = value !== saved;

  function save() {
    startSaving(async () => {
      const result = await saveMessageAction(invitationId, value);
      if (result.ok) setSaved(value);
      setStatus(result.ok ? "Tersimpan." : result.error);
    });
  }

  return (
    <section className="card p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <MessageSquareText className="h-4 w-4 text-clay" aria-hidden /> Template pesan
      </h2>
      <div className="mb-1.5 mt-4 flex justify-end">
        <button type="button" onClick={() => onChange(DEFAULT_MESSAGE)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-clay">
          <RotateCcw className="h-3 w-3" aria-hidden /> Kembalikan default
        </button>
      </div>
      <textarea
        aria-label="Template pesan"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setStatus(null);
        }}
        maxLength={2000}
        rows={11}
        className="input font-mono text-xs leading-relaxed"
      />
      <p className="hint">
        Placeholder: <code className="text-clay">{"{nama}"}</code> <code className="text-clay">{"{link}"}</code>{" "}
        <code className="text-clay">{"{pengundang}"}</code>
      </p>
      <div className="mt-3 flex items-center justify-end gap-3">
        {status && <p role="status" className="text-xs text-muted">{status}</p>}
        <button type="button" onClick={save} disabled={isSaving || !isDirty} className="btn-primary btn-sm">
          {isSaving ? "Menyimpan…" : "Simpan pesan"}
        </button>
      </div>
    </section>
  );
}
