"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { useInvitation } from "../InvitationContext";
import { Divider, HangingBranches } from "../klenteng/Ornaments";

/**
 * Salam pembuka "Dengan Sukacita". Kotak kutipan memakai ayat/kutipan dari admin bila diisi;
 * bila kosong, memakai kutipan Shijing 执子之手，与子偕老 bawaan template.
 */
export function Verse() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useSwayZone(ref);
  useScrollScene(ref);

  const { verse } = content;
  const hasVerse = Boolean(verse.arabic || verse.translation);

  return (
    <section ref={ref} id="salam" aria-labelledby="salam-title" className="sec coin-bg">
      <HangingBranches />
      <div data-reveal="up" className="pt-14">
        <p className="small-ui tracking-[3px]">SALAM SEJAHTERA</p>
        <h2 id="salam-title" className="script-title mt-2">
          Dengan Sukacita
        </h2>
        <Divider />
        <p className="lead">
          {content.invitationIntro ||
            "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan berbagi kebahagiaan di hari pernikahan kami."}
        </p>
      </div>

      <figure data-reveal="up" className="mt-[22px] rounded-[18px] border border-cream-200 bg-cream-100 px-5 py-6">
        {hasVerse ? (
          <>
            {verse.arabic && (
              <p dir="rtl" lang="ar" className="mb-3 font-arabic text-[22px] leading-[2] text-red-900">
                {verse.arabic}
              </p>
            )}
            {verse.translation && <blockquote className="text-[17px] italic leading-[1.6] text-ink-700 [text-wrap:pretty]">&ldquo;{verse.translation}&rdquo;</blockquote>}
            {verse.source && <figcaption className="mt-2.5 font-sans text-[11px] uppercase tracking-[2px] text-gold-600">{verse.source}</figcaption>}
          </>
        ) : (
          <>
            <p lang="zh" className="font-han text-2xl tracking-[6px] text-red-700">
              执子之手，与子偕老
            </p>
            <blockquote className="mt-2 text-[17px] italic leading-[1.6] text-ink-700">&ldquo;Kugenggam tanganmu, bersamamu hingga menua.&rdquo;</blockquote>
            <figcaption className="mt-2.5 font-sans text-[11px] uppercase tracking-[2px] text-gold-600">Shijing · Kitab Puisi Kuno</figcaption>
          </>
        )}
      </figure>
    </section>
  );
}
