"use client";

import { AlertTriangle, Download, Search, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { clearInviteesAction, deleteInviteeAction, setSentAction } from "@/app/(panel)/undangan/[id]/_actions/guests";
import { cn } from "@/lib/cn";
import { toCsv } from "@/lib/csv";
import { downloadFile } from "@/lib/download";
import type { LinkedInvitee } from "@/lib/guest-link";
import type { Invitee } from "@/lib/invitee";
import { AddInvitees } from "./AddInvitees";
import { InviteeRow } from "./InviteeRow";
import { MessageEditor } from "./MessageEditor";

type Filter = "semua" | "belum" | "terkirim";
type Notice = { tone: "ok" | "err"; text: string };
const NOTICE_MS = 3500;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "belum", label: "Belum" },
  { id: "terkirim", label: "Terkirim" },
];

interface GuestManagerProps {
  invitationId: string;
  isPublished: boolean;
  /** Peringatan soal format tautan (mis. migrasi 003 belum dijalankan); null bila beres. */
  linkNotice: string | null;
  /** Setiap tamu membawa tautan pribadinya (dibuat di server). */
  initialInvitees: LinkedInvitee[];
  initialMessage: string;
}

export function GuestManager({ invitationId, isPublished, linkNotice, initialInvitees, initialMessage }: GuestManagerProps) {
  const [invitees, setInvitees] = useState(initialInvitees);
  const [message, setMessage] = useState(initialMessage);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(t);
  }, [notice]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invitees.filter((g) => {
      if (filter === "belum" && g.is_sent) return false;
      if (filter === "terkirim" && !g.is_sent) return false;
      return !q || g.name.toLowerCase().includes(q) || g.contact.includes(q) || (g.inviter ?? "").toLowerCase().includes(q);
    });
  }, [invitees, query, filter]);

  const total = invitees.length;
  const sent = invitees.filter((g) => g.is_sent).length;

  async function toggleSent(invitee: Invitee, isSent: boolean) {
    const result = await setSentAction(invitationId, invitee.id, isSent);
    if (!result.ok) return setNotice({ tone: "err", text: result.error });
    // Gabungkan, bukan ganti: hasil server tidak membawa `link`.
    setInvitees((list) => list.map((g) => (g.id === result.data.id ? { ...g, ...result.data } : g)));
  }

  async function remove(invitee: Invitee) {
    if (!window.confirm(`Hapus ${invitee.name} dari daftar?`)) return;
    const result = await deleteInviteeAction(invitationId, invitee.id);
    if (!result.ok) return setNotice({ tone: "err", text: result.error });
    setInvitees((list) => list.filter((g) => g.id !== invitee.id));
  }

  async function clearAll() {
    if (!window.confirm(`Hapus SEMUA ${total} tamu undangan ini? Tidak bisa dibatalkan.`)) return;
    const result = await clearInviteesAction(invitationId);
    if (!result.ok) return setNotice({ tone: "err", text: result.error });
    setInvitees([]);
  }

  function exportCsv() {
    // Kontak tanpa awalan +/@ agar lolos penjaga formula CSV dan bisa diimpor ulang.
    const rows = invitees.map((g) => [
      g.name,
      g.contact,
      g.channel === "whatsapp" ? "WhatsApp" : "Instagram",
      g.inviter ?? "",
      g.link,
      g.is_sent ? "Ya" : "Belum",
    ]);
    downloadFile("daftar-tamu.csv", toCsv(["Nama", "Kontak", "Saluran", "Pengundang", "Tautan", "Terkirim"], rows));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <div className="space-y-6">
        <AddInvitees
          invitationId={invitationId}
          onAdded={(added, summary) => {
            setInvitees((list) => [...list, ...added]);
            setNotice({ tone: "ok", text: summary });
          }}
          onError={(text) => setNotice({ tone: "err", text })}
        />
        <MessageEditor invitationId={invitationId} value={message} onChange={setMessage} />
      </div>

      <section className="card p-5">
        {!isPublished && (
          <p className="mb-4 flex items-start gap-2 rounded-xl bg-clay/10 px-3.5 py-2.5 text-xs text-clay">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Undangan masih draft — tamu akan melihat halaman tidak ditemukan. Terbitkan dulu di tab Pengaturan sebelum mengirim.
          </p>
        )}
        {linkNotice && (
          <p className="mb-4 flex items-start gap-2 rounded-xl bg-danger/10 px-3.5 py-2.5 text-xs text-danger">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {linkNotice}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm text-muted">
            <span className="font-display text-2xl text-ink">{sent}</span> / {total} terkirim
          </p>
          <button type="button" onClick={exportCsv} disabled={total === 0} className="btn-outline btn-sm">
            <Download className="h-3.5 w-3.5" aria-hidden /> Ekspor
          </button>
          <button type="button" onClick={clearAll} disabled={total === 0} className="btn-danger btn-sm">
            <Trash className="h-3.5 w-3.5" aria-hidden /> Kosongkan
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper">
          <div className="h-full origin-left bg-moss transition-transform duration-500" style={{ transform: `scaleX(${total ? sent / total : 0})` }} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <label className="relative min-w-48 flex-1">
            <span className="sr-only">Cari tamu</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input className="input pl-9" placeholder="Cari nama, kontak, pengundang…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div role="group" aria-label="Filter status" className="flex rounded-xl border border-line p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn("rounded-lg px-3 py-1 text-xs font-semibold", filter === f.id ? "bg-ink text-paper" : "text-muted hover:text-ink")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted">{total === 0 ? "Belum ada tamu. Tambahkan di panel kiri." : "Tidak ada yang cocok."}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {visible.map((g) => (
              <InviteeRow
                key={g.id}
                invitee={g}
                link={g.link}
                template={message}
                onToggleSent={toggleSent}
                onRemove={remove}
                onNotice={(text) => setNotice({ tone: "ok", text })}
              />
            ))}
          </ul>
        )}
      </section>

      {notice && (
        <p
          role="status"
          className={cn(
            "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg",
            notice.tone === "ok" ? "bg-forest" : "bg-danger",
          )}
        >
          {notice.text}
        </p>
      )}
    </div>
  );
}
