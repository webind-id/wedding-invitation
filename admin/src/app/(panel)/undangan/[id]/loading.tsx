import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Tampil saat berpindah tab undangan (Konten, Tamu, Ucapan, Pengaturan). Header undangan
 * dari layout tetap terlihat; hanya isi tab yang diganti kerangka shimmer.
 */
export default function InvitationTabLoading() {
  return (
    <Skeleton label="Memuat isi undangan…">
      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <section className="card space-y-4 p-5">
          <p className="w-fit font-semibold">Bagian samping</p>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <p className="label w-fit">Label isian</p>
              <div className="input mt-1.5">Isian contoh</div>
            </div>
          ))}
          <div className="input h-24">Area teks contoh</div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-3">
            <p className="mr-auto font-display text-2xl">0 / 00</p>
            <span className="btn-outline btn-sm">Tombol</span>
            <span className="btn-outline btn-sm">Tombol</span>
          </div>
          <div className="input mt-5">Cari…</div>
          <ul className="mt-4 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="w-fit font-semibold">Nama tamu undangan</p>
                  <p className="w-fit text-xs">+62 812 0000 0000</p>
                </div>
                <span className="text-xs">aksi</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Skeleton>
  );
}
