"use client";

import { AlertTriangle } from "lucide-react";

export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Di produksi Next.js menyembunyikan pesan asli; tampilkan yang aman saja.
  const message = error.message?.startsWith("Gagal") || error.message?.startsWith("Server belum")
    ? error.message
    : "Terjadi kesalahan saat memuat halaman.";

  return (
    <div className="card mx-auto mt-10 max-w-lg p-8 text-center">
      <AlertTriangle className="mx-auto h-7 w-7 text-clay" aria-hidden />
      <p className="mt-3 font-display text-xl italic">Ada yang tidak beres</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <button type="button" onClick={reset} className="btn-outline mt-5">
        Coba lagi
      </button>
    </div>
  );
}
