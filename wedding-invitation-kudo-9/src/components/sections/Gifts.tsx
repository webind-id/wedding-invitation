"use client";

import { Gift, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { CopyButton } from "../ui/CopyButton";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Amplop digital mungil: sisi depan amplop tertutup, ketuk untuk membaliknya (3D) dan
 * melihat nomor rekening. Transisi CSS sekali per ketukan — tidak ada gerak berulang.
 */
function GiftEnvelope({ account }: { account: GiftAccount }) {
  const [isOpen, setIsOpen] = useState(false);
  const kind = account.kind === "bank" ? "Rekening bank" : "Dompet digital";

  return (
    <div className="h-64 [perspective:1100px]">
      <div className={cn("preserve-3d relative h-full w-full transition-transform duration-[1100ms] ease-silk", isOpen && "[transform:rotateY(180deg)]")}>
        {/* Depan: amplop tertutup */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          inert={isOpen}
          className="backface-hidden veil-card absolute inset-0 flex flex-col items-center justify-end overflow-hidden rounded-[1.75rem] pb-7 text-center"
        >
          <svg aria-hidden viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[48%] w-full">
            <path d="M0 0 L150 110 L300 0" fill="rgba(205,188,221,0.45)" stroke="rgba(94,61,107,0.12)" strokeWidth="1" />
          </svg>
          <span aria-hidden className="absolute left-1/2 top-[44%] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-plum text-mist shadow-md">
            <Gift className="h-4 w-4" />
          </span>
          <span className="label">{kind}</span>
          <span className="mt-2 font-display text-2xl italic">{account.provider}</span>
          <span className="mt-3 text-xs text-ink/50">Ketuk untuk membuka amplop</span>
        </button>

        {/* Belakang: isi amplop */}
        <div inert={!isOpen} aria-hidden={!isOpen} className="backface-hidden veil-card absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] px-6 text-center [transform:rotateY(180deg)]">
          <p className="label">{account.provider}</p>
          <p className="mt-3 font-display text-3xl tabular-nums tracking-wide">{account.number}</p>
          <p className="mt-1 text-sm text-ink/65">a.n. {account.holder}</p>
          <div className="mt-5 flex gap-2">
            <CopyButton value={account.number.replace(/[\s-]/g, "")} label="Salin nomor" />
            <button type="button" onClick={() => setIsOpen(false)} className="btn-ghost">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { gift } = content;
  if (gift.accounts.length === 0 && !gift.shipping) return null;

  return (
    <section ref={ref} id="hadiah" aria-labelledby="gifts-title" className="dusk-paper relative px-6 py-28 sm:py-40">
      <SectionHeading id="gifts-title" label="Tanda kasih" title="Amplop digital" intro={gift.intro || undefined} />

      {gift.accounts.length > 0 && (
        <div data-reveal-group className={cn("mx-auto mt-14 grid max-w-4xl gap-6", gift.accounts.length > 1 && "sm:grid-cols-2")}>
          {gift.accounts.map((account, i) => (
            <div key={`${account.provider}-${i}`} data-reveal-item>
              <div data-depth={i % 2 ? -20 : 20}>
                <GiftEnvelope account={account} />
              </div>
            </div>
          ))}
        </div>
      )}

      {gift.shipping && (
        <div data-reveal="up" className="mx-auto mt-10 max-w-2xl">
          <div className="veil-card rounded-[1.75rem] px-7 py-8 text-center">
            <p className="label inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Kirim kado
            </p>
            <p className="mt-3 font-display text-2xl italic">{gift.shipping.recipient}</p>
            {gift.shipping.phone && <p className="mt-1 text-sm text-ink/65">{gift.shipping.phone}</p>}
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">{gift.shipping.address}</p>
            <CopyButton value={`${gift.shipping.recipient}\n${gift.shipping.phone}\n${gift.shipping.address}`.trim()} label="Salin alamat" className="mt-5" />
          </div>
        </div>
      )}
    </section>
  );
}
