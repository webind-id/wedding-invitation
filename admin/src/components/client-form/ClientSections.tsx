"use client";

import { ClipboardPaste, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditorSection } from "@/components/editor/EditorSection";
import { TextArea, TextInput } from "@/components/editor/inputs";
import type { ClientGuestRow } from "@/lib/client-form";
import { parseContact } from "@/lib/contact";
import { csvToGuests } from "@/lib/csv";

/** Teks undangan versi klien — tanpa isian teknis (sapaan ?untuk=, judul tab/SEO). */
export function ClientTextsSection() {
  return (
    <EditorSection id="teks" title="Teks undangan" description="Kalimat pengantar, ayat, dan penutup (boleh dikosongkan)" errorPaths={["invitationIntro", "verse", "closing"]}>
      <TextArea label="Kalimat pengantar" path={["invitationIntro"]} />
      <TextArea label="Ayat (Arab) — kosongkan bila tidak ingin menampilkan ayat" path={["verse", "arabic"]} dir="rtl" />
      <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
        <TextArea label="Terjemahan ayat" path={["verse", "translation"]} />
        <TextInput label="Sumber ayat" path={["verse", "source"]} placeholder="QS. Ar-Rum : 21" />
      </div>
      <TextArea label="Pesan penutup" path={["closing", "message"]} />
      <TextInput label="Tanda tangan penutup" path={["closing", "signature"]} placeholder="Kami yang berbahagia" />
    </EditorSection>
  );
}

const MAX_GUESTS = 1000;
const EMPTY_ROW: ClientGuestRow = { name: "", contact: "", inviter: "" };

interface ClientGuestsSectionProps {
  guests: ClientGuestRow[];
  onChange: (guests: ClientGuestRow[]) => void;
}

/**
 * Daftar tamu yang ingin diundang. Bisa diketik per baris atau ditempel sekaligus
 * (satu tamu per baris: "Nama, 0812…" — dari Excel/Sheets juga bisa).
 */
export function ClientGuestsSection({ guests, onChange }: ClientGuestsSectionProps) {
  const [pasted, setPasted] = useState("");
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const filled = guests.filter((g) => g.name || g.contact).length;

  const edit = (index: number, field: keyof ClientGuestRow, value: string) =>
    onChange(guests.map((g, i) => (i === index ? { ...g, [field]: value } : g)));

  function addPasted() {
    const rows = csvToGuests(pasted).map((g) => ({ name: g.name.trim(), contact: g.contact.trim(), inviter: g.inviter.trim() }));
    const kept = guests.filter((g) => g.name || g.contact || g.inviter);
    onChange([...kept, ...rows].slice(0, MAX_GUESTS));
    setPasted("");
    setIsPasteOpen(false);
  }

  return (
    <EditorSection id="tamu" title="Daftar tamu" description={`${filled} tamu · nomor WhatsApp (08…) atau Instagram (@…)`} errorPaths={[]}>
      <ul className="space-y-2">
        {guests.map((g, i) => {
          const contact = g.contact.trim();
          const isContactBad = Boolean(contact) && !parseContact(contact);
          return (
            <li key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start sm:border-0 sm:p-0">
              <input className="input" placeholder="Nama tamu" value={g.name} onChange={(e) => edit(i, "name", e.target.value)} aria-label={`Nama tamu ${i + 1}`} />
              <div>
                <input
                  className={isContactBad ? "input input-error" : "input"}
                  placeholder="0812… atau @username"
                  value={g.contact}
                  onChange={(e) => edit(i, "contact", e.target.value)}
                  aria-label={`Kontak tamu ${i + 1}`}
                  aria-invalid={isContactBad}
                />
                {isContactBad && <p className="error-text">Format kontak tidak dikenali</p>}
              </div>
              <input className="input" placeholder="Diundang oleh (opsional)" value={g.inviter} onChange={(e) => edit(i, "inviter", e.target.value)} aria-label={`Pengundang tamu ${i + 1}`} />
              <button type="button" onClick={() => onChange(guests.filter((_, j) => j !== i))} className="btn-outline px-2.5" aria-label={`Hapus tamu ${i + 1}`}>
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange([...guests, EMPTY_ROW])} disabled={guests.length >= MAX_GUESTS} className="btn-outline btn-sm">
          <Plus className="h-3.5 w-3.5" aria-hidden /> Tambah tamu
        </button>
        <button type="button" onClick={() => setIsPasteOpen((v) => !v)} className="btn-outline btn-sm" aria-expanded={isPasteOpen}>
          <ClipboardPaste className="h-3.5 w-3.5" aria-hidden /> Tempel banyak sekaligus
        </button>
      </div>

      {isPasteOpen && (
        <div className="space-y-2 rounded-xl bg-paper p-3">
          <label htmlFor="tempel-tamu" className="label">
            Satu tamu per baris: nama, kontak, pengundang (opsional)
          </label>
          <textarea
            id="tempel-tamu"
            className="input min-h-32 font-mono text-xs"
            placeholder={"Pak Budi & Keluarga, 0812 3456 7890\nRina, @rina.story, Mempelai wanita"}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
          />
          <button type="button" onClick={addPasted} disabled={!pasted.trim()} className="btn-primary btn-sm">
            Tambahkan ke daftar
          </button>
        </div>
      )}
    </EditorSection>
  );
}
