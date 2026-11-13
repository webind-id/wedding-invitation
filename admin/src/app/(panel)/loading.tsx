import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Tampil seketika saat pindah halaman di panel, selama server memuat data.
 * Tiruan bentuk halaman (judul, kartu ringkasan, daftar) — teksnya tidak terlihat,
 * hanya dipakai phantom-ui untuk menggambar shimmer di posisi yang sama.
 */
export default function PanelLoading() {
  return (
    <Skeleton label="Memuat halaman…">
      <header className="mb-8">
        <p className="eyebrow w-fit">Memuat</p>
        <h1 className="mt-1 w-fit font-display text-3xl italic sm:text-4xl">Judul halaman</h1>
        <p className="mt-1.5 w-fit text-sm text-muted">Keterangan singkat halaman ini</p>
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {["Undangan", "Template", "Konfirmasi", "Terkirim"].map((label) => (
          <div key={label} className="card p-5">
            <p className="w-fit text-xs">{label}</p>
            <p className="mt-2 w-fit font-display text-4xl">000</p>
            <p className="mt-1 w-fit text-xs">keterangan angka</p>
          </div>
        ))}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <p className="w-fit font-semibold">Daftar terbaru</p>
        </div>
        <ul className="divide-y divide-line">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="w-fit font-semibold">Judul undangan contoh</p>
                <p className="w-fit text-xs">/slug-undangan · Nama template</p>
              </div>
              <span className="text-xs">Terbit</span>
              <span className="hidden text-xs sm:block">12 Jun 2027, 08.00</span>
            </li>
          ))}
        </ul>
      </section>
    </Skeleton>
  );
}
