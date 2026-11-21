"use client";

import { FileSpreadsheet, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { removeClientGuestFileAction, uploadClientGuestFileAction } from "@/app/isi/[token]/actions";
import { formatDateTime } from "@/lib/format";
import { formatFileSize, GUEST_FILE_ACCEPT, GUEST_FILE_MAX_BYTES, type GuestFileInfo } from "@/lib/guest-file";

/**
 * Unggah daftar tamu sebagai file Excel/CSV. File dikirim ke admin apa adanya (tidak dibaca
 * atau dirapikan di sini) dan langsung tersimpan — tidak menunggu "Simpan draf".
 */
export function ClientGuestFile({ token, initial }: { token: string; initial: GuestFileInfo | null }) {
  const [file, setFile] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, startBusy] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function upload(picked: File | undefined) {
    if (!picked) return;
    setError(null);
    if (picked.size > GUEST_FILE_MAX_BYTES) return setError(`Ukuran file maksimal ${GUEST_FILE_MAX_BYTES / 1024 / 1024} MB.`);
    const data = new FormData();
    data.set("file", picked);
    startBusy(async () => {
      const result = await uploadClientGuestFileAction(token, data);
      if (result.ok) setFile(result.data);
      else setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function remove() {
    if (!window.confirm("Hapus file daftar tamu yang sudah diunggah?")) return;
    setError(null);
    startBusy(async () => {
      const result = await removeClientGuestFileAction(token);
      if (result.ok) setFile(null);
      else setError(result.error);
    });
  }

  return (
    <div className="rounded-xl border border-dashed border-line bg-paper/60 p-4">
      <p className="label mb-0.5">Punya daftar tamu di Excel atau CSV?</p>
      <p className="hint mt-0">
        Unggah filenya saja (.xlsx, .xls, atau .csv, maks. 5 MB) — tidak perlu dirapikan, admin akan memprosesnya. File langsung tersimpan.
      </p>

      {file && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-3.5 py-2.5">
          <FileSpreadsheet className="h-5 w-5 shrink-0 text-moss" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted">
              {formatFileSize(file.size)}
              {file.uploadedAt && ` · diunggah ${formatDateTime(file.uploadedAt)}`}
            </p>
          </div>
          <button type="button" onClick={remove} disabled={isBusy} className="btn-outline btn-sm" aria-label={`Hapus file ${file.name}`}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Hapus
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id="file-tamu"
        type="file"
        accept={GUEST_FILE_ACCEPT}
        className="sr-only"
        onChange={(e) => upload(e.target.files?.[0])}
        disabled={isBusy}
      />
      <label htmlFor="file-tamu" className={`btn-outline btn-sm mt-3 cursor-pointer ${isBusy ? "pointer-events-none opacity-50" : ""}`}>
        <Upload className="h-3.5 w-3.5" aria-hidden /> {isBusy ? "Mengunggah…" : file ? "Ganti file" : "Unggah file Excel / CSV"}
      </label>

      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
    </div>
  );
}
