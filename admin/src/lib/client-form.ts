/**
 * Formulir klien: tautan rahasia per undangan (/isi/<token>) agar pasangan mengisi
 * datanya sendiri. Kiriman disimpan terpisah dan baru masuk ke undangan saat admin
 * menekan "Impor". Modul ini murni (tanpa DB) agar mudah diuji.
 *
 * Input dari halaman publik → readClientPayload() (batas ukuran & bentuk, SEBELUM zod)
 * → prepareClientSubmission() (kontrak konten + normalisasi daftar tamu).
 */
import { randomBytes } from "node:crypto";
import { coupleLabel, fieldErrors, invitationContentSchema, type InvitationContent } from "@/shared/contract";
import { prepareInvitees, type PreparedBatch } from "./invitee";
import { cleanText, truncate } from "./text";

export const CLIENT_FORM_TTL_DAYS = 30;
/** Batas ukuran isian (JSON) dari halaman publik — dicek sebelum validasi zod. */
export const CLIENT_DRAFT_MAX_BYTES = 300_000;
export const CLIENT_GUESTS_MAX = 1000;

const DAY_MS = 86_400_000;
const TOKEN_BYTES = 24; // → 32 karakter base64url, 192 bit
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32}$/;
const GUEST_FIELD_MAX = { name: 120, contact: 60, inviter: 120 } as const;

export type ClientFormStatus = "open" | "submitted" | "imported";

/** Baris tabel `client_forms` (migrasi 004). */
export interface ClientFormRow {
  id: string;
  invitation_id: string;
  token: string;
  status: ClientFormStatus;
  expires_at: string;
  revoked_at: string | null;
  draft: unknown;
  guests: unknown;
  submitted_at: string | null;
  imported_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ClientFormAvailability = "open" | "expired" | "revoked" | "imported";

/** Satu baris daftar tamu yang diketik klien (belum dinormalisasi). */
export interface ClientGuestRow {
  name: string;
  contact: string;
  inviter: string;
}

export function newClientFormToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function isClientFormToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

export function clientFormExpiry(now: number = Date.now()): string {
  return new Date(now + CLIENT_FORM_TTL_DAYS * DAY_MS).toISOString();
}

export function clientFormLink(origin: string, token: string): string {
  return `${origin.replace(/\/+$/, "")}/isi/${token}`;
}

/** Bisakah klien membuka/mengubah formulir ini? Setelah dikirim pun masih bisa direvisi sampai diimpor. */
export function clientFormAvailability(
  form: Pick<ClientFormRow, "status" | "expires_at" | "revoked_at">,
  now: number = Date.now(),
): ClientFormAvailability {
  if (form.revoked_at) return "revoked";
  if (form.status === "imported") return "imported";
  if (Date.parse(form.expires_at) <= now) return "expired";
  return "open";
}

function guestRows(raw: unknown): ClientGuestRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: ClientGuestRow[] = [];
  for (const item of raw) {
    if (rows.length >= CLIENT_GUESTS_MAX) break;
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    const field = (key: keyof ClientGuestRow) => (typeof r[key] === "string" ? truncate(cleanText(r[key] as string), GUEST_FIELD_MAX[key]) : "");
    const row = { name: field("name"), contact: field("contact"), inviter: field("inviter") };
    if (row.name || row.contact || row.inviter) rows.push(row);
  }
  return rows;
}

/**
 * Bentuk & ukuran isian dari halaman publik. null bila konten bukan objek atau terlalu besar —
 * dicek SEBELUM zod agar input publik raksasa tidak pernah sampai ke validator.
 */
export function readClientPayload(content: unknown, guests: unknown): { content: Record<string, unknown>; guests: ClientGuestRow[] } | null {
  if (typeof content !== "object" || content === null || Array.isArray(content)) return null;
  const payload = { content: content as Record<string, unknown>, guests: guestRows(guests) };
  let size: number;
  try {
    size = JSON.stringify(payload).length;
  } catch {
    return null;
  }
  return size <= CLIENT_DRAFT_MAX_BYTES ? payload : null;
}

const kindOf = (v: unknown) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);

/**
 * Draf tersimpan → konten awal formulir. Editor selalu menyimpan objek konten utuh,
 * jadi cukup dicek bahwa setiap kunci teratas ada dengan jenis yang sama; draf rusak
 * (mis. dikirim manual) jatuh ke isi undangan agar formulir tidak crash.
 */
export function restoreDraft(draft: unknown, fallback: InvitationContent): InvitationContent {
  if (kindOf(draft) !== "object") return fallback;
  const d = draft as Record<string, unknown>;
  const matches = Object.entries(fallback).every(([key, value]) => key in d && kindOf(d[key]) === kindOf(value));
  return matches ? (draft as InvitationContent) : fallback;
}

export type PreparedSubmission =
  | { ok: true; content: InvitationContent; guests: PreparedBatch }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

/** Validasi kiriman final: kontrak konten (sama dengan editor admin) + normalisasi daftar tamu. */
export function prepareClientSubmission(content: unknown, guests: unknown): PreparedSubmission {
  const parsed = invitationContentSchema.safeParse(content);
  if (!parsed.success) return { ok: false, error: "Ada isian yang belum lengkap atau belum benar.", fieldErrors: fieldErrors(parsed.error) };
  return { ok: true, content: parsed.data, guests: prepareInvitees(guests) };
}

export interface SubmissionSummary {
  couple: string;
  firstEvent: string | null;
  events: number;
  story: number;
  gallery: number;
  accounts: number;
  hasMusic: boolean;
  guests: number;
}

/** Ringkasan kiriman untuk ditinjau admin sebelum diimpor. */
export function submissionSummary(content: InvitationContent, guestCount: number): SubmissionSummary {
  return {
    couple: coupleLabel(content),
    firstEvent: content.events[0]?.start ?? null,
    events: content.events.length,
    story: content.story.length,
    gallery: content.moments.length,
    accounts: content.gift.accounts.length,
    hasMusic: Boolean(content.music),
    guests: guestCount,
  };
}
