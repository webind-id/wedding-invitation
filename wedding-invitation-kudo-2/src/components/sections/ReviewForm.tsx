"use client";

import { useState, type FormEvent } from "react";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import {
  ATTENDANCE,
  ATTENDANCE_LABEL,
  LIMITS,
  validateGuestbookInput,
  type Attendance,
  type GuestbookEntry,
} from "@/lib/guestbook";

interface ReviewFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

/** Form RSVP bergaris bawah (tanpa kotak) — tenang dan tidak berat di latar gelap. */
export function ReviewForm({ slug, defaultName, onSubmitted }: ReviewFormProps) {
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
      <div className="border border-gold/30 p-8 text-center">
        <p className="font-display text-3xl italic text-gold">Terima kasih, {name}.</p>
        <p className="mt-3 text-sm text-smoke">Konfirmasi dan doa Anda sudah kami terima.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-line mt-6">
          Kirim ucapan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <label className="block">
        <span className="credit text-ivory/60">Nama</span>
        <input className="input-noir" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.nameMax} autoComplete="name" required />
      </label>

      <fieldset>
        <legend className="credit mb-3 text-ivory/60">Kehadiran</legend>
        <div className="grid grid-cols-3 gap-2">
          {ATTENDANCE.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer border px-2 py-3 text-center text-[0.64rem] uppercase tracking-[0.18em] transition has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-gold",
                attendance === value ? "border-gold bg-gold text-void" : "border-ivory/20 text-ivory/70 hover:border-gold/60",
              )}
            >
              <input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} className="sr-only" />
              {ATTENDANCE_LABEL[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "hadir" && (
        <label className="block">
          <span className="credit text-ivory/60">Jumlah tamu</span>
          <select className="input-noir [&>option]:bg-onyx" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
            {PARTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="credit flex justify-between text-ivory/60">
          Ucapan &amp; doa
          <span className="tracking-normal text-smoke">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea
          className="input-noir min-h-28 resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.messageMax}
          placeholder="Tuliskan doa terbaik untuk kami…"
        />
      </label>

      {/* Honeypot — tersembunyi dari manusia & pembaca layar. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error && (
        <p role="alert" className="border-l-2 border-ember bg-ember/20 px-4 py-2.5 text-xs text-ivory">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-gold w-full">
        {status === "sending" ? "Mengirim…" : "Kirim ucapan"}
      </button>
    </form>
  );
}
