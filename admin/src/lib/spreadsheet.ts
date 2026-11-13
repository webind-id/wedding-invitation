import * as XLSX from "xlsx";
import { rowsToGuests, type CsvGuestRow } from "./csv";

/** Membaca sheet pertama Excel dengan pemetaan kolom yang sama seperti impor CSV. */
export function spreadsheetToGuests(data: ArrayBuffer): CsvGuestRow[] {
  const workbook = XLSX.read(data, { type: "array", cellText: true, cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ""];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });
  return rowsToGuests(
    rows.map((row) => row.map((cell) => (typeof cell === "string" ? cell : String(cell ?? "")))),
  );
}
