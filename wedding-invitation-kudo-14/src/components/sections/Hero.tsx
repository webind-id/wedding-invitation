"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwayZone } from "@/hooks/useSwayZone";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/datetime";
import { coupleHashtag } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Butterfly } from "../taman/Butterfly";
import { Plant } from "../taman/Plant";
import { Wayang } from "../taman/Wayang";

const IMG = "/images/taman";
/** Lama babak "tumbuh & menyambut" sebelum gerbang terbuka (ms) — lihat urutan di globals.css. */
const PART_MS = 3800;

/**
 * Adegan pembuka "Taman Asmara". Sebelum dibuka hanya sampul (TamanCover); adegan ini dimainkan
 * setelah tombol "Buka Undangan", dua babak:
 * 1. `played`: pohon & semak tumbuh dari tanah dan bunga mekar, rapat ke tengah sehingga menutupi
 *    joglo yang muncul di belakangnya; Rama & Shinta naik ke tengah lalu menyembah menyambut tamu;
 *    kupu-kupu berdatangan.
 * 2. `parted` (PART_MS kemudian): Rama & Shinta membuka seperti daun gerbang dan bergeser ke tepi,
 *    tanaman menyibak, joglo & gunung terlihat utuh, lalu nama pengantin tampil.
 * Gerak sekali jalan lewat transisi CSS (globals.css); wayang oleh GSAP (taman/Wayang.tsx).
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const isReduced = useReducedMotion();
  const [isParted, setIsParted] = useState(false);
  const swayClass = useSwayZone(ref);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => setIsParted(true), isReduced ? 0 : PART_MS);
    return () => window.clearTimeout(id);
  }, [isOpen, isReduced]);

  const firstEvent = content.events[0];
  const date = firstEvent ? formatLongDate(firstEvent.start, content.timeZone) : "";
  const hashtag = coupleHashtag(pair[0].nickname, pair[1].nickname);
  const lines = [
    // eslint-disable-next-line @next/next/no-img-element
    <img key="g" src={`${IMG}/gunungan.webp`} alt="" width={264} height={400} className="mx-auto h-[64px] w-auto drop-shadow-[0_6px_14px_rgba(86,22,41,0.25)]" />,
    <p key="k" className="kicker mt-2 text-[9px] tracking-[5px] text-marun-500">Pawiwahan</p>,
    <p key="n" className="mt-1 font-script text-[50px] leading-[1.15] text-marun-800 [text-wrap:balance] max-[360px]:text-[42px]">
      {pair[0].nickname}
      <span className="px-2 font-serif text-[34px] italic text-blush-deep">&amp;</span>
      {pair[1].nickname}
    </p>,
    date ? <p key="d" className="mt-1 font-display text-[11px] uppercase tracking-[2.5px] text-marun-700">{date}</p> : null,
    hashtag ? <p key="t" className="mt-0.5 font-serif text-sm italic text-blush-ink">{hashtag}</p> : null,
  ].filter(Boolean);

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className={cn("taman-hero kawung-bg relative h-[100svh] min-h-[640px] overflow-hidden bg-ivory", swayClass, isOpen && "played", isParted && "parted")}
    >
      <div aria-hidden className="stage absolute inset-0">
        {/* Latar menyambung dari sampul: cahaya fajar, gunung samar (utuh saat gerbang terbuka), bingkai gerbang */}
        <div className="scene-el hero-dawn" />
        <div className="scene-el gunung">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/bg-gunung.webp`} alt="" width={900} height={1205} decoding="async" className="fade-top" />
        </div>
        <div className="cover-arch hero-arch" />

        {/* Pepohonan: belakang (kecil) lalu tengah (besar) */}
        <Plant src={`${IMG}/pohon-2.webp`} width={640} height={631} className="tree-far is-l" grow="tree" delay={0.25} seed={2} />
        <Plant src={`${IMG}/pohon-3.webp`} width={640} height={632} className="tree-far is-r" grow="tree" delay={0.4} seed={3} />
        <Plant src={`${IMG}/pohon-1.webp`} width={640} height={581} className="tree-near is-l" grow="tree" delay={0} seed={1} />
        <Plant src={`${IMG}/pohon-4.webp`} width={628} height={720} className="tree-near is-r" grow="tree" delay={0.15} seed={4} />

        {/* Tanah — naik paling awal begitu dibuka; pohon tumbuh dari baliknya, joglo berpijak di atasnya */}
        <div className="scene-el tanah">
          <span className="tanah-path" />
        </div>

        {/* Joglo — muncul di balik taman yang menutupinya, terlihat utuh saat gerbang terbuka */}
        <div className="scene-el joglo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/joglo.webp`} alt="" width={900} height={488} decoding="async" />
        </div>

        {/* Lapis tengah di depan joglo — rapat menutupinya, menyibak keluar saat gerbang terbuka */}
        <Plant src={`${IMG}/pohon-3.webp`} width={640} height={632} className="tree-mid is-l" grow="tree" delay={0.35} seed={9} />
        <Plant src={`${IMG}/pohon-2.webp`} width={640} height={631} className="tree-mid is-r" grow="tree" delay={0.5} seed={10} mirror />
        <Plant src={`${IMG}/dedaunan.webp`} width={600} height={626} className="bush-mid is-l" grow="tree" delay={0.7} seed={11} />
        <Plant src={`${IMG}/dedaunan.webp`} width={600} height={626} className="bush-mid is-r" grow="tree" delay={0.8} seed={12} mirror />

        {/* Semak dedaunan di kaki adegan */}
        <Plant src={`${IMG}/dedaunan.webp`} width={600} height={626} className="bush is-l" grow="tree" delay={0.5} seed={5} />
        <Plant src={`${IMG}/dedaunan.webp`} width={600} height={626} className="bush is-r" grow="tree" delay={0.6} seed={6} mirror />

        {/* Rama (menghadap kanan) & Shinta (menghadap kiri) */}
        <Wayang src={`${IMG}/rama1.webp`} width={636} height={900} side="left" isOpen={isOpen} isParted={isParted} />
        <Wayang src={`${IMG}/shinta1.webp`} width={637} height={900} side="right" isOpen={isOpen} isParted={isParted} />

        {/* Bunga di depan, mekar — sepasang di tengah ikut menyibak keluar */}
        <Plant src={`${IMG}/bunga-2.webp`} width={475} height={760} className="flower-mid is-l" grow="bloom" delay={1.2} seed={13} />
        <Plant src={`${IMG}/bunga-1.webp`} width={414} height={760} className="flower-mid is-r" grow="bloom" delay={1.35} seed={14} mirror />
        <Plant src={`${IMG}/bunga-1.webp`} width={414} height={760} className="flower is-l" grow="bloom" delay={0.9} seed={7} />
        <Plant src={`${IMG}/bunga-2.webp`} width={475} height={760} className="flower is-r" grow="bloom" delay={1.05} seed={8} mirror />

        {/* Kupu-kupu berdatangan setelah bunga mekar */}
        {isOpen && (
          <>
            <Butterfly seed={1} size={46} area={{ x0: 0.08, x1: 0.5, y0: 0.42, y1: 0.8 }} delay={1.8} />
            <Butterfly seed={2} size={38} area={{ x0: 0.5, x1: 0.92, y0: 0.4, y1: 0.78 }} delay={2.2} flap={0.26} />
            <Butterfly seed={3} size={30} area={{ x0: 0.1, x1: 0.9, y0: 0.34, y1: 0.55 }} delay={4.4} flap={0.22} />
            <Butterfly seed={4} size={34} area={{ x0: 0.15, x1: 0.85, y0: 0.55, y1: 0.9 }} delay={3} flap={0.24} />
          </>
        )}
      </div>

      {/* Salam penyambutan di langit selama Rama & Shinta menyembah; memudar saat gerbang terbuka */}
      <div aria-hidden className="greet-text absolute inset-x-0 top-[12%] z-[4] px-8 text-center">
        <p lang="jv" className="font-jawa text-[26px] tracking-[2px] text-gold-600">ꦱꦸꦒꦼꦁꦫꦮꦸꦃ</p>
        <p className="font-script text-[52px] leading-[1.1] text-marun-800 max-[360px]:text-[44px]">Sugeng Rawuh</p>
        <p className="kicker mt-2 text-marun-500">Ing pawiwahan kami</p>
      </div>

      {/* Nama pengantin — tampil setelah joglo berdiri */}
      <h1 id="hero-title" className="sr-only">{`Pernikahan ${pair[0].nickname} dan ${pair[1].nickname}`}</h1>
      <div aria-hidden className="hero-names absolute inset-x-0 top-[5%] z-[4] px-8 text-center">
        {lines.map((line, i) => (
          <div key={i} className="panel-line" style={{ "--i": i } as CSSProperties}>
            {line}
          </div>
        ))}
      </div>

      <div aria-hidden className="scroll-hint absolute bottom-[18px] left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-1.5 font-sans text-[9px] uppercase tracking-[3px] text-marun-700">
        <i className="block h-[26px] w-px bg-marun-700" />
        Gulir
      </div>
    </section>
  );
}
