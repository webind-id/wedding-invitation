/**
 * ─────────────────────────────────────────────────────────────────────
 *  KONTRAK KONTEN UNDANGAN — dibagikan ke semua template.
 *  Sumber asli: admin/src/shared/. Jangan edit salinannya di template;
 *  ubah di admin lalu jalankan `npm run shared:sync` dari folder admin.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Satu bentuk data untuk semua template, sehingga satu undangan bisa
 * berpindah template tanpa diisi ulang. Template boleh mengabaikan field
 * yang tidak dipakainya.
 */
import { z } from "zod";

export const CONTENT_VERSION = 1;

export const TIME_ZONES = {
  "Asia/Jakarta": { label: "WIB", offset: "+07:00" },
  "Asia/Makassar": { label: "WITA", offset: "+08:00" },
  "Asia/Jayapura": { label: "WIT", offset: "+09:00" },
} as const;
export type TimeZone = keyof typeof TIME_ZONES;

const REQUIRED = "Wajib diisi";

const text = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`);
const required = (max: number) => text(max).min(1, REQUIRED);

/** URL media: https://… atau path lokal template (/images/…). Kosong = tidak ada. */
export const mediaUrl = text(500)
  .refine((v) => !/[\\\u0000-\u001f\s]/.test(v), "URL tidak boleh berisi spasi atau garis miring terbalik")
  .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || v.startsWith("https://"), "Harus diawali https:// atau /");

const httpsUrl = text(500).refine((v) => v === "" || v.startsWith("https://"), "Harus diawali https://");

const instagram = text(30).refine(
  (v) => v === "" || /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{1,30}$/.test(v),
  "Username Instagram tidak valid (huruf kecil, angka, titik, garis bawah)",
);

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/;
const isoDate = z
  .string()
  .refine((v) => ISO_WITH_OFFSET.test(v) && !Number.isNaN(Date.parse(v)), "Tanggal & jam tidak valid");

export const personSchema = z.object({
  nickname: required(30),
  fullName: required(80),
  title: text(40),
  childOrder: required(60),
  father: required(80),
  mother: required(80),
  instagram,
  photo: mediaUrl,
});

export const eventSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{1,40}$/, "ID acara tidak valid"),
    name: required(60),
    start: isoDate,
    end: isoDate,
    venue: required(120),
    address: required(200),
    mapsUrl: httpsUrl,
    note: text(120),
  })
  .refine((e) => Date.parse(e.end) > Date.parse(e.start), { message: "Jam selesai harus setelah jam mulai", path: ["end"] });

export const storyChapterSchema = z.object({
  year: required(10),
  title: required(80),
  text: required(400),
});

export const momentSchema = z.object({
  src: mediaUrl.refine((v) => v !== "", REQUIRED),
  alt: text(120),
  shape: z.enum(["tall", "wide", "square"]),
});

export const giftAccountSchema = z.object({
  provider: required(60),
  kind: z.enum(["bank", "ewallet"]),
  holder: required(80),
  number: required(40).regex(/^[0-9 \-]+$/, "Hanya angka, spasi, atau tanda -"),
});

export const shippingSchema = z.object({
  recipient: required(80),
  phone: text(20),
  address: required(300),
});

export const invitationContentSchema = z.object({
  version: z.literal(CONTENT_VERSION),
  bride: personSchema,
  groom: personSchema,
  headlineOrder: z.enum(["bride-first", "groom-first"]),
  timeZone: z.enum(Object.keys(TIME_ZONES) as [TimeZone, ...TimeZone[]]),
  defaultGuest: required(60),
  coverPhoto: mediaUrl,
  posterPhoto: mediaUrl,
  music: mediaUrl,
  verse: z.object({ arabic: text(1000), translation: text(1000), source: text(80) }),
  invitationIntro: text(400),
  events: z.array(eventSchema).min(1, "Minimal satu acara").max(6, "Maksimal 6 acara"),
  story: z.array(storyChapterSchema).max(12, "Maksimal 12 bab"),
  moments: z.array(momentSchema).max(30, "Maksimal 30 foto"),
  gift: z.object({
    intro: text(400),
    accounts: z.array(giftAccountSchema).max(6, "Maksimal 6 rekening"),
    shipping: shippingSchema.nullable(),
  }),
  closing: z.object({ message: text(400), signature: text(80) }),
  seo: z.object({ title: text(120), description: text(300) }),
});

export type InvitationContent = z.infer<typeof invitationContentSchema>;
export type Person = z.infer<typeof personSchema>;
export type WeddingEvent = z.infer<typeof eventSchema>;
export type StoryChapter = z.infer<typeof storyChapterSchema>;
export type Moment = z.infer<typeof momentSchema>;
export type GiftAccount = z.infer<typeof giftAccountSchema>;
export type GiftShipping = z.infer<typeof shippingSchema>;

/** Pasangan nama sesuai urutan headline. */
export function couplePair(content: Pick<InvitationContent, "bride" | "groom" | "headlineOrder">): [Person, Person] {
  return content.headlineOrder === "bride-first" ? [content.bride, content.groom] : [content.groom, content.bride];
}

export function coupleLabel(content: Pick<InvitationContent, "bride" | "groom" | "headlineOrder">): string {
  const [a, b] = couplePair(content);
  return `${a.nickname} & ${b.nickname}`;
}

/** Peta error zod → { "events.0.name": "Wajib diisi" } untuk ditampilkan per field. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}

// ── Konversi waktu untuk input datetime-local ─────────────────────────
// Zona waktu Indonesia tidak memakai DST, jadi offset tetap.

const OFFSET_MS: Record<TimeZone, number> = {
  "Asia/Jakarta": 7 * 3_600_000,
  "Asia/Makassar": 8 * 3_600_000,
  "Asia/Jayapura": 9 * 3_600_000,
};

/** ISO apa pun → "2027-06-12T08:00" sesuai jam dinding zona tersebut. */
export function toLocalInput(iso: string, tz: TimeZone): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  return new Date(ms + OFFSET_MS[tz]).toISOString().slice(0, 16);
}

/** "2027-06-12T08:00" (jam dinding) → "2027-06-12T08:00:00+07:00". */
export function fromLocalInput(local: string, tz: TimeZone): string {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local) ? `${local}:00${TIME_ZONES[tz].offset}` : local;
}
