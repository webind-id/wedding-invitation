"use client";

import { CreditCard, Gift, MapPin, Package, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { WaxSeal } from "../rustic/WaxSeal";
import { CopyButton } from "../ui/CopyButton";
import { SectionHeading } from "../ui/SectionHeading";

function RusticGiftCard({ account }: { account: GiftAccount }) {
  const isBank = account.kind === "bank";

  return (
    <div className="rustic-card flex flex-col justify-between p-6 sm:p-7 bg-white/95 border border-sand-deep/60 shadow-rustic hover:shadow-rustic-lg transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={isBank ? "badge-terracotta" : "badge-olive"}>
            {isBank ? "TRANSFER BANK" : "E-WALLET"}
          </span>
          <CreditCard className="h-5 w-5 text-terracotta" aria-hidden />
        </div>

        <h4 className="font-serif text-xl font-bold text-earth-ink mb-1">
          {account.provider}
        </h4>

        <div className="my-4 rounded-xl border border-dashed border-sand-deep/70 bg-cream-50 p-4 text-center">
          <p className="font-sans text-[0.7rem] text-earth-muted uppercase tracking-wider mb-1">
            Nomor Rekening / Akun
          </p>
          <p className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-terracotta-700">
            {account.number}
          </p>
          <p className="font-sans text-xs text-earth-muted mt-1.5">
            a.n. <span className="font-semibold text-earth-ink">{account.holder}</span>
          </p>
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <CopyButton text={account.number.replace(/[\s-]/g, "")} label="Salin Nomor Rekening" />
      </div>
    </div>
  );
}

export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { gift } = content;
  const hasAccounts = Boolean(gift?.accounts && gift.accounts.length > 0);
  const hasShipping = Boolean(gift?.shipping?.address);

  if (!hasAccounts && !hasShipping) return null;

  return (
    <section
      ref={ref}
      id="gifts"
      aria-labelledby="gifts-title"
      className="rustic-paper relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          badge="WEDDING GIFT"
          scriptTitle="Tanda Kasih"
          title="Amplop Digital &amp; Kado Fisik"
          subtitle={
            gift?.intro ||
            "Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin berbagi tanda kasih, kami menyediakan nomor rekening dan alamat pengiriman berikut."
          }
        />

        {/* ── Rekening Digital ────────────────────────────────────────── */}
        {hasAccounts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {gift.accounts.map((acc, i) => (
              <RusticGiftCard key={`${acc.provider}-${i}`} account={acc} />
            ))}
          </div>
        )}

        {/* ── Pengiriman Kado Fisik ────────────────────────────────────── */}
        {hasShipping && gift.shipping && (
          <div data-reveal="up" className="mt-10">
            <div className="rustic-card p-6 sm:p-8 bg-cream-50/90 border border-sand-deep/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive-100 text-olive-700">
                  <Package className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-earth-ink">
                    Kirim Kado Fisik
                  </h4>
                  <p className="text-xs text-earth-muted">
                    Penerima: {gift.shipping.recipient}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-sand-deep/50 bg-white p-4 text-sm text-earth-ink leading-relaxed">
                <p className="font-medium">{gift.shipping.address}</p>
                {gift.shipping.phone && (
                  <p className="mt-2 text-xs text-earth-muted flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-terracotta" aria-hidden />
                    <span>{gift.shipping.phone}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <CopyButton text={`${gift.shipping.recipient}\n${gift.shipping.address}\nTelp: ${gift.shipping.phone || ""}`} label="Salin Alamat Lengkap" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
