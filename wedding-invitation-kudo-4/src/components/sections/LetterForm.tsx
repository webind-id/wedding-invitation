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

interface LetterFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

/** RSVP ditulis seperti surat: isian bergaris bawah, serif, tanpa kotak. */
export function LetterForm({ slug, defaultName, onSubmitted }: LetterFormProps) {
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
      <div className="border-y border-ink py-10">
        <p className="font-serif text-4xl font-light italic">Terima kasih, {name}.</p>
        <p className="mt-3 font-serif text-lg text-stone">Surat Anda telah kami terima dengan penuh syukur.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-8">
          Tulis surat lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <label className="block">
        <span className="rubric">Dari</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.nameMax} autoComplete="name" placeholder="Nama Anda" required />
      </label>

      <fieldset>
        <legend className="rubric mb-3">Konfirmasi kehadiran</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {ATTENDANCE.map((value) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 font-serif text-lg has-[:focus-visible]:underline">
              <input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} className="sr-only" />
              <span
                aria-hidden
                className={cn("h-3.5 w-3.5 rounded-full border border-ink transition duration-300", attendance === value && "bg-ink shadow-[inset_0_0_0_2.5px_#F7F2E8]")}
              />
              <span className={cn(attendance === value ? "italic" : "text-ink/70")}>{ATTENDANCE_LABEL[value]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "hadir" && (
        <label className="block">
          <span className="rubric">Jumlah tamu</span>
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
        <span className="rubric flex justify-between">
          Surat untuk mempelai
          <span className="tracking-normal">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea
          className="field min-h-36 resize-y leading-relaxed"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.messageMax}
          placeholder="Tuliskan doa dan harapan Anda…"
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
        <p role="alert" className="border-l-2 border-gold pl-4 font-serif italic text-ink">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-ink">
        {status === "sending" ? "Mengirim…" : "Kirim surat"}
      </button>
    </form>
  );
}
