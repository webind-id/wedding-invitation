import { Lantern3D } from "@/components/lantern/Lantern3D";

export default function NotFound() {
  return (
    <main className="night-sky grid min-h-[100svh] place-items-center px-6 text-center">
      <div className="glass-night max-w-md px-8 pb-8 pt-16">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Lantern3D size={52} variant="crimson" spin={20} />
        </div>
        <span className="badge-gold mb-4">404</span>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-moon">Undangan Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-moon-muted">
          Periksa kembali tautan undangan Anda, atau hubungi calon pengantin yang mengirimkannya.
        </p>
      </div>
    </main>
  );
}
