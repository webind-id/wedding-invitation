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

interface GuestbookFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

export function GuestbookForm({ slug, defaultName, onSubmitted }: GuestbookFormProps) {
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
      <div className="rounded-3xl border border-cream/10 bg-umber/30 p-8 text-center">
        <p className="font-serif text-3xl italic">Terima kasih, {name}.</p>
        <p className="mt-3 text-sm text-cream/60">Kehadiran dan doa Anda sudah kami terima.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Kirim ucapan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <label className="block">
        <span className="kicker mb-2 block">Nama</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.nameMax} autoComplete="name" required />
      </label>

      <fieldset>
        <legend className="kicker mb-2">Kehadiran</legend>
        <div className="grid grid-cols-3 gap-2">
          {ATTENDANCE.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer rounded-full border px-2 py-2.5 text-center text-xs font-medium transition duration-500 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-cream",
                attendance === value ? "border-cream bg-cream text-ink" : "border-cream/20 text-cream/70 hover:border-cream/50",
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
          <span className="kicker mb-2 block">Jumlah tamu</span>
          <select className="field [&>option]:bg-charcoal" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
            {PARTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="kicker mb-2 flex justify-between">
          Ucapan &amp; doa
          <span className="tracking-normal text-cream/40">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea
          className="field min-h-32 resize-y"
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
        <p role="alert" className="rounded-xl bg-umber/60 px-4 py-2.5 text-xs text-cream">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-cream w-full">
        {status === "sending" ? "Mengirim…" : "Kirim ucapan"}
      </button>
    </form>
  );
}
