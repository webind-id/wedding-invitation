"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { requestJson } from "@/lib/api";
import { ATTENDANCE, ATTENDANCE_LABEL, LIMITS, validateGuestbookInput, type Attendance, type GuestbookEntry } from "@/lib/guestbook";

interface RsvpFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

export function RsvpForm({ slug, defaultName, onSubmitted }: RsvpFormProps) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { name, attendance: attendance || null, partySize, message, website };
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
      <div role="status" className="mt-6 rounded-2xl border border-cream-200 bg-ivory px-5 py-7">
        <p className="font-script text-4xl text-red-700">Matur nuwun</p>
        <p className="small-ui mt-2">
          Ucapan dari <span className="font-medium text-red-800">{name}</span> sudah kami terima.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-red mt-5">
          Kirim ucapan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-3 text-left">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="hp-website">Website</label>
        <input id="hp-website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <label className="field-label">
        Nama Lengkap
        <input
          required
          maxLength={LIMITS.nameMax}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tulis nama Anda"
          autoComplete="name"
          className="field"
        />
      </label>

      <div className="grid grid-cols-[1.4fr_1fr] gap-2.5">
        <label className="field-label">
          Kehadiran
          <select required value={attendance} onChange={(e) => setAttendance(e.target.value as Attendance)} className="field">
            <option value="" disabled>
              Pilih status
            </option>
            {ATTENDANCE.map((choice) => (
              <option key={choice} value={choice}>
                {ATTENDANCE_LABEL[choice]}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Jumlah Tamu
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            disabled={attendance !== "hadir"}
            className="field disabled:opacity-50"
          >
            {PARTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        Ucapan &amp; Doa
        <textarea
          required
          rows={4}
          maxLength={LIMITS.messageMax}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis ucapan dan doa untuk kedua mempelai"
          className="field min-h-[90px] resize-y"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-[#B5361E]/40 bg-[#B5361E]/10 px-3.5 py-2.5 font-sans text-xs text-[#8E2A18]">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-red">
        <Send className="h-[15px] w-[15px]" aria-hidden />
        {status === "sending" ? "Mengirim…" : "Kirim Ucapan"}
      </button>
    </form>
  );
}
