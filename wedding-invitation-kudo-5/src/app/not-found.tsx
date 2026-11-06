export default function NotFound() {
  return (
    <main className="paper flex min-h-screen items-center justify-center bg-antique px-4">
      <div className="w-full max-w-lg bg-antique p-2 ring-1 ring-burgundy/60">
        <div className="border-[3px] border-double border-burgundy/55 px-8 py-14 text-center">
          <p className="font-fell-sc text-[0.95rem] tracking-[0.14em] text-umber">Mohon maaf</p>
          <h1 className="mt-4 font-fell text-4xl leading-tight text-burgundy sm:text-5xl">Undangan tidak ditemukan</h1>
          <p className="mx-auto mt-6 max-w-sm font-serif text-lg italic leading-relaxed text-umber">
            Tautan mungkin salah ketik, atau undangan belum diterbitkan. Silakan hubungi pengirim undangan.
          </p>
        </div>
      </div>
    </main>
  );
}
