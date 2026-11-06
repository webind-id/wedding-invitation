"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { formatLongDate } from "@/lib/datetime";
import { useInvitation } from "./InvitationContext";
import { Picture } from "./ui/Picture";
import { Sprig } from "./ui/Sprig";

/**
 * Panel kiri di layar lebar: poster tipografi besar di atas foto bertint
 * hijau, dengan hitung mundur ringkas. Tidak dirender di bawah breakpoint lg.
 */
export function DesktopPoster({ guestName }: { guestName: string }) {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  const firstEvent = content.events[0];
  const left = useCountdown(firstEvent.start);

  return (
    <aside className="grain fixed inset-y-0 left-0 right-[480px] hidden overflow-hidden bg-forest text-linen lg:block">
      <Picture
        src={content.posterPhoto}
        alt=""
        className="absolute inset-0 bg-forest opacity-35 mix-blend-luminosity"
        imgClassName="animate-drift"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-forest via-forest/70 to-transparent" />
      <Sprig className="absolute -right-10 top-10 h-[60vh] w-auto rotate-12 text-sage/20" />

      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        <p className="eyebrow text-blush">Undangan Pernikahan</p>

        <div>
          <p aria-hidden className="font-display text-[clamp(5rem,9vw,9rem)] font-light italic leading-[0.85] tracking-tight">
            {first.nickname}
            <br />
            <span className="pl-[0.6em] not-italic text-blush">&amp;</span> {second.nickname}
          </p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-linen/70">
            {formatLongDate(firstEvent.start, content.timeZone)} · {firstEvent.venue}
          </p>
        </div>

        <div className="flex items-end justify-between gap-8">
          <p className="max-w-xs text-sm text-linen/60">
            Kepada <span className="font-display text-lg italic text-linen">{guestName}</span>
          </p>
          {left && !left.done && (
            <dl className="flex gap-6 text-right" aria-label="Hitung mundur">
              {[
                ["hari", left.days],
                ["jam", left.hours],
                ["menit", left.minutes],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-linen/50">{label}</dt>
                  <dd className="font-display text-4xl tabular-nums">{String(value).padStart(2, "0")}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </aside>
  );
}
