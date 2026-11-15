import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import {
  EMPTY_SUMMARY,
  validateGuestbookInput,
  type GuestbookEntry,
  type GuestbookPage,
  type GuestbookSummary,
} from "@/lib/guestbook";
import { publishedInvitationId } from "@/lib/invitation";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { db } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const MAX_OFFSET = 5_000;
const COLUMNS = "id, name, attendance, party_size, message, created_at";
const NOT_READY = "Buku tamu belum aktif.";
const NOT_FOUND = "Undangan tidak ditemukan.";

// 4 kiriman per 10 menit per IP.
const limiter = createRateLimiter(4, 10 * 60 * 1000);

/** GET /api/ucapan?slug=Cahya-Wahyu&offset=0 */
export async function GET(req: NextRequest) {
  const client = db();
  if (!client) return fail(NOT_READY, 503);

  const invitationId = await publishedInvitationId(req.nextUrl.searchParams.get("slug") ?? "");
  if (!invitationId) return fail(NOT_FOUND, 404);

  const rawOffset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
  const offset = Number.isInteger(rawOffset) ? Math.min(Math.max(rawOffset, 0), MAX_OFFSET) : 0;

  const [list, stats] = await Promise.all([
    client
      .from("guestbook")
      .select(COLUMNS, { count: "exact" })
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1),
    client
      .from("guestbook_summary")
      .select("hadir, tidak_hadir, ragu, heads")
      .eq("invitation_id", invitationId)
      .maybeSingle(),
  ]);

  if (list.error || stats.error) {
    console.error("[ucapan] gagal membaca", list.error ?? stats.error);
    return fail("Gagal memuat ucapan.", 500);
  }

  return ok<GuestbookPage>({
    entries: list.data as GuestbookEntry[],
    summary: (stats.data as GuestbookSummary | null) ?? EMPTY_SUMMARY,
    total: list.count ?? 0,
    pageSize: PAGE_SIZE,
  });
}

/** POST /api/ucapan  { slug, name, attendance, partySize, message, website } */
export async function POST(req: NextRequest) {
  const client = db();
  if (!client) return fail(NOT_READY, 503);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  // Honeypot: bot yang mengisi field tersembunyi dianggap "berhasil" tanpa disimpan.
  if (body && typeof body.website === "string" && body.website.length > 0) {
    return ok({ entry: null }, { status: 201 });
  }

  if (!limiter.check(clientIp(req.headers))) {
    return fail("Terlalu banyak kiriman. Coba lagi beberapa menit lagi.", 429);
  }

  const result = validateGuestbookInput(body);
  if (!result.ok) return fail(result.error, 400);

  // Hanya undangan terbit yang menerima ucapan — draft/pratinjau tidak.
  const invitationId = await publishedInvitationId(typeof body?.slug === "string" ? body.slug : "");
  if (!invitationId) return fail(NOT_FOUND, 404);

  const { name, attendance, partySize, message } = result.value;
  const { data, error } = await client
    .from("guestbook")
    .insert({ invitation_id: invitationId, name, attendance, party_size: partySize, message })
    .select(COLUMNS)
    .single();

  if (error) {
    console.error("[ucapan] gagal menyimpan", error);
    return fail("Gagal menyimpan ucapan. Coba lagi.", 500);
  }
  return ok({ entry: data as GuestbookEntry }, { status: 201 });
}
