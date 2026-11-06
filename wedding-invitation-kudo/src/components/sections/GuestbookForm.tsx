"use client";

import { Send } from "lucide-react";
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
    if (!check.ok) {
      setError(check.error);
      return;
    }
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
      <div className="rounded-3xl bg-forest p-8 text-center text-linen">
        <p className="font-display text-2xl italic">Terima kasih, {name}!</p>
        <p className="mt-2 text-sm text-linen/70">Konfirmasi dan doa Anda sudah kami terima.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-light mt-5">
          Kirim ucapan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-3xl bg-white/60 p-5 ring-1 ring-forest/10">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-forest">Nama</span>
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.nameMax}
          autoComplete="name"
          required
        />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-xs font-semibold text-forest">Konfirmasi kehadiran</legend>
        <div className="grid grid-cols-3 gap-2">
          {ATTENDANCE.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-clay",
                attendance === value
                  ? "border-forest bg-forest text-linen"
                  : "border-forest/15 bg-white/70 text-forest hover:border-forest/40",
              )}
            >
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={attendance === value}
                onChange={() => setAttendance(value)}
                className="sr-only"
              />
              {ATTENDANCE_LABEL[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "hadir" && (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-forest">Jumlah tamu</span>
          <select className="field" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
            {PARTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 flex justify-between text-xs font-semibold text-forest">
          Ucapan & doa
          <span className="font-normal text-bark/50">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea
          className="field min-h-28 resize-y"
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
        <p role="alert" className="rounded-xl bg-clay/10 px-4 py-2.5 text-xs font-medium text-clay">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-clay w-full">
        <Send className="h-4 w-4" aria-hidden />
        {status === "sending" ? "Mengirim…" : "Kirim"}
      </button>
    </form>
  );
}
