export default function NotFound() {
  return (
    <main className="pixel-paper grid min-h-[100svh] place-items-center px-6 text-center">
      <div className="pixel-card max-w-md p-8">
        <span className="pixel-badge mb-4">ERROR 404</span>
        <h1 className="mt-2 font-pixel text-2xl md:text-3xl font-bold text-ink">Undangan Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-ink-muted">
          Periksa kembali tautan undangan Anda, atau hubungi calon pengantin yang mengirimkannya.
        </p>
      </div>
    </main>
  );
}
