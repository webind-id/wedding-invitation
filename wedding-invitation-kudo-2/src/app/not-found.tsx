export default function NotFound() {
  return (
    <main className="film-grain flex min-h-screen flex-col items-center justify-center bg-void px-6 text-center">
      <p className="credit">Layar kosong</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,5rem)] leading-none">
        Undangan <em className="text-gold">tidak ditemukan</em>
      </h1>
      <div className="hairline mx-auto my-8 w-24" aria-hidden />
      <p className="max-w-sm text-sm leading-relaxed text-smoke">
        Tautan mungkin salah ketik, atau undangan belum diterbitkan. Silakan hubungi pengirim undangan.
      </p>
    </main>
  );
}
