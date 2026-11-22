"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { useInvitation } from "../InvitationContext";
import { Glyph, Lanterns } from "../klenteng/Ornaments";
import { BambooGrove, PlumTree } from "../klenteng/Trees";
import { Photo } from "../ui/Photo";
import { CREDIT } from "@/shared/credit";

export function Closing() {
  const { content, pair, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useSwayZone(ref);
  useScrollScene(ref);

  const year = content.events[0] ? new Date(content.events[0].start).getUTCFullYear() : "";

  return (
    <>
      <section ref={ref} id="penutup" aria-labelledby="penutup-title" className="sec sec-dark lanterns-show pb-0">
        <Lanterns count={2} side="left" />
        <Lanterns count={2} side="right" />

        <div data-reveal="up" className="pt-10">
          {content.posterPhoto && (
            <div className="moon mb-7 h-[190px] w-[190px]">
              <div className="moon-in">
                <Photo src={content.posterPhoto} alt={`Foto ${coupleLabel}`} className="h-full w-full" />
              </div>
            </div>
          )}
          <p lang="zh" className="font-han text-[30px] tracking-[10px] text-gold-400">
            谢谢
          </p>
          <h2 id="penutup-title" className="script-title">
            Terima Kasih
          </h2>
          <p className="lead text-base">
            {content.closing.message ||
              "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas perhatiannya, kami ucapkan terima kasih."}
          </p>
          <p className="mb-1 mt-3.5 font-display text-[22px] font-medium uppercase tracking-[5px] text-gold-300">
            {pair[0].nickname} &amp; {pair[1].nickname}
          </p>
          <p className="small-ui">{content.closing.signature || "Kami yang berbahagia, beserta keluarga besar"}</p>
        </div>

        <div
          aria-hidden
          className="relative -mx-10 mt-[30px] h-[270px] [clip-path:inset(-400px_0_0_0)] bg-[radial-gradient(ellipse_at_50%_70%,rgba(237,170,90,0.4),transparent_65%)] max-[360px]:-mx-8"
        >
          {/*
            Urutan lapis: gunung → bambu → tanah → klenteng → pohon mei. Gunung & bambu berpijak di
            garis tanah (bottom 40px). Klenteng 300×180 (viewBox 400×240): alasnya (y 234/240 →
            4.5px dari bawah) berdiri di atas tanah: bottom = 40 − 4.5 ≈ 36px.
          */}
          <Glyph id="mountains" className="absolute inset-x-0 bottom-10 h-[150px] w-full opacity-80" />
          <div className="absolute bottom-10 -left-[8%] h-[85%] w-[40%] opacity-55">
            <BambooGrove seed={51} />
          </div>
          <div className="absolute -right-[8%] bottom-10 h-[85%] w-[40%] opacity-55">
            <BambooGrove seed={58} mirror />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-red-950" />
          <Glyph id="temple" className="absolute bottom-9 left-1/2 -ml-[150px] h-[180px] w-[300px]" />
          <div className="absolute -left-[14%] bottom-[30px] h-full w-[48%]">
            <PlumTree seed={62} lean={12} />
          </div>
          <div className="absolute -right-[14%] bottom-[30px] h-full w-[48%]">
            <PlumTree seed={71} lean={10} mirror />
          </div>
        </div>
      </section>

      <footer className="bg-red-950 px-[30px] pb-[90px] pt-[26px] text-center font-sans text-[11px] text-cream-200">
        <p className="mb-1 font-display text-[13px] font-medium uppercase tracking-[3px] text-gold-400">
          {pair[0].nickname} · {pair[1].nickname}
        </p>
        <p>Undangan digital bertema klenteng{year ? ` · ${year}` : ""}</p>
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
