/**
 * File daftar tamu yang diunggah klien di formulir (/isi/<token>): Excel atau CSV,
 * disimpan APA ADANYA — tidak dibaca, tidak dikoreksi formatnya. Admin mengunduhnya
 * dari tab "Formulir klien". Modul murni (tanpa DB/Storage) agar mudah diuji.
 *
 * Nama & MIME dari browser tidak dipercaya: jenis file ditentukan dari ekstensi DAN
 * dicocokkan dengan isi (magic bytes).
 */

export const GUEST_FILE_BUCKET = "client-files";
export const GUEST_FILE_MAX_BYTES = 5 * 1024 * 1024;
/** Berapa byte awal yang perlu dibaca checkGuestFile(). */
export const GUEST_FILE_HEAD_BYTES = 4096;
export const GUEST_FILE_ACCEPT = ".xlsx,.xls,.csv";

type GuestFileExt = "xlsx" | "xls" | "csv";

const startsWith = (b: Uint8Array, sig: number[]) => sig.every((v, i) => b[i] === v);
const ZIP = [0x50, 0x4b, 0x03, 0x04]; // .xlsx = arsip ZIP
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // .xls lama = dokumen OLE2

const TYPES: Record<GuestFileExt, { mime: string; matches: (head: Uint8Array) => boolean }> = {
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", matches: (b) => startsWith(b, ZIP) },
  xls: { mime: "application/vnd.ms-excel", matches: (b) => startsWith(b, OLE) },
  // CSV = teks: tidak boleh berisi byte NUL, dan bukan arsip/dokumen biner yang diganti namanya.
  csv: { mime: "text/csv", matches: (b) => !b.includes(0) && !startsWith(b, ZIP) && !startsWith(b, OLE) },
};

export type GuestFileCheck = { ok: true; ext: GuestFileExt; mime: string } | { ok: false; error: string };

export function checkGuestFile(name: string, size: number, head: Uint8Array): GuestFileCheck {
  const ext = /\.([a-z0-9]+)$/i.exec(name.trim())?.[1]?.toLowerCase();
  if (ext !== "xlsx" && ext !== "xls" && ext !== "csv") {
    return { ok: false, error: "Format file harus Excel (.xlsx, .xls) atau CSV (.csv)." };
  }
  if (size === 0) return { ok: false, error: "File kosong." };
  if (size > GUEST_FILE_MAX_BYTES) return { ok: false, error: `Ukuran file maksimal ${GUEST_FILE_MAX_BYTES / 1024 / 1024} MB.` };
  if (!TYPES[ext].matches(head)) return { ok: false, error: "Isi file tidak sesuai formatnya. Simpan ulang dari Excel/Sheets lalu coba lagi." };
  return { ok: true, ext, mime: TYPES[ext].mime };
}

/** Nama file untuk ditampilkan & nama unduhan: tanpa folder/karakter kontrol, maks. 120 karakter. */
export function safeFileName(name: string, ext: string): string {
  const base = name
    .split(/[\\/]/)
    .pop()!
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f"<>|:*?]/g, "")
    .trim();
  const withoutExt = base.replace(/\.[a-z0-9]+$/i, "").slice(0, 110).trim() || "daftar-tamu";
  return `${withoutExt}.${ext}`;
}

/** Isi kolom client_forms.guest_file. */
export interface GuestFileMeta {
  path: string;
  name: string;
  size: number;
  mime: string;
  uploaded_at: string;
}

/** Yang boleh dilihat klien/admin di UI (tanpa path penyimpanan). */
export interface GuestFileInfo {
  name: string;
  size: number;
  uploadedAt: string;
}

export function readGuestFile(raw: unknown): GuestFileMeta | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.path !== "string" || !r.path || typeof r.name !== "string" || typeof r.size !== "number") return null;
  return {
    path: r.path,
    name: r.name,
    size: r.size,
    mime: typeof r.mime === "string" ? r.mime : "application/octet-stream",
    uploaded_at: typeof r.uploaded_at === "string" ? r.uploaded_at : "",
  };
}

export function guestFileInfo(meta: GuestFileMeta | null): GuestFileInfo | null {
  return meta ? { name: meta.name, size: meta.size, uploadedAt: meta.uploaded_at } : null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}
