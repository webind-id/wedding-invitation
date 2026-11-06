import { Sprig } from "@/components/ui/Sprig";

export default function NotFound() {
  return (
    <main className="grain flex min-h-screen flex-col items-center justify-center bg-forest px-6 text-center text-linen">
      <Sprig className="h-32 w-24 text-sage/40" />
      <h1 className="mt-6 font-display text-4xl font-light italic">Undangan tidak ditemukan</h1>
      <p className="mt-3 max-w-xs text-sm text-linen/70">
        Tautan mungkin salah ketik, atau undangan belum diterbitkan. Silakan hubungi pengirim undangan.
      </p>
    </main>
  );
}
