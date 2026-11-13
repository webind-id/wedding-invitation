"use client";

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
  hadir: "Insya Allah hadir",
  tidak_hadir: "Berhalangan",
  ragu: "Belum pasti",
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
      <div role="status" className="rise-in py-6 text-center">
        <p className="credit text-5xl text-seluloid">Tercatat</p>
        <p className="mt-2 font-display text-2xl italic text-amber">{name}</p>
        <p className="mx-auto mt-3 max-w-sm text-seluloid/65">Nama Anda sudah tercatat di buku registrasi. Sampai jumpa di puncak!</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Kirim lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <label className="block">
        <span className="label mb-2 block">Nama</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.nameMax} autoComplete="name" required />
      </label>

      <fieldset>
        <legend className="label mb-3">Kehadiran</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {ATTENDANCE.map((value) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center justify-center border px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition duration-300 ease-film has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-amber/40",
                attendance === value ? "border-amber bg-amber text-film" : "border-seluloid/15 bg-seluloid/[0.03] text-seluloid/75 hover:border-amber/60",
              )}
            >
              <input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} className="sr-only" />
              {CHOICE_LABEL[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "hadir" && (
        <label className="rise-in block">
          <span className="label mb-2 block">Jumlah tamu</span>
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
        <span className="label mb-2 flex justify-between">
          Ucapan &amp; doa
          <span className="normal-case tracking-normal text-seluloid/40">
            {message.length}/{LIMITS.messageMax}
          </span>
        </span>
        <textarea className="field min-h-32 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={LIMITS.messageMax} placeholder="Tinggalkan pesan untuk kami di buku registrasi…" />
      </label>

      {/* Honeypot — tersembunyi dari manusia & pembaca layar. */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {error && (
        <p role="alert" className="text-sm text-amber">
          {error}
        </p>
      )}

      <div className="text-center">
        <button type="submit" disabled={status === "sending"} className="btn-film-solid">
          {status === "sending" ? "Mengirim…" : "Daftar & kirim"}
        </button>
      </div>
    </form>
  );
}
