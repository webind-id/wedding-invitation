"use client";

import { AtSign, Check, Link2, MessageCircle, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { displayContact, fillTemplate, instagramDmLink, whatsappLink } from "@/lib/contact";
import type { Invitee } from "@/lib/invitee";

interface InviteeRowProps {
  invitee: Invitee;
  link: string;
  template: string;
  onToggleSent: (invitee: Invitee, isSent: boolean) => void;
  onRemove: (invitee: Invitee) => void;
  onNotice: (text: string) => void;
}

const ICON_BTN =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:border-ink hover:text-ink";

export function InviteeRow({ invitee, link, template, onToggleSent, onRemove, onNotice }: InviteeRowProps) {
  const message = fillTemplate(template, { nama: invitee.name, link, pengundang: invitee.inviter });
  const isWhatsApp = invitee.channel === "whatsapp";

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      onNotice(`${label} disalin.`);
    } catch {
      onNotice("Browser menolak akses clipboard.");
    }
  }

  async function send() {
    if (isWhatsApp) {
      window.open(whatsappLink(invitee.contact, message), "_blank", "noopener,noreferrer");
    } else {
      // Instagram tidak menerima teks lewat URL — salin dulu lalu buka DM.
      await copy(message, "Pesan");
      window.open(instagramDmLink(invitee.contact), "_blank", "noopener,noreferrer");
    }
    if (!invitee.is_sent) onToggleSent(invitee, true);
  }

  return (
    <li className={cn("flex flex-wrap items-center gap-3 rounded-xl border border-line px-4 py-3", invitee.is_sent && "bg-moss/5")}>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{invitee.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          {isWhatsApp ? <MessageCircle className="h-3 w-3" aria-hidden /> : <AtSign className="h-3 w-3" aria-hidden />}
          {displayContact({ channel: invitee.channel, value: invitee.contact })}
          {invitee.inviter && <span className="text-muted/70">· dari {invitee.inviter}</span>}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => copy(link, "Tautan")} className={ICON_BTN} aria-label={`Salin tautan untuk ${invitee.name}`}>
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggleSent(invitee, !invitee.is_sent)}
          className={cn(ICON_BTN, invitee.is_sent && "border-moss bg-moss text-white hover:text-white")}
          aria-label={invitee.is_sent ? "Tandai belum terkirim" : "Tandai terkirim"}
        >
          {invitee.is_sent ? <Undo2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </button>
        <button type="button" onClick={() => onRemove(invitee)} className={cn(ICON_BTN, "hover:border-danger hover:text-danger")} aria-label={`Hapus ${invitee.name}`}>
          <Trash2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={send} className="btn-accent btn-sm">
          {isWhatsApp ? "Kirim WA" : "Kirim DM"}
        </button>
      </div>
    </li>
  );
}
