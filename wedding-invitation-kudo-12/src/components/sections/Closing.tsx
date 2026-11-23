"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { usesIslamicGreeting } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Glyph, Ronce } from "../jawa/Ornaments";
import { Photo } from "../ui/Photo";
import { CREDIT } from "@/shared/credit";

export function Closing() {
  const { content, pair, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);


  return (
    <>
      <section ref={ref} id="penutup" aria-labelledby="penutup-title" className="sec sec-dark ronce-show pb-0">
        <Ronce strands={2} side="left" />
        <Ronce strands={2} side="right" />

        <div data-reveal="up" className="pt-[30px]">
          {content.posterPhoto && (
            <div className="arch mb-7 h-[230px] w-[176px]">
              <div className="arch-in">
                <Photo src={content.posterPhoto} alt={`Foto ${coupleLabel}`} className="h-full w-full" />
              </div>
            </div>
          )}
          <h2 id="penutup-title" className="script-title">
            Matur Sembah Nuwun
          </h2>
          <p className="lead text-base">
            {content.closing.message ||
              "Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih. Mugi Gusti paring berkah."}
          </p>
          {usesIslamicGreeting(content) && <p className="small-ui mt-3.5 tracking-[2px]">WASSALAMU&apos;ALAIKUM WR. WB.</p>}
          <p className="mb-1 mt-3.5 font-display text-[22px] font-medium uppercase tracking-[5px] text-gold-300">
            {pair[0].nickname} &amp; {pair[1].nickname}
          </p>
          <p className="small-ui">{content.closing.signature || "Kami yang berbahagia, beserta keluarga besar"}</p>
        </div>

        <div aria-hidden className="relative -mx-10 mt-[30px] h-[230px] bg-[radial-gradient(ellipse_at_50%_70%,rgba(206,172,89,0.35),transparent_65%)] max-[360px]:-mx-8">
          {/*
            Urutan lapis: gunung → tanah → joglo. Gunung berpijak tepat di garis tanah (bottom 40px),
            joglo 300×173 (viewBox 400×230) diletakkan sehingga umpaknya (y 222/230 → 6px dari bawah)
            berdiri di atas tanah: bottom = 40 − 6 = 34px.
          */}
          <Glyph id="mountains" className="absolute inset-x-0 bottom-10 h-[130px] w-full" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-sogan-950" />
          <Glyph id="joglo" className="absolute bottom-[34px] left-1/2 -ml-[150px] h-[173px] w-[300px]" />
        </div>
      </section>

      <footer className="bg-sogan-950 px-[30px] pb-[90px] pt-[26px] text-center font-sans text-[11px] text-cream-200">
        <p className="mb-1 font-display text-[13px] font-medium uppercase tracking-[3px] text-gold-400">
          {pair[0].nickname} · {pair[1].nickname}
        </p>
        <p className="mt-1.5">
          Dibuat oleh{" "}
          <a href={CREDIT.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 transition text-gold-300 decoration-gold-400/50 hover:text-gold-400 hover:decoration-gold-400">
            {CREDIT.site}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={CREDIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CREDIT.instagram}`} className="inline-block py-1 underline underline-offset-4 transition text-gold-300 decoration-gold-400/50 hover:text-gold-400 hover:decoration-gold-400">
            {CREDIT.instagram}
          </a>
        </p>
      </footer>
    </>
  );
}
