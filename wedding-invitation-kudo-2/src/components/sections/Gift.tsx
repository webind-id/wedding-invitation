"use client";

import { Check, Copy, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";

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
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.25em] text-gold transition hover:text-ivory",
        state === "ok" && "text-ivory",
      )}
    >
      {state === "ok" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {state === "ok" ? "Tersalin" : state === "fail" ? "Salin manual" : label}
    </button>
  );
}

/** Tanda kasih: kartu rekening hitam bergaris emas seperti kartu undangan VIP. */
export function Gift() {
  const { intro, accounts, shipping } = useInvitation().content.gift;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section id="tanda-kasih" aria-labelledby="hadiah-title" className="film-grain bg-onyx py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Title reel="05" label="Tanda kasih" id="hadiah-title">
          Hadiah <em className="text-gold">pernikahan</em>
        </Title>
        {intro && (
          <Reveal className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-smoke">
            <p>{intro}</p>
          </Reveal>
        )}

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {accounts.map((a, i) => (
            <Reveal as="li" key={`${a.provider}-${a.number}`} delay={i * 0.08}>
              <div className="relative overflow-hidden border border-gold/30 bg-gradient-to-br from-graphite via-onyx to-void p-6 sm:p-8">
                <span aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-gold/15" />
                <span aria-hidden className="absolute -right-2 -top-2 h-20 w-20 rounded-full border border-gold/10" />
                <p className="credit">{a.kind === "bank" ? "Rekening" : "Dompet digital"}</p>
                <p className="mt-2 font-display text-2xl">{a.provider}</p>
                <p className="mt-8 font-display text-[1.65rem] tracking-[0.12em] tabular-nums text-gold sm:text-3xl">{a.number}</p>
                <div className="mt-6 flex items-end justify-between gap-4 border-t border-gold/15 pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-smoke">a.n. {a.holder}</p>
                  <CopyLink value={a.number.replace(/[\s-]/g, "")} label="Salin" />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {shipping && (
          <Reveal className="mt-5">
            <div className="flex flex-col gap-6 border border-dashed border-gold/30 p-6 sm:flex-row sm:items-center sm:p-8">
              <Package className="h-8 w-8 shrink-0 text-gold" aria-hidden />
              <div className="flex-1">
                <p className="credit">Kirim kado</p>
                <p className="mt-2 font-display text-xl">{shipping.recipient}</p>
                <p className="mt-1 text-sm leading-relaxed text-smoke">
                  {shipping.address}
                  {shipping.phone && <span className="block text-ivory/60">{shipping.phone}</span>}
                </p>
              </div>
              <CopyLink value={[shipping.recipient, shipping.phone, shipping.address].filter(Boolean).join("\n")} label="Salin alamat" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
