export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div className="coin-bg w-full max-w-sm rounded-[26px] bg-ivory px-8 pb-10 pt-12 shadow-[0_0_0_6px_#4A0909,0_0_0_7px_#C9A24B,0_18px_40px_rgba(0,0,0,0.35)]">
        <p
          lang="zh"
          aria-hidden
          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle,#C2302A,#6E0F0F)] font-han text-3xl text-gold-300 shadow-[0_0_0_2px_#C9A24B]"
        >
          囍
        </p>
        <p className="font-sans text-[10px] uppercase tracking-[4px] text-gold-600">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold uppercase tracking-[3px] text-red-800">Undangan Tidak Ditemukan</h1>
        <p className="mt-3 font-sans text-xs leading-relaxed text-ink-500">
          Periksa kembali tautan undangan Anda, atau hubungi calon pengantin yang mengirimkannya.
        </p>
      </div>
    </main>
  );
}
