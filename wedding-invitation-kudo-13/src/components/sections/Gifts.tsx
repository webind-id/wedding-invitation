"use client";

import { Package, Phone } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { TopCorners } from "../klenteng/Ornaments";
import { CopyButton } from "../ui/CopyButton";
import { SectionHeading } from "../ui/SectionHeading";

/** Kartu angpao: amplop merah dengan tutup melengkung dan lencana 福 (fu, berkah). */
const CARD =
  "relative mx-auto mt-[22px] max-w-[320px] overflow-hidden rounded-[14px] bg-gradient-to-br from-red-500 to-[#7A1010] p-[22px] text-left text-cream-100 shadow-[inset_0_0_0_1px_rgba(237,217,160,0.6),0_12px_30px_rgba(74,9,9,0.35)]";

function EnvelopeFlap() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[46px] border-b border-gold-300/50 bg-black/10 [border-radius:0_0_50%_50%/0_0_100%_100%]"
    />
  );
}

function FuBadge() {
  return (
    <span
      aria-hidden
      lang="zh"
      className="absolute right-4 top-[18px] grid h-[50px] w-[50px] place-items-center rounded-full bg-[radial-gradient(circle,#EDD9A0,#C9A24B)] font-han text-[25px] text-red-800 shadow-[0_0_0_3px_rgba(237,217,160,0.35)]"
    >
      福
    </span>
  );
}

function AccountCard({ account }: { account: GiftAccount }) {
  return (
    <div data-reveal-item className={CARD}>
      <EnvelopeFlap />
      <FuBadge />
      <p className="relative font-display text-[13px] font-semibold uppercase tracking-[3px] text-gold-300">{account.provider}</p>
      <p className="mt-[30px] font-sans text-[19px] tracking-[2.5px]">{account.number}</p>
      <p className="mb-3.5 mt-1 font-sans text-xs opacity-85">a.n. {account.holder}</p>
      <CopyButton text={account.number.replace(/[\s-]/g, "")} label="Salin Nomor" />
    </div>
  );
}

export function Gifts() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const { gift } = content;
  const accounts = gift.accounts;
  const shipping = gift.shipping?.address ? gift.shipping : null;
  if (accounts.length === 0 && !shipping) return null;

  return (
    <section ref={ref} id="angpao" aria-labelledby="angpao-title" className="sec coin-bg">
      <TopCorners />
      <SectionHeading
        id="angpao-title"
        title="Angpao Digital"
        variant="script"
        lead={
          <span className="text-base">
            {gift.intro || "Doa restu Anda adalah hadiah terindah bagi kami. Namun, jika ingin memberikan tanda kasih, dapat melalui:"}
          </span>
        }
      />

      {accounts.length > 0 && (
        <div data-reveal-group>
          {accounts.map((account, i) => (
            <AccountCard key={`${account.provider}-${i}`} account={account} />
          ))}
        </div>
      )}

      {shipping && (
        <div data-reveal="up" className={CARD}>
          <EnvelopeFlap />
          <FuBadge />
          <p className="relative flex items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-[3px] text-gold-300">
            <Package className="h-4 w-4" aria-hidden />
            Kirim Kado
          </p>
          <p className="mt-[30px] font-sans text-[13px] font-medium">{shipping.recipient}</p>
          <p className="mt-1 pr-14 font-sans text-xs leading-[1.6] opacity-85">{shipping.address}</p>
          {shipping.phone && (
            <p className="mt-1.5 flex items-center gap-1.5 font-sans text-xs opacity-85">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {shipping.phone}
            </p>
          )}
          <CopyButton
            className="mt-3.5"
            text={[shipping.recipient, shipping.address, shipping.phone ? `Telp: ${shipping.phone}` : ""].filter(Boolean).join("\n")}
            label="Salin Alamat"
          />
        </div>
      )}
    </section>
  );
}
