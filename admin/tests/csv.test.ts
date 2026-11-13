import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { csvToGuests, parseCsv, toCsv } from "@/lib/csv";
import { spreadsheetToGuests } from "@/lib/spreadsheet";

describe("parseCsv", () => {
  it("handles quoted cells, escaped quotes and CRLF", () => {
    expect(parseCsv('a,"b, c","say ""hi"""\r\n1,2,3\r\n')).toEqual([
      ["a", "b, c", 'say "hi"'],
      ["1", "2", "3"],
    ]);
  });

  it("detects semicolon delimiters", () => {
    expect(parseCsv("Nama;Kontak\nBudi;0812")).toEqual([
      ["Nama", "Kontak"],
      ["Budi", "0812"],
    ]);
  });

  it("drops blank lines", () => {
    expect(parseCsv("a\n\n\nb")).toEqual([["a"], ["b"]]);
  });
});

describe("csvToGuests", () => {
  it("maps columns by header alias in any order", () => {
    expect(csvToGuests("Pengundang,WA,Nama\nCahya,0812,Budi")).toEqual([
      { name: "Budi", contact: "0812", inviter: "Cahya" },
    ]);
  });

  it("falls back to positional columns without a header", () => {
    expect(csvToGuests("Budi,0812\nSiti,@siti,Wahyu")).toEqual([
      { name: "Budi", contact: "0812", inviter: "" },
      { name: "Siti", contact: "@siti", inviter: "Wahyu" },
    ]);
  });

  it("returns an empty list for empty text", () => {
    expect(csvToGuests("")).toEqual([]);
  });

  it("normalizes different header names and ignores extra columns", () => {
    expect(csvToGuests("ID,Guest Full Name,Nomor WhatsApp,Catatan\n1,Budi Santoso,0812,VIP")).toEqual([
      { name: "Budi Santoso", contact: "0812", inviter: "" },
    ]);
  });

  it("infers a contact column when only another known header exists", () => {
    expect(csvToGuests("Nama,Catatan,Nomor\nBudi,VIP,0812")).toEqual([
      { name: "Budi", contact: "0812", inviter: "" },
    ]);
  });
});

describe("toCsv", () => {
  it("quotes special characters and neutralises formulas", () => {
    expect(toCsv(["Nama", "Catatan"], [["Budi, S.T.", "=SUM(A1)"]])).toBe('Nama,Catatan\n"Budi, S.T.",\'=SUM(A1)');
  });
});

describe("export → import round trip", () => {
  it("re-imports exported contacts unchanged", () => {
    const csv = toCsv(["Nama", "Kontak", "Saluran", "Pengundang"], [["Budi", "6281234567890", "WhatsApp", "Cahya"]]);
    expect(csvToGuests(csv)).toEqual([{ name: "Budi", contact: "6281234567890", inviter: "Cahya" }]);
  });
});

describe("spreadsheetToGuests", () => {
  it("reads the first Excel sheet and maps headers", () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Nama", "Kontak", "Pengundang"],
      ["Budi", "0812", "Cahya"],
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Tamu");
    const data = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

    expect(spreadsheetToGuests(data)).toEqual([{ name: "Budi", contact: "0812", inviter: "Cahya" }]);
  });
});
