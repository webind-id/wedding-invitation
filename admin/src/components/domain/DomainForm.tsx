"use client";

import { useActionState, useState } from "react";
import { saveDomainAction } from "@/app/(panel)/domain/actions";
import { cn } from "@/lib/cn";
import { normalizeRootDomain, type DomainSettings, type Scheme } from "@/lib/domain";
import { RESERVED_PREFIX, RESERVED_SUBDOMAINS } from "@/lib/slug";
import { Field, FormError } from "../ui/Field";

interface DomainFormProps {
  settings: DomainSettings;
  /** false bila migrasi 002 belum dijalankan. */
  isReady: boolean;
  publishedCount: number;
  /** Slug nyata untuk contoh alamat. */
  exampleSlug: string;
}

export function DomainForm({ settings, isReady, publishedCount, exampleSlug }: DomainFormProps) {
  const [state, action, isPending] = useActionState(saveDomainAction, null);
  const [isEnabled, setIsEnabled] = useState(settings.enabled);
  const [scheme, setScheme] = useState<Scheme>(settings.scheme);
  const [rootDomain, setRootDomain] = useState(settings.rootDomain);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  const domain = normalizeRootDomain(rootDomain);
  const preview = isEnabled && domain ? `${scheme}://${exampleSlug}.${domain}` : `{alamat app template}/${exampleSlug}`;
  const changesUrls = isEnabled !== settings.enabled || (isEnabled && (domain !== settings.rootDomain || scheme !== settings.scheme));

  return (
    <form action={action} className="card p-6">
      <fieldset disabled={!isReady || isPending} className="space-y-5">
        <legend className="sr-only">Pengaturan domain</legend>

        <label className="flex cursor-pointer items-start justify-between gap-4">
          <span>
            <span className="block font-semibold">Subdomain per undangan</span>
            <span className="mt-0.5 block text-sm text-muted">
              Aktif: setiap undangan di alamatnya sendiri. Nonaktif: alamat app template + /slug.
            </span>
          </span>
          <input type="checkbox" name="enabled" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden
            className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-line transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-moss peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-clay peer-focus-visible:ring-offset-2"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-[8.5rem_1fr]">
          <Field label="Protokol" error={errors.scheme}>
            {(p) => (
              <select {...p} name="scheme" value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}>
                <option value="https">https</option>
                <option value="http">http (lokal)</option>
              </select>
            )}
          </Field>
          <Field label="Domain induk" error={errors.root_domain} hint="Tanpa https:// dan tanpa garis miring. Untuk uji lokal: localhost:8787.">
            {({ className: _className, ...p }) => (
              <div className={cn("input-group", errors.root_domain && "input-group-error")}>
                <span className="input-addon border-l-0 border-r" aria-hidden>
                  *.
                </span>
                <input
                  {...p}
                  name="root_domain"
                  value={rootDomain}
                  onChange={(e) => setRootDomain(e.target.value)}
                  onBlur={() => setRootDomain(normalizeRootDomain(rootDomain))}
                  placeholder="kudostack.com"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            )}
          </Field>
        </div>

        <div className="rounded-xl bg-paper px-4 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">Contoh alamat</p>
          <p className="mt-1 break-all font-mono text-sm text-ink">{preview}</p>
        </div>

        <Field
          label="Nama yang dicadangkan (tambahan)"
          error={errors.reserved}
          hint={
            <>
              Subdomain yang dipakai hal lain, mis. <code>blog, promo</code>. Gateway meneruskannya ke server aslinya, dan nama ini tidak bisa
              dipakai sebagai slug. Bawaan: {RESERVED_SUBDOMAINS.join(", ")}, dan semua yang berawalan <code>{RESERVED_PREFIX}</code>.
            </>
          }
        >
          {(p) => <textarea {...p} name="reserved" rows={2} defaultValue={settings.reserved.join(", ")} placeholder="blog, promo" />}
        </Field>

        {changesUrls && publishedCount > 0 && (
          <p className="rounded-xl bg-clay/10 px-3.5 py-2.5 text-xs text-clay">
            Alamat {publishedCount} undangan yang sudah terbit akan berubah. Tautan yang sudah terkirim ke tamu memakai alamat lama.
          </p>
        )}
        <FormError message={state && !state.ok ? state.error : null} />
        {state?.ok && (
          <p role="status" className="text-xs font-medium text-moss">
            Tersimpan. Semua tautan di admin kini memakai alamat baru.
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            {isPending ? "Menyimpan…" : "Simpan pengaturan"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
