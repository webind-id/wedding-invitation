/**
 * Impor/ekspor daftar tamu dalam CSV tanpa dependensi tambahan. Mendukung
 * pemisah koma maupun titik koma (ekspor Excel berlocale Indonesia).
 */

export interface CsvGuestRow {
  name: string;
  contact: string;
  inviter: string;
}

const HEADER_ALIASES: Record<keyof CsvGuestRow, string[]> = {
  name: ["nama", "name", "nama tamu", "tamu"],
  contact: ["kontak", "contact", "wa", "whatsapp", "no hp", "nomor", "hp", "telepon", "instagram", "ig"],
  inviter: ["pengundang", "inviter", "dari", "diundang oleh"],
};

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
  return header.findIndex((h) => HEADER_ALIASES[key].includes(h.toLowerCase()));
}

/** Ubah CSV jadi baris tamu. Tanpa header dikenali: kolom A=nama, B=kontak, C=pengundang. */
export function csvToGuests(text: string): CsvGuestRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const header = rows[0];
  const cols = {
    name: findColumn(header, "name"),
    contact: findColumn(header, "contact"),
    inviter: findColumn(header, "inviter"),
  };
  const hasHeader = Object.values(cols).some((i) => i !== -1);
  const body = hasHeader ? rows.slice(1) : rows;
  const at = (r: string[], i: number, fallback: number) => r[i !== -1 ? i : fallback] ?? "";

  return body
    .map((r) => ({
      name: at(r, cols.name, 0),
      contact: at(r, cols.contact, 1),
      inviter: at(r, cols.inviter, 2),
    }))
    .filter((g) => g.name || g.contact);
}

function escapeCell(value: string): string {
  // Cegah formula injection saat dibuka di Excel/Sheets.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",;\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function toCsv(header: string[], rows: string[][]): string {
  return [header, ...rows].map((r) => r.map(escapeCell).join(",")).join("\n");
}
