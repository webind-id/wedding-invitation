"use client";

import { useState, type FormEvent } from "react";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { ATTENDANCE, LIMITS, validateGuestbookInput, type Attendance, type GuestbookEntry } from "@/lib/guestbook";

interface ReplyFormProps {
  slug: string;
  defaultName: string;
  onSubmitted: (entry: GuestbookEntry | null) => void;
}

/** Kalimat pilihan ala kartu balasan resmi. */
const REPLY_LABEL: Record<Attendance, string> = {
  hadir: "Dengan senang hati akan hadir",
  tidak_hadir: "Dengan menyesal berhalangan hadir",
  ragu: "Belum dapat memastikan",
};

const PARTY_OPTIONS = Array.from({ length: LIMITS.partyMax }, (_, i) => i + 1);

/** Isian kartu R.S.V.P.: garis titik-titik, kotak centang bergaya cetak. */
export function ReplyForm({ slug, defaultName, onSubmitted }: ReplyFormProps) {
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
      <div className="py-6 text-center">
        <p className="font-fell text-3xl italic text-burgundy">Terima kasih, {name}.</p>
        <p className="mt-3 font-serif text-lg text-umber">Balasan Anda telah kami terima dengan penuh hormat.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-plain mt-6">
          Kirim balasan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7 text-left">
      <label className="flex items-end gap-3">
        <span className="shrink-0 pb-2 font-fell text-lg italic text-umber">Nama</span>
        <input className="ruled" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.nameMax} autoComplete="name" required />
      </label>

      <fieldset className="space-y-3">
        <legend className="sr-only">Konfirmasi kehadiran</legend>
        {ATTENDANCE.map((value) => (
          <label key={value} className="flex cursor-pointer items-center gap-3 font-serif text-lg has-[:focus-visible]:underline">
            <input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} className="sr-only" />
            <span aria-hidden className="relative flex h-5 w-5 shrink-0 items-center justify-center border border-burgundy">
              {attendance === value && <span className="font-fell text-xl leading-none text-burgundy">✓</span>}
            </span>
            <span className={cn(attendance === value ? "text-burgundy" : "text-ink/80")}>{REPLY_LABEL[value]}</span>
          </label>
        ))}
      </fieldset>

      {attendance === "hadir" && (
        <label className="flex items-end gap-3">
          <span className="shrink-0 pb-2 font-fell text-lg italic text-umber">Jumlah tamu</span>
          <select className="ruled w-auto" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
            {PARTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="flex justify-between font-fell text-lg italic text-umber">
          Ucapan &amp; doa
          <span className="font-serif text-sm not-italic text-sepia">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea
          className="ruled min-h-28 resize-y leading-[2.4rem] [background-image:repeating-linear-gradient(transparent,transparent_2.35rem,rgba(90,64,48,0.35)_2.35rem,rgba(90,64,48,0.35)_2.4rem)] [border-bottom:0]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.messageMax}
          placeholder="Tuliskan doa terbaik Anda…"
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
        <p role="alert" className="font-serif italic text-burgundy">
          {error}
        </p>
      )}

      <div className="text-center">
        <button type="submit" disabled={status === "sending"} className="btn-burgundy">
          {status === "sending" ? "Mengirim…" : "Kirim balasan"}
        </button>
      </div>
    </form>
  );
}
