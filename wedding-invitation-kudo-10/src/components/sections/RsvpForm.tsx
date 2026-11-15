"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { ATTENDANCE, LIMITS, validateGuestbookInput, type Attendance, type GuestbookEntry } from "@/lib/guestbook";

interface RsvpFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

const CHOICE_LABEL: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak_hadir: "Berhalangan",
  ragu: "Belum Pasti",
};

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

export function RsvpForm({ slug, defaultName, onSubmitted }: RsvpFormProps) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { name, attendance, partySize, message, website };
    const check = validateGuestbookInput(payload);
    if (!check.ok) return setError(check.error);
    setError(null);
    setStatus("sending");
    try {
      const { entry } = await requestJson<{ entry: GuestbookEntry | null }>("/api/ucapan", {
        method: "POST",
        body: JSON.stringify({ ...payload, slug }),
      });
      setStatus("sent");
      setMessage("");
      onSubmitted(entry);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Gagal mengirim. Coba lagi.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-olive-100 text-olive-700">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </div>
        <span className="badge-olive mb-2">
          BERHASIL TERKIRIM
        </span>
        <h4 className="font-serif text-2xl font-bold text-earth-ink mt-2">Terima Kasih!</h4>
        <p className="mt-2 text-sm text-earth-muted leading-relaxed">
          Konfirmasi kehadiran dan untaian doa dari <span className="font-semibold text-earth-ink">{name}</span> telah kami terima dengan penuh syukur.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-rustic-ghost text-xs mt-6"
        >
          Kirim Ucapan Lainnya
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot anti-spam */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="hp-website">Website</label>
        <input
          id="hp-website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-sans">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="rsvp-name" className="block font-sans text-xs font-semibold text-earth-ink mb-1.5 uppercase tracking-wider">
          Nama Lengkap *
        </label>
        <input
          id="rsvp-name"
          type="text"
          required
          maxLength={LIMITS.nameMax}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Budi Santoso"
          className="rustic-field text-sm"
        />
      </div>

      <div>
        <span className="block font-sans text-xs font-semibold text-earth-ink mb-2 uppercase tracking-wider">
          Konfirmasi Kehadiran *
        </span>
        <div className="grid grid-cols-3 gap-2">
          {ATTENDANCE.map((choice) => {
            const isSelected = attendance === choice;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => setAttendance(choice)}
                className={cn(
                  "rounded-xl border py-2.5 px-2 text-center font-sans text-xs font-semibold transition-all",
                  isSelected
                    ? "border-terracotta bg-terracotta text-white shadow-sm"
                    : "border-sand-deep/60 bg-white/80 text-earth-ink hover:border-terracotta/40 hover:bg-cream-50",
                )}
              >
                {CHOICE_LABEL[choice]}
              </button>
            );
          })}
        </div>
      </div>

      {attendance === "hadir" && (
        <div className="rounded-xl border border-sand-deep/50 bg-cream-50/60 p-3.5">
          <label htmlFor="rsvp-party" className="block font-sans text-xs font-semibold text-earth-ink mb-1.5 uppercase tracking-wider">
            Jumlah Tamu yang Hadir
          </label>
          <select
            id="rsvp-party"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="rustic-field text-sm bg-white"
          >
            {PARTY_OPTIONS.map((num) => (
              <option key={num} value={num}>
                {num} Orang
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="rsvp-message" className="block font-sans text-xs font-semibold text-earth-ink mb-1.5 uppercase tracking-wider">
          Ucapan &amp; Doa Restu *
        </label>
        <textarea
          id="rsvp-message"
          required
          rows={4}
          maxLength={LIMITS.messageMax}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tuliskan ucapan dan doa hangat Anda untuk kedua mempelai..."
          className="rustic-field text-sm resize-none"
        />
        <div className="mt-1 text-right text-[0.7rem] text-earth-muted">
          {message.length}/{LIMITS.messageMax}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-rustic-terracotta w-full justify-center"
      >
        <Send className="h-4 w-4" aria-hidden />
        <span>{status === "sending" ? "MENGIRIMKAN..." : "KIRIM KONFIRMASI & DOA"}</span>
      </button>
    </form>
  );
}
