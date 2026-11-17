export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div className="kawung-bg w-full max-w-sm rounded-t-[170px] rounded-b-3xl bg-ivory px-8 pb-10 pt-14 shadow-[0_0_0_6px_#2E1E12,0_0_0_7px_#CEAC59,0_18px_40px_rgba(0,0,0,0.35)]">
        <svg viewBox="0 0 200 300" className="mx-auto mb-3 h-[72px] w-12" aria-hidden>
          <path d="M100 4 C118 46 168 104 184 176 C192 214 186 250 172 282 L28 282 C14 250 8 214 16 176 C32 104 82 46 100 4Z" fill="#CEAC59" stroke="#4E3421" strokeWidth="4" />
          <path d="M72 282 V236 Q72 218 100 214 Q128 218 128 236 V282Z" fill="#3A2618" />
        </svg>
        <p className="font-sans text-[10px] uppercase tracking-[4px] text-gold-600">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold uppercase tracking-[3px] text-sogan-800">Undangan Tidak Ditemukan</h1>
        <p className="mt-3 font-sans text-xs leading-relaxed text-sogan-500">
          Periksa kembali tautan undangan Anda, atau hubungi calon pengantin yang mengirimkannya.
        </p>
      </div>
    </main>
  );
}
