"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { gsap } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { cn } from "@/lib/cn";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { panelNameSize, panelNameTracking } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Glyph, Lanterns } from "../klenteng/Ornaments";
import { BambooGrove, BlossomBush, PlumTree } from "../klenteng/Trees";

/**
 * Adegan pembuka: senja merah di depan klenteng, gunung karst, awan xiangyun, bambu, pohon mei.
 * Selama sampul tampil, adegan ini sudah terlihat di bawah sampul (diperbesar 1,6×). Saat dibuka
 * (`isOpen`) kamera mundur, pepohonan depan menyibak, lalu gerbang rembulan bernama pengantin muncul.
 * Semua sekali jalan (kelas `played`, lihat globals.css). Awan & lampion diam (tanpa loop).
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useSwayZone(ref);

  // Matahari & gunung bergeser pelan saat halaman di-scroll (parallax).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-speed]", ref.current).forEach((el) => {
          gsap.to(el, {
            y: () => window.innerHeight * Number(el.dataset.speed),
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const firstEvent = content.events[0];
  const date = firstEvent
    ? `${formatLongDate(firstEvent.start, content.timeZone).split(",")[0]}, ${formatDotDate(firstEvent.start, content.timeZone)}`.toUpperCase()
    : "";
  const lines = [
    <p key="xi" lang="zh" className="font-han text-[34px] leading-none text-gold-400">囍</p>,
    <p key="k" className="kicker mt-2 text-[9px] tracking-[5px] text-gold-300">The Wedding of</p>,
    <PanelName key="a" name={pair[0].nickname} className="mt-1.5" />,
    <span key="amp" className="block font-serif text-[34px] italic leading-[0.95] text-gold-400">&amp;</span>,
    <PanelName key="b" name={pair[1].nickname} />,
    date ? <p key="d" className="mt-2.5 font-display text-[11px] tracking-[2.5px] text-gold-300">{date}</p> : null,
  ].filter(Boolean);

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className={cn("hero-sky relative h-[100svh] min-h-[640px] overflow-hidden text-cream-100", isOpen && "played lanterns-show")}
    >
      <div aria-hidden className="stage absolute inset-0">
        <div data-speed="0.12" className="scene-el sun-glow" />
        <div data-speed="0.1" className="scene-el inset-x-0 bottom-[16%] h-[230px]">
          <Glyph id="mountains" className="h-full w-full" />
        </div>
        <Glyph id="cloud" className="scene-el left-[6%] top-[30%] h-10 w-[150px] opacity-50" />
        <Glyph id="cloud" className="scene-el right-[4%] top-[44%] h-[30px] w-[110px] opacity-35" />
        <div className="scene-el far-bamboo is-l"><BambooGrove seed={4} /></div>
        <div className="scene-el far-bamboo is-r"><BambooGrove seed={12} mirror /></div>
        <div className="scene-el inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-[#7A2A1A] to-red-950" />
        <div className="scene-el bottom-[5%] left-1/2 -ml-[175px] h-[210px] w-[350px]">
          <Glyph id="temple" className="h-full w-full" />
        </div>
        <div className="scene-el mid-bush is-l"><BlossomBush seed={5} tone="mid" /></div>
        <div className="scene-el mid-bush is-r"><BlossomBush seed={9} tone="mid" mirror /></div>
        <div className="scene-el near-tree is-l"><PlumTree seed={3} lean={8} /></div>
        <div className="scene-el near-tree is-r"><PlumTree seed={8} lean={6} mirror /></div>
        <div className="scene-el fg-bush is-l"><BlossomBush seed={14} tone="fg" /></div>
        <div className="scene-el fg-bush is-r"><BlossomBush seed={21} tone="fg" mirror /></div>
      </div>

      <Lanterns count={2} side="left" delay={2.4} />
      <Lanterns count={2} side="right" delay={2.4} />

      {/* Gerbang rembulan (月门) bernama pengantin */}
      <div className="name-panel absolute left-1/2 top-[9%] z-[4] -ml-[145px] h-[290px] w-[290px] max-[360px]:-ml-[130px] max-[360px]:h-[260px] max-[360px]:w-[260px]">
        <svg viewBox="0 0 300 300" aria-hidden className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]">
          <circle cx="150" cy="150" r="146" fill="#4A0909" fillOpacity=".9" stroke="#C9A24B" strokeWidth="3" />
          <circle className="panel-draw" cx="150" cy="150" r="133" fill="none" stroke="#EDD9A0" strokeWidth="1.2" />
          <circle cx="150" cy="150" r="126" fill="none" stroke="#C9A24B" strokeWidth=".6" strokeDasharray="2 5" opacity=".7" />
          <g transform="translate(75 236)" opacity=".5">
            <use href="#kl-cloud" width="150" height="40" />
          </g>
        </svg>

        <h1 id="hero-title" className="sr-only">{`Pernikahan ${pair[0].nickname} dan ${pair[1].nickname}`}</h1>
        <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center px-[30px] text-center">
          {lines.map((line, i) => (
            <div key={i} className="panel-line" style={{ "--i": i } as CSSProperties}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden className="scroll-hint absolute bottom-[22px] left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-1.5 font-sans text-[9px] uppercase tracking-[3px] text-gold-300">
        <i className="block h-[26px] w-px bg-gold-300" />
        Gulir
      </div>
    </section>
  );
}

/** Nama dalam gerbang: Cinzel kapital, dikecilkan bila panjang agar tetap di dalam lingkaran. */
function PanelName({ name, className }: { name: string; className?: string }) {
  const size = panelNameSize(name);
  return (
    <p className={cn("whitespace-nowrap font-display font-medium uppercase text-ivory", className)} style={{ fontSize: size, letterSpacing: panelNameTracking(size) }}>
      {name}
    </p>
  );
}
