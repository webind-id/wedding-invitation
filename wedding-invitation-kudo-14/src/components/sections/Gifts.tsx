"use client";

import { Package, Phone } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { CopyButton } from "../ui/CopyButton";

/** Perangko bergerigi berisi kupu-kupu — "cap pos" dari taman. */
function Stamp() {
  return (
    // Bayangan di pembungkus: `filter` pada elemen ber-mask ikut terpotong mask.
    <span aria-hidden className="absolute -top-4 right-5 rotate-[6deg] drop-shadow-[0_3px_4px_rgba(86,22,41,0.22)]">
      <span className="perangko">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/taman/kupukupu.webp" alt="" width={240} height={134} loading="lazy" className="w-[44px]" />
      </span>
    </span>
  );
}

/** Kartu surat berbentuk daun: kertas gading, garis prada ganda di dalam, perangko di pojok. */
function Letter({ children }: { children: ReactNode }) {
  return (
    <div data-reveal-item className="daun-lg relative mt-8 bg-ivory px-6 pb-6 pt-7 text-left text-marun-800 shadow-[0_14px_30px_rgba(86,22,41,0.16)]">
      <span aria-hidden className="daun-lg pointer-events-none absolute inset-[6px] border border-gold-500/60" />
      <Stamp />
      <div className="relative">{children}</div>
    </div>
  );
}

function AccountLetter({ account }: { account: GiftAccount }) {
  return (
    <Letter>
      <p className="font-sans text-[10px] uppercase tracking-[3px] text-blush-ink">Kepada rekening</p>
      <p className="mt-1 font-display text-base font-semibold uppercase tracking-[3px]">{account.provider}</p>
      <p className="mt-4 font-display text-[24px] font-medium tracking-[2px] tabular-nums">{account.number}</p>
      <p className="mb-4 mt-0.5 font-serif text-base italic text-marun-700">a.n. {account.holder}</p>
      <CopyButton text={account.number.replace(/[\s-]/g, "")} label="Salin Nomor" />
    </Letter>
  );
}

/** Babak "Tanda Katresnan" (tanda kasih): rekening & alamat kado sebagai surat berperangko. */
export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { gift } = content;
  const accounts = gift.accounts;
  const shipping = gift.shipping?.address ? gift.shipping : null;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section ref={ref} id="tanda-kasih" aria-labelledby="tanda-kasih-title" className="sec bg-cream-100">
      <Babak
        id="tanda-kasih-title"
        name="Tanda Katresnan"
        title="Tanda Kasih"
        lead={
          <span className="text-base">
            {gift.intro || "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika ingin memberikan tanda kasih, dapat melalui:"}
          </span>
        }
      />

      <div data-reveal-group className="mt-4">
        {accounts.map((account, i) => (
          <AccountLetter key={`${account.provider}-${i}`} account={account} />
        ))}

        {shipping && (
          <Letter>
            <p className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[3px] text-blush-ink">
              <Package className="h-3.5 w-3.5" aria-hidden />
              Kirim kado ke
            </p>
            <p className="mt-2 font-display text-base font-semibold uppercase tracking-[2px]">{shipping.recipient}</p>
            <p className="mt-1 font-sans text-[12.5px] leading-[1.6] text-marun-700">{shipping.address}</p>
            {shipping.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-marun-700">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {shipping.phone}
              </p>
            )}
            <CopyButton
              className="mt-4"
              text={[shipping.recipient, shipping.address, shipping.phone ? `Telp: ${shipping.phone}` : ""].filter(Boolean).join("\n")}
              label="Salin Alamat"
            />
          </Letter>
        )}
      </div>
    </section>
  );
}
