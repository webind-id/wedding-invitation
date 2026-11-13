"use server";

/**
 * Aksi PUBLIK formulir klien (tanpa login) — keamanan bergantung pada token di tautan:
 * - token dicek formatnya, dicari di DB, dan statusnya harus masih berlaku di SETIAP aksi;
 * - batas laju per IP (in-memory, sama seperti login & buku tamu);
 * - ukuran isian dibatasi SEBELUM validasi zod (readClientPayload);
 * - unggahan memakai jalur & pemeriksaan yang sama dengan admin (foto → WebP).
 */
import { headers } from "next/headers";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { clientFormAvailability, isClientFormToken, prepareClientSubmission, readClientPayload } from "@/lib/client-form";
import type { MediaKind } from "@/lib/media";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { clientFormByToken, saveClientDraft, submitClientForm, type ClientFormWithInvitation } from "@/lib/repo/client-forms";
import { uploadMedia } from "@/lib/upload";

const TEN_MINUTES = 10 * 60 * 1000;
const draftLimiter = createRateLimiter(60, TEN_MINUTES);
const submitLimiter = createRateLimiter(10, TEN_MINUTES);
const uploadLimiter = createRateLimiter(60, TEN_MINUTES);

const TOO_MANY = "Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi.";
const TOO_BIG = "Isian terlalu besar. Kurangi teks yang sangat panjang lalu coba lagi.";

const CLOSED: Record<"expired" | "revoked" | "imported", string> = {
  expired: "Masa berlaku tautan ini sudah habis. Minta tautan baru ke admin.",
  revoked: "Tautan ini sudah tidak berlaku. Minta tautan baru ke admin.",
  imported: "Data Anda sudah diproses admin. Hubungi admin bila ada perubahan.",
};

async function rateKey(token: string): Promise<string> {
  return `${clientIp(await headers())}:${token.slice(0, 8)}`;
}

/** Formulir yang masih berlaku untuk token ini, atau pesan kegagalan yang aman ditampilkan. */
async function openForm(token: unknown): Promise<ClientFormWithInvitation | string> {
  if (!isClientFormToken(token)) return "Tautan tidak valid.";
  const form = await clientFormByToken(token);
  if (!form) return "Tautan tidak ditemukan.";
  const availability = clientFormAvailability(form);
  return availability === "open" ? form : CLOSED[availability];
}

export async function saveClientDraftAction(token: string, content: unknown, guests: unknown): Promise<ActionResult> {
  return attempt(async () => {
    if (!draftLimiter.check(await rateKey(String(token)))) return failure(TOO_MANY);
    const form = await openForm(token);
    if (typeof form === "string") return failure(form);
    const payload = readClientPayload(content, guests);
    if (!payload) return failure(TOO_BIG);
    if (!(await saveClientDraft(form.id, payload.content, payload.guests))) return failure(CLOSED.revoked);
    return success(undefined);
  });
}

export interface ClientSubmitResult {
  /** Baris tamu yang dilewati karena nama/kontak tidak valid atau ganda. */
  skippedGuests: number;
}

export async function submitClientFormAction(token: string, content: unknown, guests: unknown): Promise<ActionResult<ClientSubmitResult>> {
  return attempt(async () => {
    if (!submitLimiter.check(await rateKey(String(token)))) return failure(TOO_MANY);
    const form = await openForm(token);
    if (typeof form === "string") return failure(form);
    const payload = readClientPayload(content, guests);
    if (!payload) return failure(TOO_BIG);

    const prepared = prepareClientSubmission(payload.content, payload.guests);
    if (!prepared.ok) {
      // Simpan apa adanya sebagai draf agar isian tidak hilang, lalu tunjukkan isian yang perlu diperbaiki.
      await saveClientDraft(form.id, payload.content, payload.guests);
      return failure(prepared.error, prepared.fieldErrors);
    }
    if (!(await submitClientForm(form.id, prepared.content, payload.guests))) return failure(CLOSED.revoked);
    return success({ skippedGuests: prepared.guests.invalid });
  });
}

export async function uploadClientMediaAction(token: string, data: FormData): Promise<ActionResult<{ url: string }>> {
  return attempt(async () => {
    if (!uploadLimiter.check(await rateKey(String(token)))) return failure(TOO_MANY);
    const form = await openForm(token);
    if (typeof form === "string") return failure(form);
    const file = data.get("file");
    const kind: MediaKind = data.get("kind") === "audio" ? "audio" : "image";
    if (!(file instanceof File)) return failure("Pilih file terlebih dahulu.");
    const result = await uploadMedia(`${form.invitation_id}/klien`, file, kind);
    return result.ok ? success({ url: result.url }) : failure(result.error);
  });
}
