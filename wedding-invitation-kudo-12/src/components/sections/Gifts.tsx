"use client";

import { Package, Phone } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { TopCorners } from "../jawa/Ornaments";
import { CopyButton } from "../ui/CopyButton";
import { SectionHeading } from "../ui/SectionHeading";

const CARD =
  "relative mx-auto mt-[22px] max-w-[320px] overflow-hidden rounded-[20px] bg-gradient-to-br from-sogan-800 to-sogan-700 p-[22px] text-left text-cream-100 shadow-[inset_0_0_0_1px_rgba(206,172,89,0.5),0_12px_30px_rgba(0,0,0,0.3)]";

/** Lingkaran emas samar di pojok kartu, seperti kartu ATM berukir. */
function CardRing() {
  return <span aria-hidden className="pointer-events-none absolute -right-[30px] -top-[30px] h-[120px] w-[120px] rounded-full border-[16px] border-gold-500/10" />;
}

function AccountCard({ account }: { account: GiftAccount }) {
  return (
    <div data-reveal-item className={CARD}>
      <CardRing />
      <p className="font-display text-sm font-semibold uppercase tracking-[3px] text-gold-300">{account.provider}</p>
      <span aria-hidden className="mb-2.5 mt-3.5 block h-[26px] w-9 rounded-md bg-gradient-to-br from-gold-300 to-gold-600" />
      <p className="font-sans text-[19px] tracking-[2.5px]">{account.number}</p>
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
    <section ref={ref} id="tanda-kasih" aria-labelledby="tanda-kasih-title" className="sec kawung-bg">
      <TopCorners />
      <SectionHeading
        id="tanda-kasih-title"
        title="Tanda Kasih"
        variant="script"
        lead={
          <span className="text-base">
            {gift.intro || "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika ingin memberikan tanda kasih, dapat melalui:"}
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
          <CardRing />
          <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[3px] text-gold-300">
            <Package className="h-4 w-4" aria-hidden />
            Kirim Kado
          </p>
          <p className="mt-3 font-sans text-[13px] font-medium">{shipping.recipient}</p>
          <p className="mt-1 font-sans text-xs leading-[1.6] opacity-85">{shipping.address}</p>
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
