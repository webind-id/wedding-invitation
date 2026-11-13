"use client";

import { FileDown, FileUp, UserPlus } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addInviteesAction, type AddResult } from "@/app/(panel)/undangan/[id]/_actions/guests";
import { parseContact } from "@/lib/contact";
import { csvToGuests, toCsv } from "@/lib/csv";
import { downloadFile } from "@/lib/download";
import type { LinkedInvitee } from "@/lib/guest-link";
import { spreadsheetToGuests } from "@/lib/spreadsheet";

interface AddInviteesProps {
  invitationId: string;
  onAdded: (invitees: LinkedInvitee[], summary: string) => void;
  onError: (message: string) => void;
}

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

function summaryOf(r: AddResult): string {
  const parts = [`${r.inserted} tamu ditambahkan`];
  if (r.duplicate) parts.push(`${r.duplicate} sudah ada`);
  if (r.invalid) parts.push(`${r.invalid} tidak valid`);
  return parts.join(" · ");
}

export function AddInvitees({ invitationId, onAdded, onError }: AddInviteesProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [inviter, setInviter] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = contact.trim() ? parseContact(contact) : null;
  const contactHint = !contact.trim()
    ? "Nomor WhatsApp (08…) atau username Instagram (@…)"
    : parsed
      ? `Terdeteksi: ${parsed.channel === "whatsapp" ? "WhatsApp" : "Instagram"}`
      : "Format kontak tidak dikenali";

  async function submit(rows: { name: string; contact: string; inviter: string }[]): Promise<boolean> {
    setIsBusy(true);
    try {
      const result = await addInviteesAction(invitationId, rows);
      if (!result.ok) {
        onError(result.error);
        return false;
      }
      onAdded(result.data.invitees, summaryOf(result.data));
      return true;
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (await submit([{ name, contact, inviter }])) {
      setName("");
      setContact("");
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) return onError("File impor maksimal 5 MB.");

    try {
      const extension = file.name.toLowerCase().split(".").pop();
      const rows = extension === "csv" ? csvToGuests(await file.text()) : spreadsheetToGuests(await file.arrayBuffer());
      if (rows.length === 0) return onError("Tidak ada baris tamu di file ini.");
      await submit(rows);
    } catch {
      onError("File tidak dapat dibaca. Pastikan file berisi tabel daftar tamu.");
    }
  }

  return (
    <section className="card p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <UserPlus className="h-4 w-4 text-clay" aria-hidden /> Tambah tamu
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input className="input" aria-label="Nama tamu" placeholder="Nama tamu" value={name} onChange={(e) => setName(e.target.value)} required />
        <div>
          <input
            className="input"
            aria-label="Kontak"
            placeholder="08123456789 atau @username"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-describedby="contact-hint"
            required
          />
          <p id="contact-hint" className={contact && !parsed ? "error-text" : "hint"}>
            {contactHint}
          </p>
        </div>
        <input className="input" aria-label="Nama pengundang" placeholder="Nama pengundang (opsional)" value={inviter} onChange={(e) => setInviter(e.target.value)} />
        <button type="submit" disabled={isBusy || !name.trim() || !parsed} className="btn-primary w-full">
          Tambahkan
        </button>
      </form>

      <div className="mt-4 flex gap-2 border-t border-line pt-4">
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={isBusy} className="btn-outline btn-sm flex-1">
          <FileUp className="h-3.5 w-3.5" aria-hidden /> Impor file
        </button>
        <button
          type="button"
          onClick={() => downloadFile("template-tamu.csv", toCsv(["Nama", "Kontak", "Pengundang"], [["Budi Santoso", "081234567890", "Cahya"]]))}
          className="btn-outline btn-sm flex-1"
        >
          <FileDown className="h-3.5 w-3.5" aria-hidden /> Template CSV
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">Kolom boleh memiliki nama berbeda dan kolom tambahan akan diabaikan otomatis.</p>
    </section>
  );
}
