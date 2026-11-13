import { parseContact, type Channel } from "./contact";
import { cleanText, truncate } from "./text";

/** Baris tabel `invitees` (daftar penerima undangan, privat). */
export interface Invitee {
  id: string;
  invitation_id: string;
  name: string;
  contact: string;
  channel: Channel;
  inviter: string | null;
  is_sent: boolean;
  sent_at: string | null;
  created_at: string;
  /** Kode tautan (?untuk=…), dibuat trigger DB. Kosong bila migrasi 003 belum dijalankan. */
  code?: string | null;
}

export interface InviteeDraft {
  name: string;
  contact: string;
  channel: Channel;
  inviter: string | null;
}

export const INVITEE_LIMITS = { nameMax: 120, inviterMax: 120, batchMax: 1000 } as const;

export interface PreparedBatch {
  valid: InviteeDraft[];
  invalid: number;
}

/** Validasi + normalisasi + buang duplikat di dalam satu batch impor. */
export function prepareInvitees(raw: unknown): PreparedBatch {
  const rows = Array.isArray(raw) ? raw.slice(0, INVITEE_LIMITS.batchMax) : [];
  const seen = new Set<string>();
  const valid: InviteeDraft[] = [];
  let invalid = 0;

  for (const row of rows) {
    const r = (typeof row === "object" && row !== null ? row : {}) as Record<string, unknown>;
    const name = typeof r.name === "string" ? truncate(cleanText(r.name), INVITEE_LIMITS.nameMax) : "";
    const contact = typeof r.contact === "string" ? parseContact(r.contact) : null;
    const inviterRaw = typeof r.inviter === "string" ? truncate(cleanText(r.inviter), INVITEE_LIMITS.inviterMax) : "";
    const key = contact ? `${contact.channel}:${contact.value}` : "";

    if (!name || !contact || seen.has(key)) {
      invalid++;
      continue;
    }
    seen.add(key);
    valid.push({ name, contact: contact.value, channel: contact.channel, inviter: inviterRaw || null });
  }
  return { valid, invalid };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(value: string): boolean {
  return UUID.test(value);
}
