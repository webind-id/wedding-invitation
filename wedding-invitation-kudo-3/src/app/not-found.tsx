export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,42,32,0.55)_0%,rgba(10,9,8,1)_70%)]" />
      <div className="relative">
        <p className="kicker">Layar memudar</p>
        <h1 className="mt-5 font-serif text-[clamp(2.8rem,9vw,5.5rem)] leading-[0.95]">
          Undangan <em className="text-bronze">tidak ditemukan</em>
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
          Tautan mungkin salah ketik, atau undangan belum diterbitkan. Silakan hubungi pengirim undangan.
        </p>
      </div>
    </main>
  );
}
