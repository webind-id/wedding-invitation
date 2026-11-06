export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <div className="border-y border-ink py-12">
        <p className="rubric">Halaman tidak tersedia</p>
        <h1 className="mt-6 font-serif text-[clamp(3rem,9vw,6rem)] font-light leading-[0.95] tracking-[-0.03em]">
          Edisi ini <em>tidak ditemukan</em>
        </h1>
        <p className="mt-6 max-w-md font-serif text-lg italic text-stone">
          Tautan mungkin salah ketik, atau undangan belum diterbitkan. Silakan hubungi pengirim undangan.
        </p>
      </div>
    </main>
  );
}
