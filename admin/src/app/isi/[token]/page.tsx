import type { Metadata } from "next";
import { ClientForm } from "@/components/client-form/ClientForm";
import { clientFormAvailability, isClientFormToken, readClientPayload, restoreDraft, untouchedSinceImport } from "@/lib/client-form";
import { formatDateTime } from "@/lib/format";
import { guestFileInfo, readGuestFile } from "@/lib/guest-file";
import { clientFormByToken } from "@/lib/repo/client-forms";
import { emptyContent } from "@/shared/empty-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formulir data undangan",
  // Tautan rahasia: jangan diindeks, jangan bocorkan URL lewat Referer.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const CLOSED: Record<"invalid" | "expired" | "revoked", { title: string; body: string }> = {
  invalid: { title: "Tautan tidak ditemukan", body: "Periksa kembali tautan yang Anda terima, atau minta tautan baru ke admin." },
  expired: { title: "Tautan sudah kedaluwarsa", body: "Masa berlaku tautan ini sudah habis. Minta tautan baru ke admin — isian yang sudah tersimpan tidak hilang." },
  revoked: { title: "Tautan sudah tidak berlaku", body: "Admin sudah membuat tautan baru. Gunakan tautan terbaru yang dikirim ke Anda." },
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

  // Sudah diimpor & belum disentuh klien sejak itu → mulai dari isi undangan terbaru (termasuk perbaikan admin).
  const isRevision = form.imported_at !== null;
  const initialContent = untouchedSinceImport(form)
    ? restoreDraft(form.invitation.content, emptyContent())
    : restoreDraft(form.draft, emptyContent());
  const initialGuests = readClientPayload({}, form.guests)?.guests ?? [];
  const initialGuestFile = guestFileInfo(readGuestFile(form.guest_file));

  return (
    <Shell>
      <header className="mb-6 mt-2">
        <h1 className="font-display text-3xl italic sm:text-4xl">{isRevision ? "Revisi data undangan" : "Lengkapi data undangan"}</h1>
        <p className="mt-2 text-sm text-muted">
          Untuk undangan <b className="text-ink">{form.invitation.title}</b>. Isi tiap bagian, simpan draf kapan saja, lalu kirim ke admin. Tautan
          berlaku sampai {formatDateTime(form.expires_at)}.
        </p>
        {isRevision && (
          <p className="mt-3 rounded-xl bg-clay/10 px-4 py-3 text-sm text-ink/80">
            <b className="text-ink">Data Anda sudah dipasang di undangan.</b> Isian di bawah adalah isi undangan saat ini. Ubah bagian yang ingin
            direvisi, lalu tekan <b>Kirim ke admin</b> — admin akan meninjau revisinya lagi.
          </p>
        )}
        <p className="mt-3 rounded-xl bg-moss/10 px-4 py-3 text-sm text-ink/80">
          <b className="text-ink">Tidak harus diisi semua.</b> Tulisan samar di setiap kolom hanyalah contoh. Kosongkan yang belum Anda tahu atau
          membingungkan — tanyakan ke admin, atau biarkan admin yang mengisinya.
        </p>
      </header>
      <ClientForm token={token} initialContent={initialContent} initialGuests={initialGuests} initialGuestFile={initialGuestFile} wasSubmitted={form.status === "submitted"} isRevision={isRevision} />
    </Shell>
  );
}
