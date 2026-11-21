import { describe, expect, it } from "vitest";
import { checkGuestFile, formatFileSize, GUEST_FILE_MAX_BYTES, guestFileInfo, readGuestFile, safeFileName } from "@/lib/guest-file";

const bytes = (...v: number[]) => new Uint8Array(v);
const text = (s: string) => new TextEncoder().encode(s);
const ZIP = bytes(0x50, 0x4b, 0x03, 0x04, 0x14, 0x00);
const OLE = bytes(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00);

describe("checkGuestFile", () => {
  it("accepts Excel and CSV by extension + content", () => {
    expect(checkGuestFile("Tamu.XLSX", 100, ZIP)).toMatchObject({ ok: true, ext: "xlsx" });
    expect(checkGuestFile("tamu lama.xls", 100, OLE)).toMatchObject({ ok: true, ext: "xls", mime: "application/vnd.ms-excel" });
    // CSV berantakan tetap diterima — isinya tidak dikoreksi.
    expect(checkGuestFile("tamu.csv", 100, text("Nama;No HP\nPak Budi ;  0812\n\n,,,\n"))).toMatchObject({ ok: true, ext: "csv", mime: "text/csv" });
  });

  it("rejects other formats and disguised files", () => {
    expect(checkGuestFile("tamu.pdf", 100, text("%PDF"))).toMatchObject({ ok: false });
    expect(checkGuestFile("tamu", 100, text("a,b"))).toMatchObject({ ok: false });
    expect(checkGuestFile("tamu.xlsx", 100, text("Nama,HP"))).toMatchObject({ ok: false, error: expect.stringContaining("tidak sesuai") });
    expect(checkGuestFile("tamu.csv", 100, ZIP)).toMatchObject({ ok: false });
    expect(checkGuestFile("tamu.csv", 100, bytes(0x4e, 0x00, 0x61))).toMatchObject({ ok: false });
  });

  it("enforces size limits", () => {
    expect(checkGuestFile("tamu.csv", 0, text(""))).toEqual({ ok: false, error: "File kosong." });
    expect(checkGuestFile("tamu.csv", GUEST_FILE_MAX_BYTES + 1, text("a"))).toMatchObject({ ok: false, error: expect.stringContaining("5 MB") });
  });
});

describe("safeFileName", () => {
  it("strips folders and control characters, keeps the checked extension", () => {
    expect(safeFileName("C:\\Users\\a\\Daftar Tamu.xlsx", "xlsx")).toBe("Daftar Tamu.xlsx");
    expect(safeFileName('../../"evil"\n.csv', "csv")).toBe("evil.csv");
    expect(safeFileName(".csv", "csv")).toBe("daftar-tamu.csv");
    expect(safeFileName(`${"a".repeat(300)}.xls`, "xls")).toHaveLength(114);
  });
});

describe("readGuestFile / guestFileInfo", () => {
  it("reads valid metadata and hides the storage path", () => {
    const meta = readGuestFile({ path: "inv/form/x.csv", name: "tamu.csv", size: 12, mime: "text/csv", uploaded_at: "2026-11-21T00:00:00Z" });
    expect(meta?.path).toBe("inv/form/x.csv");
    expect(guestFileInfo(meta)).toEqual({ name: "tamu.csv", size: 12, uploadedAt: "2026-11-21T00:00:00Z" });
    expect(readGuestFile(null)).toBeNull();
    expect(readGuestFile({ name: "x" })).toBeNull();
    expect(readGuestFile([])).toBeNull();
    expect(guestFileInfo(null)).toBeNull();
  });

  it("formats sizes", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2 KB");
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1,5 MB");
  });
});
