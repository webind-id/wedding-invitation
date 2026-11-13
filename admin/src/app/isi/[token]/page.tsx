import type { Metadata } from "next";
import { ClientForm } from "@/components/client-form/ClientForm";
import { clientFormAvailability, isClientFormToken, readClientPayload, restoreDraft } from "@/lib/client-form";
import { formatDateTime } from "@/lib/format";
import { clientFormByToken } from "@/lib/repo/client-forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formulir data undangan",
  // Tautan rahasia: jangan diindeks, jangan bocorkan URL lewat Referer.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const CLOSED: Record<"invalid" | "expired" | "revoked" | "imported", { title: string; body: string }> = {
  invalid: { title: "Tautan tidak ditemukan", body: "Periksa kembali tautan yang Anda terima, atau minta tautan baru ke admin." },
  expired: { title: "Tautan sudah kedaluwarsa", body: "Masa berlaku tautan ini sudah habis. Minta tautan baru ke admin — isian yang sudah tersimpan tidak hilang." },
  revoked: { title: "Tautan sudah tidak berlaku", body: "Admin sudah membuat tautan baru. Gunakan tautan terbaru yang dikirim ke Anda." },
  imported: { title: "Data sudah diproses", body: "Terima kasih! Data Anda sudah dipasang di undangan. Hubungi admin bila ada perubahan." },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-10 pt-8 sm:pt-12">
      <p className="eyebrow">Kudo · Formulir undangan</p>
      {children}
    </main>
  );
}

function Closed({ reason }: { reason: keyof typeof CLOSED }) {
  return (
    <Shell>
      <section className="card mt-6 p-8 text-center">
        <h1 className="font-display text-3xl italic">{CLOSED[reason].title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">{CLOSED[reason].body}</p>
      </section>
    </Shell>
  );
}

export default async function ClientFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isClientFormToken(token)) return <Closed reason="invalid" />;
  const form = await clientFormByToken(token);
  if (!form) return <Closed reason="invalid" />;
  const availability = clientFormAvailability(form);
  if (availability !== "open") return <Closed reason={availability} />;

  const initialContent = restoreDraft(form.draft, form.invitation.content);
  const initialGuests = readClientPayload({}, form.guests)?.guests ?? [];

  return (
    <Shell>
      <header className="mb-6 mt-2">
        <h1 className="font-display text-3xl italic sm:text-4xl">Lengkapi data undangan</h1>
        <p className="mt-2 text-sm text-muted">
          Untuk undangan <b className="text-ink">{form.invitation.title}</b>. Isi tiap bagian, simpan draf kapan saja, lalu kirim ke admin. Tautan
          berlaku sampai {formatDateTime(form.expires_at)}.
        </p>
        <p className="mt-2 text-xs text-muted">Isian yang sudah ada adalah contoh atau isian sebelumnya — silakan ganti dengan data Anda.</p>
      </header>
      <ClientForm token={token} initialContent={initialContent} initialGuests={initialGuests} wasSubmitted={form.status === "submitted"} />
    </Shell>
  );
}
