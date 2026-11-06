"use client";

import { Check, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { checkSlugAction } from "@/app/(panel)/undangan/actions";
import { cn } from "@/lib/cn";
import { splitPattern, type SlugAvailability } from "@/lib/domain";
import { publicUrl } from "@/lib/slug";
import { Field } from "../ui/Field";

const CHECK_DELAY_MS = 350;

type Status = "idle" | "checking" | SlugAvailability | "unknown";

const MESSAGES: Record<Exclude<Status, "idle" | "unknown">, { text: string; ok: boolean }> = {
  checking: { text: "Memeriksa…", ok: true },
  available: { text: "Tersedia", ok: true },
  taken: { text: "Sudah dipakai undangan lain", ok: false },
  reserved: { text: "Dicadangkan untuk sistem — pilih nama lain", ok: false },
  invalid: { text: "3–60 karakter: huruf kecil, angka, dan tanda - (tidak di awal/akhir)", ok: false },
};

/** Cek ketersediaan ke server setelah berhenti mengetik. Slug milik undangan ini sendiri tidak dicek. */
function useSlugStatus(slug: string, originalSlug: string | undefined, excludeId: string | undefined): Status {
  const [status, setStatus] = useState<Status>("idle");
  const shouldCheck = slug !== "" && slug !== originalSlug;

  useEffect(() => {
    if (!shouldCheck) return;
    let isCancelled = false;
    setStatus("checking");
    const timer = setTimeout(async () => {
      const result = await checkSlugAction(slug, excludeId).catch(() => "unknown" as const);
      if (!isCancelled) setStatus(result);
    }, CHECK_DELAY_MS);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [slug, excludeId, shouldCheck]);

  return shouldCheck ? status : "idle";
}

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Pola subdomain dari menu Domain, mis. "https://{slug}.kudostack.com"; null = {template}/{slug}. */
  urlPattern: string | null;
  templateBaseUrl: string;
  error?: string;
  /** Saat mengedit: slug tersimpan & ID undangan, agar tidak dianggap bentrok dengan dirinya sendiri. */
  originalSlug?: string;
  excludeId?: string;
}

export function SlugField({ value, onChange, urlPattern, templateBaseUrl, error, originalSlug, excludeId }: SlugFieldProps) {
  const status = useSlugStatus(value, originalSlug, excludeId);
  const message = status === "idle" || status === "unknown" ? null : MESSAGES[status];
  const url = publicUrl(urlPattern, templateBaseUrl, value || "slug");

  return (
    <Field
      label={urlPattern ? "Subdomain" : "Slug (alamat)"}
      error={error}
      hint={
        <>
          {message && (
            <span aria-live="polite" className={cn("mb-0.5 flex items-center gap-1 font-medium", message.ok ? (status === "checking" ? "text-muted" : "text-moss") : "text-danger")}>
              {message.ok ? <Check className="h-3 w-3" aria-hidden /> : <CircleAlert className="h-3 w-3" aria-hidden />}
              {message.text}
            </span>
          )}
          <span className="block break-all">
            Alamat undangan: <b className="text-ink">{url}</b>
          </span>
        </>
      }
    >
      {({ className, ...p }) => {
        const input = (
          <input
            {...p}
            className={urlPattern ? undefined : className}
            name="slug"
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            autoComplete="off"
            spellCheck={false}
            required
          />
        );
        if (!urlPattern) return input;
        return (
          <div className={cn("input-group", error && "input-group-error")}>
            {input}
            <span className="input-addon" aria-hidden>
              {splitPattern(urlPattern).suffix}
            </span>
          </div>
        );
      }}
    </Field>
  );
}
