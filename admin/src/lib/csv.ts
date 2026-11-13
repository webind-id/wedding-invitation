/**
 * Impor/ekspor daftar tamu dalam CSV. Mendukung pemisah koma maupun titik
 * koma (ekspor Excel berlocale Indonesia).
 */

import { parseContact } from "./contact";

export interface CsvGuestRow {
  name: string;
  contact: string;
  inviter: string;
}

const HEADER_ALIASES: Record<keyof CsvGuestRow, string[]> = {
  name: ["nama", "name", "nama tamu", "nama lengkap", "tamu", "guest", "guest name", "full name", "invitee", "penerima"],
  contact: [
    "kontak",
    "contact",
    "wa",
    "whatsapp",
    "no hp",
    "nomor",
    "nomor hp",
    "nomor wa",
    "phone",
    "phone number",
    "mobile",
    "mobile number",
    "telepon",
    "instagram",
    "ig",
    "username",
  ],
  inviter: ["pengundang", "inviter", "dari", "diundang oleh", "invited by", "keluarga", "pihak"],
};

function normalizeHeader(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\uFEFF/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Pecah teks CSV jadi baris-baris sel, menghormati tanda kutip ganda. */
export function parseCsv(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell.trim());
  rows.push(row);

  return rows.filter((r) => r.some((c) => c !== ""));
}

function findColumn(header: string[], key: keyof CsvGuestRow): number {
  const aliases = HEADER_ALIASES[key].map(normalizeHeader);
  return header.findIndex((value) => {
    const candidate = normalizeHeader(value);
    return aliases.some((alias) => candidate === alias || (alias.length >= 4 && candidate.includes(alias)));
  });
}

function inferColumn(rows: string[][], key: keyof CsvGuestRow, excluded: Set<number>): number {
  if (key === "contact") {
    return rows[0]?.findIndex((_, index) => {
      if (excluded.has(index)) return false;
      const values = rows.slice(0, 10).map((row) => row[index] ?? "").filter(Boolean);
      return values.length > 0 && values.some((value) => parseContact(value) !== null);
    }) ?? -1;
  }
  return -1;
}

/** Ubah CSV jadi baris tamu. Tanpa header dikenali: kolom A=nama, B=kontak, C=pengundang. */
export function rowsToGuests(rows: string[][]): CsvGuestRow[] {
  if (rows.length === 0) return [];
  const header = rows[0];
  const cols = {
    name: findColumn(header, "name"),
    contact: findColumn(header, "contact"),
    inviter: findColumn(header, "inviter"),
  };
  const hasHeader = Object.values(cols).some((i) => i !== -1);
  if (hasHeader) {
    const excluded = new Set(Object.values(cols).filter((index) => index !== -1));
    if (cols.contact === -1) cols.contact = inferColumn(rows.slice(1), "contact", excluded);
  }
  const body = hasHeader ? rows.slice(1) : rows;
  const at = (r: string[], i: number, fallback: number) => r[i !== -1 ? i : fallback] ?? "";

  return body
    .map((r) => ({
      name: at(r, cols.name, hasHeader ? -1 : 0),
      contact: at(r, cols.contact, hasHeader ? -1 : 1),
      inviter: at(r, cols.inviter, hasHeader ? -1 : 2),
    }))
    .filter((g) => g.name || g.contact);
}

/** Ubah CSV jadi baris tamu. Tanpa header dikenali: kolom A=nama, B=kontak, C=pengundang. */
export function csvToGuests(text: string): CsvGuestRow[] {
  return rowsToGuests(parseCsv(text));
}

function escapeCell(value: string): string {
  // Cegah formula injection saat dibuka di Excel/Sheets.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",;\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function toCsv(header: string[], rows: string[][]): string {
  return [header, ...rows].map((r) => r.map(escapeCell).join(",")).join("\n");
}
