"use client";

import { Check, Copy, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

const RESET_MS = 1800;

function CopyButton({ value, label }: { value: string; label: string }) {
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
    <button type="button" onClick={copy} aria-live="polite" className="btn-ghost px-4 py-2">
      {state === "ok" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {state === "ok" ? "Tersalin" : state === "fail" ? "Salin manual" : label}
    </button>
  );
}

/** Hadiah: panel kaca dengan nomor rekening serif besar. */
export function GiftScene() {
  const { content, photos } = useInvitation();
  const { intro, accounts, shipping } = content.gift;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <Scene chapter="hadiah" photo={content.posterPhoto || photoAt(photos, 2)} anchor label="Hadiah" className="flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-32 sm:px-10">
        <div className="max-w-xl">
          <ChapterHeading chapter="hadiah">
            Tanda <em>kasih</em>
          </ChapterHeading>
          {intro && (
            <Reveal delay={0.2} effect="fade">
              <p className="subtitle mt-6 text-sm leading-relaxed text-cream/75">{intro}</p>
            </Reveal>
          )}
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {accounts.map((a, i) => (
            <Reveal as="li" key={`${a.provider}-${a.number}`} delay={i * 0.2} effect="rise">
              <div className="glass rounded-3xl p-7">
                <p className="kicker">{a.kind === "bank" ? "Rekening" : "Dompet digital"}</p>
                <p className="mt-2 font-serif text-2xl">{a.provider}</p>
                <p className="mt-6 font-serif text-[2rem] italic leading-none tracking-wide tabular-nums">{a.number}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-cream/60">a.n. {a.holder}</p>
                  <CopyButton value={a.number.replace(/[\s-]/g, "")} label="Salin" />
                </div>
              </div>
            </Reveal>
          ))}

          {shipping && (
            <Reveal as="li" delay={0.3} effect="rise" className="md:col-span-2">
              <div className="glass flex flex-col gap-5 rounded-3xl p-7 sm:flex-row sm:items-center">
                <MapPin className="h-6 w-6 shrink-0 text-bronze" aria-hidden />
                <div className="flex-1">
                  <p className="kicker">Kirim kado</p>
                  <p className="mt-2 font-serif text-2xl">{shipping.recipient}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream/60">
                    {shipping.address}
                    {shipping.phone && <span className="block">{shipping.phone}</span>}
                  </p>
                </div>
                <CopyButton value={[shipping.recipient, shipping.phone, shipping.address].filter(Boolean).join("\n")} label="Salin alamat" />
              </div>
            </Reveal>
          )}
        </ul>
      </div>
    </Scene>
  );
}
