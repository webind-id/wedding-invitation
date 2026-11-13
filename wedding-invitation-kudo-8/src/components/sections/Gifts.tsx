"use client";

import { Backpack, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { StickyScene } from "../film/StickyScene";
import { CopyButton } from "../ui/CopyButton";

/**
 * Kartu logistik: sisi depan tertutup, ketuk untuk membaliknya (3D) dan melihat nomor
 * rekening. Transisi CSS sekali per ketukan — tidak ada gerak berulang.
 */
function GearCard({ account, index }: { account: GiftAccount; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const kind = account.kind === "bank" ? "Rekening bank" : "Dompet digital";

  return (
    <div className="h-64 [perspective:1100px]">
      <div className={cn("preserve-3d relative h-full w-full transition-transform duration-[1100ms] ease-film", isOpen && "[transform:rotateY(180deg)]")}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          inert={isOpen}
          className="backface-hidden absolute inset-0 flex flex-col justify-between border border-seluloid/15 bg-film/85 p-6 text-left transition-colors hover:border-amber/60"
        >
          <span className="flex w-full items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.24em] text-seluloid/50">
            <span>Logistik {String(index + 1).padStart(2, "0")}</span>
            <Backpack className="h-4 w-4 text-amber" aria-hidden />
          </span>
          <span>
            <span className="label block">{kind}</span>
            <span className="credit mt-2 block text-3xl">{account.provider}</span>
            <span className="mt-3 block font-display italic text-seluloid/55">Ketuk untuk membuka</span>
          </span>
        </button>

        <div inert={!isOpen} aria-hidden={!isOpen} className="backface-hidden absolute inset-0 flex flex-col justify-center border border-amber/40 bg-film/95 p-6 text-center [transform:rotateY(180deg)]">
          <p className="label">{account.provider}</p>
          <p className="mt-3 font-mono text-[1.6rem] font-medium tabular-nums tracking-wide text-seluloid">{account.number}</p>
          <p className="mt-1 font-display text-lg italic text-seluloid/65">a.n. {account.holder}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
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

/** Final Chapter · Titip logistik — hadiah digital & alamat kirim kado, di atas awan Slamet. */
export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const { gift } = content;
  if (gift.accounts.length === 0 && !gift.shipping) return null;

  return (
    <section ref={ref} id="hadiah" aria-labelledby="gifts-title">
      <StickyScene scene="slamet" dim={0.8}>
        <div className="px-6 pb-28 pt-28 sm:px-10 sm:pb-40 sm:pt-36">
          <div data-reveal="fade" className="flex justify-center">
            <Slate scene={8} mountain="slamet" />
          </div>
          <TitleCard id="gifts-title" kicker="Final Chapter · Titip logistik" title="Hadiah Digital" intro={gift.intro || undefined} className="mt-6" />

          {gift.accounts.length > 0 && (
            <div data-reveal-group className={cn("mx-auto mt-16 grid max-w-sm gap-6", gift.accounts.length > 1 && "sm:max-w-3xl sm:grid-cols-2")}>
              {gift.accounts.map((account, i) => (
                <div key={`${account.provider}-${i}`} data-reveal-item>
                  <GearCard account={account} index={i} />
                </div>
              ))}
            </div>
          )}

          {gift.shipping && (
            <div data-reveal="up" className="glass mx-auto mt-8 max-w-3xl px-7 py-8 text-center">
              <p className="label inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> Kirim ke basecamp
              </p>
              <p className="credit mt-3 text-2xl">{gift.shipping.recipient}</p>
              {gift.shipping.phone && <p className="mt-1 font-mono text-sm text-seluloid/60">{gift.shipping.phone}</p>}
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-seluloid/75">{gift.shipping.address}</p>
              <CopyButton value={`${gift.shipping.recipient}\n${gift.shipping.phone}\n${gift.shipping.address}`.trim()} label="Salin alamat" className="mt-5" />
            </div>
          )}
        </div>
      </StickyScene>
    </section>
  );
}
