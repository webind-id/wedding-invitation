"use client";

import { useEffect, useState } from "react";
import { useInvitation } from "../InvitationContext";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";

const RESET_MS = 1800;

function CopyLink({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), RESET_MS);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("ok");
    } catch {
      setState("fail");
    }
  }

  return (
    <button type="button" onClick={copy} aria-live="polite" className="rubric link-underline text-ink">
      {state === "ok" ? "Tersalin ✓" : state === "fail" ? "Salin manual" : label}
    </button>
  );
}

/** Registri hadiah bergaya tabel majalah: baris bergaris rambut, nomor rekening serif. */
export function Registry() {
  const { intro, accounts, shipping } = useInvitation().content.gift;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section id="registri" data-rubric="registri" aria-labelledby="registri-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Opener id="registri" titleId="registri-title" deck={intro || undefined} className="lg:col-span-5">
          Tanda <em>kasih</em>
        </Opener>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-28">
          <ul>
            {accounts.map((a, i) => (
              <Reveal as="li" key={`${a.provider}-${a.number}`} delay={i * 0.08} className="border-t border-ink py-7 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="rubric">{a.kind === "bank" ? "Rekening bank" : "Dompet digital"}</p>
                  <CopyLink value={a.number.replace(/[\s-]/g, "")} label="Salin nomor" />
                </div>
                <p className="mt-3 font-serif text-2xl">{a.provider}</p>
                <p className="mt-1 font-serif text-[clamp(1.9rem,4vw,2.6rem)] font-light tracking-[0.04em] tabular-nums">{a.number}</p>
                <p className="mt-1 font-serif italic text-stone">atas nama {a.holder}</p>
              </Reveal>
            ))}
          </ul>

          {shipping && (
            <Reveal className="mt-14 bg-bone p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="rubric">Alamat kirim kado</p>
                <CopyLink value={[shipping.recipient, shipping.phone, shipping.address].filter(Boolean).join("\n")} label="Salin alamat" />
              </div>
              <p className="mt-4 font-serif text-2xl">{shipping.recipient}</p>
              <p className="mt-2 font-serif leading-relaxed text-ink/80">{shipping.address}</p>
              {shipping.phone && <p className="mt-1 font-serif italic text-stone">{shipping.phone}</p>}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
