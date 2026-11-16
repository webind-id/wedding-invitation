"use client";

import { Gift, Package, Phone, Wallet } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { LanternSky } from "../lantern/LanternSky";
import { CopyButton } from "../ui/CopyButton";
import { SectionHeading } from "../ui/SectionHeading";

function GiftCard({ account }: { account: GiftAccount }) {
  const isBank = account.kind === "bank";
  return (
    <div data-reveal-item className="glass-night glass-night-hover flex flex-col justify-between p-6 sm:p-7">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className={isBank ? "badge-gold" : "badge-ember"}>{isBank ? "Transfer Bank" : "E-Wallet"}</span>
          <Wallet className="h-5 w-5 text-ember-300" aria-hidden />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-moon">{account.provider}</h3>
        <div className="my-4 rounded-xl border border-dashed border-gold/30 bg-night-900/70 p-4 text-center">
          <p className="mb-1 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-moon-subtle">Nomor Rekening / Akun</p>
          <p className="text-glow font-serif text-2xl font-semibold tracking-wider text-ember-200">{account.number}</p>
          <p className="mt-1.5 text-xs text-moon-muted">
            a.n. <span className="font-semibold text-moon">{account.holder}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <CopyButton text={account.number.replace(/[\s-]/g, "")} label="Salin Nomor" />
      </div>
    </div>
  );
}

export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { gift } = content;
  const accounts = gift?.accounts ?? [];
  const shipping = gift?.shipping?.address ? gift.shipping : null;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section ref={ref} id="gifts" aria-labelledby="gifts-title" className="night-sky relative overflow-hidden px-4 py-20 sm:py-28">
      <LanternSky count={6} seed={91} options={{ maxSize: 30 }} />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          id="gifts-title"
          badge="Wedding Gift"
          scriptTitle="Tanda Kasih"
          title="Amplop Digital & Kado"
          subtitle={
            gift?.intro ||
            "Doa restu Anda adalah cahaya terindah bagi kami. Bagi yang ingin berbagi tanda kasih, kami menyediakan rekening dan alamat berikut."
          }
        />

        {accounts.length > 0 && (
          <div data-reveal-group className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {accounts.map((acc, i) => (
              <GiftCard key={`${acc.provider}-${i}`} account={acc} />
            ))}
          </div>
        )}

        {shipping && (
          <div data-reveal="up" className="glass-night mt-10 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ember/15 text-ember-300">
                <Package className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-moon">Kirim Kado Fisik</h3>
                {shipping.recipient && <p className="text-xs text-moon-muted">Penerima: {shipping.recipient}</p>}
              </div>
              <Gift className="ml-auto h-5 w-5 text-gold/60" aria-hidden />
            </div>
            <div className="rounded-xl border border-gold/15 bg-night-900/70 p-4 text-sm leading-relaxed text-moon">
              <p>{shipping.address}</p>
              {shipping.phone && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-moon-muted">
                  <Phone className="h-3.5 w-3.5 text-ember-300" aria-hidden />
                  {shipping.phone}
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <CopyButton
                text={[shipping.recipient, shipping.address, shipping.phone ? `Telp: ${shipping.phone}` : ""].filter(Boolean).join("\n")}
                label="Salin Alamat"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
