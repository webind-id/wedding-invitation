"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { usesIslamicGreeting } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { NightLeaves } from "../taman/Foliage";
import { Butterfly } from "../taman/Butterfly";
import { Plant } from "../taman/Plant";
import { Photo } from "../ui/Photo";
import { CREDIT } from "@/shared/credit";

export function Closing() {
  const { content, pair, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const swayClass = useSwayZone(ref);

  const year = content.events[0] ? new Date(content.events[0].start).getUTCFullYear() : "";

  return (
    <>
      <section ref={ref} id="penutup" aria-labelledby="penutup-title" className={`sec sec-dark pb-0 ${swayClass}`}>
        <NightLeaves />
        <div className="relative z-[1]">
          <Babak
            id="penutup-title"
            name="Tancep Kayon"
            title="Matur Sembah Nuwun"
            lead={
              content.closing.message ||
              "Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih. Mugi Gusti paring berkah."
            }
          />

          <div data-reveal="up" className="mt-10 grid grid-cols-[minmax(0,1fr)_42%] items-end gap-5">
            <div className="text-left">
              {usesIslamicGreeting(content) && <p className="small-ui mb-3 tracking-[2px]">WASSALAMU&apos;ALAIKUM WR. WB.</p>}
              <p className="small-ui">{content.closing.signature || "Kami yang berbahagia, beserta keluarga besar"}</p>
              {/* Satu nama per baris: kolom ini sempit di samping foto. */}
              <p className="mt-2 break-words font-script text-[42px] leading-[1.05] text-gold-300">
                <span className="block">{pair[0].nickname}</span>
                <span className="block pl-6 font-serif text-[28px] italic leading-none text-blush">&amp;</span>
                <span className="block">{pair[1].nickname}</span>
              </p>
            </div>
            {content.posterPhoto && (
              <div className="gerbang h-[220px]">
                <Photo src={content.posterPhoto} alt={`Foto ${coupleLabel}`} className="h-full w-full" />
              </div>
            )}
          </div>
        </div>

        {/*
          Tancep kayon: gunungan ditancapkan di puncak jendela gerbang — tanda lakon usai. Jendela
          ivory berisi gunung, pepohonan, joglo di atas tanah, bunga, dan dua kupu-kupu (gema adegan
          pembuka); joglo marun butuh latar terang agar tidak tenggelam di bagian gelap.

          Ukuran: puncak jendela melengkung ±170px teratas (setengah lebar). Joglo harus mulai DI
          BAWAH lengkungan, kalau tidak ujung atapnya terpotong: tinggi 360px, joglo 72% lebar
          (±130px tinggi) berpijak di 16% → puncak atap ±173px dari atas.
        */}
        <div aria-hidden className="relative z-[1] mx-auto mt-24 max-w-[340px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/taman/gunungan.webp" alt="" width={264} height={400} loading="lazy" decoding="async" className="absolute -top-[74px] left-1/2 z-[4] h-[110px] w-auto -translate-x-1/2 drop-shadow-[0_8px_14px_rgba(0,0,0,0.4)]" />
          <div className="relative h-[360px] overflow-hidden rounded-t-[999px] border-x-[5px] border-t-[5px] border-gold-500 bg-ivory">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/taman/bg-gunung.webp" alt="" width={900} height={1205} loading="lazy" decoding="async" className="absolute inset-x-0 -top-[30px] w-full" />
            {/* Pepohonan di belakang joglo, pangkalnya tertutup tanah */}
            <Plant src="/images/taman/pohon-1.webp" width={640} height={581} className="-left-[18%] bottom-[15%] w-[50%]" grow="none" seed={21} lazy />
            <Plant src="/images/taman/pohon-4.webp" width={628} height={720} className="-right-[15%] bottom-[15%] w-[44%]" grow="none" seed={22} lazy />
            {/* Tanah tempat joglo berpijak — sama dengan adegan pembuka, tanpa animasi */}
            <div className="scene-el tanah is-static">
              <span className="tanah-path" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/taman/joglo.webp" alt="" width={900} height={488} loading="lazy" decoding="async" className="absolute inset-x-0 bottom-[16%] mx-auto w-[72%] drop-shadow-[0_10px_12px_rgba(86,22,41,0.2)]" />
            {/* Bunga di kedua kaki joglo */}
            <Plant src="/images/taman/bunga-1.webp" width={414} height={760} className="-bottom-[3%] -left-[4%] w-[25%]" grow="none" seed={23} lazy />
            <Plant src="/images/taman/bunga-2.webp" width={475} height={760} className="-bottom-[3%] -right-[4%] w-[27%]" grow="none" seed={24} mirror lazy />
            <Butterfly seed={11} size={30} area={{ x0: 0.15, x1: 0.85, y0: 0.12, y1: 0.45 }} delay={0.4} flap={0.24} />
            <Butterfly seed={12} size={24} area={{ x0: 0.2, x1: 0.8, y0: 0.15, y1: 0.5 }} delay={1.2} flap={0.2} />
          </div>
          {/* Rumpun dedaunan di luar kedua sisi bingkai, menjuntai di depan garis emas */}
          <Plant src="/images/taman/dedaunan.webp" width={600} height={626} className="-bottom-7 -left-[62px] z-[3] w-[108px]" grow="none" seed={25} lazy />
          <Plant src="/images/taman/dedaunan.webp" width={600} height={626} className="-bottom-7 -right-[62px] z-[3] w-[108px]" grow="none" seed={26} mirror lazy />
        </div>
      </section>

      <footer className="bg-marun-950 px-[30px] pb-[90px] pt-[26px] text-center font-sans text-[11px] text-cream-200">
        <p className="mb-1 font-display text-[13px] font-medium uppercase tracking-[3px] text-gold-400">
          {pair[0].nickname} · {pair[1].nickname}
        </p>
        <p>Undangan digital bertema adat Jawa{year ? ` · ${year}` : ""}</p>
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
