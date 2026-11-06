/** Unduh teks sebagai file di browser. BOM ditambahkan agar Excel membaca UTF-8 dengan benar. */
export function downloadFile(filename: string, content: string, mime = "text/csv;charset=utf-8"): void {
  const url = URL.createObjectURL(new Blob(["﻿", content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
