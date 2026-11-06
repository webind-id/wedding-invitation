"use client";

import { useEffect, useState } from "react";
import { useInvitation } from "../InvitationContext";
import { SectionTitle } from "../ui/Frames";
import { EngravedCard } from "../ui/Ornaments";
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
    <button type="button" onClick={copy} aria-live="polite" className="btn-plain px-4 py-1.5 text-sm">
      {state === "ok" ? "Tersalin" : state === "fail" ? "Salin manual" : label}
    </button>
  );
}

/** Tanda kasih: tiap rekening sebagai kartu bercetak kecil, alamat kado di bawahnya. */
export function Gifts() {
  const { intro, accounts, shipping } = useInvitation().content.gift;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section id="hadiah" aria-labelledby="hadiah-title" className="border-y border-burgundy/20 bg-parchment/50 px-4 py-20 sm:py-28">
      <SectionTitle label="Tanda kasih" id="hadiah-title">
        Hadiah Pernikahan
      </SectionTitle>
      {intro && (
        <Reveal className="mx-auto mt-8 max-w-xl text-center font-serif text-lg italic leading-relaxed text-umber">
          <p>{intro}</p>
        </Reveal>
      )}

      <ul className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {accounts.map((a, i) => (
          <Reveal as="li" key={`${a.provider}-${a.number}`} delay={i * 0.1}>
            <EngravedCard corners={false} innerClassName="px-6 py-8 text-center">
              <p className="smallcaps text-sm">{a.kind === "bank" ? "Rekening" : "Dompet digital"}</p>
              <p className="mt-2 font-fell text-2xl text-burgundy">{a.provider}</p>
              <p className="mt-4 font-serif text-[1.7rem] tracking-[0.08em] text-ink tabular-nums">{a.number}</p>
              <p className="mt-1 font-serif italic text-umber">atas nama {a.holder}</p>
              <div className="mt-5">
                <CopyLink value={a.number.replace(/[\s-]/g, "")} label="Salin nomor" />
              </div>
            </EngravedCard>
          </Reveal>
        ))}
      </ul>

      {shipping && (
        <Reveal className="mx-auto mt-8 max-w-3xl">
          <EngravedCard corners={false} innerClassName="px-6 py-8 text-center">
            <p className="smallcaps text-sm">Alamat pengiriman kado</p>
            <p className="mt-2 font-fell text-2xl text-burgundy">{shipping.recipient}</p>
            <p className="mx-auto mt-2 max-w-md font-serif text-lg leading-relaxed text-ink/85">{shipping.address}</p>
            {shipping.phone && <p className="mt-1 font-serif italic text-umber">{shipping.phone}</p>}
            <div className="mt-5">
              <CopyLink value={[shipping.recipient, shipping.phone, shipping.address].filter(Boolean).join("\n")} label="Salin alamat" />
            </div>
          </EngravedCard>
        </Reveal>
      )}
    </section>
  );
}
