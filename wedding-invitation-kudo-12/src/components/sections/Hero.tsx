"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { gsap } from "@/hooks/useScrollScene";
import { useSwayZone } from "@/hooks/useSwayZone";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/datetime";
import { coupleHashtag, panelNameSize } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { Glyph, Ronce } from "../jawa/Ornaments";
import { Bush, Palm } from "../jawa/Trees";
import { Wayang } from "../jawa/Wayang";

/**
 * Adegan pembuka: senja di pendopo joglo, gunung, pohon kelapa & semak bunga. Selama sampul
 * tampil, adegan ini sudah terlihat di bawah sampul (diperbesar 1,6×). Saat dibuka (`isOpen`)
 * kamera mundur, lapisan daun menyibak ke samping, lalu panel gunungan bernama pengantin muncul.
 * Semua sekali jalan (kelas `played`, lihat globals.css).
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
  const date = firstEvent ? formatLongDate(firstEvent.start, content.timeZone).toUpperCase() : "";
  const hashtag = coupleHashtag(pair[0].nickname, pair[1].nickname);
  const lines = [
    <p key="k" className="kicker text-[9px] tracking-[5px] text-gold-300">Pawiwahan</p>,
    <PanelName key="a" name={pair[0].nickname} className="mt-2.5" />,
    <span key="amp" className="block font-serif text-[40px] italic leading-none text-blush">&amp;</span>,
    <PanelName key="b" name={pair[1].nickname} />,
    date ? <p key="d" className="mt-3 font-display text-[11px] tracking-[2.5px] text-gold-300">{date}</p> : null,
    hashtag ? <p key="t" className="mt-0.5 font-serif text-sm italic text-blush">{hashtag}</p> : null,
  ].filter(Boolean);

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className={cn("hero-sky relative h-[100svh] min-h-[640px] overflow-hidden text-cream-100", isOpen && "played ronce-show")}
    >
      <div aria-hidden className="stage absolute inset-0">
        <div data-speed="0.12" className="scene-el sun-glow" />
        <div data-speed="0.1" className="scene-el inset-x-0 bottom-[17%] h-[170px]">
          <Glyph id="mountains" className="h-full w-full" />
        </div>
        <div className="scene-el far-palm is-l"><Palm seed={11} tone="far" lean={-26} /></div>
        <div className="scene-el far-palm is-r"><Palm seed={23} tone="far" lean={-20} mirror /></div>
        <div className="scene-el inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-[#634530] to-sogan-900" />
        <div className="scene-el bottom-[6%] left-1/2 -ml-[170px] h-[196px] w-[340px]">
          <Glyph id="joglo" className="h-full w-full" />
        </div>
        <div className="scene-el mid-bush is-l"><Bush seed={5} tone="mid" /></div>
        <div className="scene-el mid-bush is-r"><Bush seed={9} tone="mid" mirror /></div>
        <div className="scene-el near-palm is-l"><Palm seed={3} tone="near" lean={34} /></div>
        <div className="scene-el near-palm is-r"><Palm seed={7} tone="near" lean={40} mirror /></div>
        {/* Rama (menghadap kanan) & Shinta (menghadap kiri) dimainkan bak dalang, lalu berhadapan */}
        <Wayang src="/images/jawa/rama.webp" width={418} height={760} side="left" isOpen={isOpen} delay={1.6} />
        <Wayang src="/images/jawa/shinta.webp" width={409} height={760} side="right" isOpen={isOpen} delay={1.9} />
        <div className="scene-el fg-bush is-l"><Bush seed={14} tone="fg" /></div>
        <div className="scene-el fg-bush is-r"><Bush seed={21} tone="fg" mirror /></div>
      </div>

      <Ronce strands={2} side="left" delay={2.4} />
      <Ronce strands={2} side="right" delay={2.4} />

      {/* Panel nama berbentuk gunungan */}
      <div className="name-panel absolute left-1/2 top-[8%] z-[4] -ml-[135px] aspect-[200/300] w-[270px]">
        <svg viewBox="0 0 200 300" aria-hidden className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]">
          <path d="M100 4 C118 46 168 104 184 176 C192 214 186 250 172 282 L28 282 C14 250 8 214 16 176 C32 104 82 46 100 4Z" fill="#2E1E12" fillOpacity=".9" stroke="#CEAC59" strokeWidth="2" />
          <path className="panel-draw" d="M100 16 C116 54 160 108 173 176 C180 212 175 244 163 272 L37 272 C25 244 20 212 27 176 C40 108 84 54 100 16Z" fill="none" stroke="#E9D6A0" strokeWidth="1" />
          <g fill="none" stroke="#CEAC59" strokeWidth="1.4" strokeLinecap="round" opacity=".55">
            <path d="M100 30 V70" />
            <path d="M100 58 C90 50 80 54 78 62 C77 69 84 71 88 67" />
            <path d="M100 58 C110 50 120 54 122 62 C123 69 116 71 112 67" />
          </g>
          <g fill="#CEAC59">
            <circle cx="100" cy="28" r="2.5" />
            <path d="M92 256 h16 l-8 8z" />
          </g>
        </svg>

        <h1 id="hero-title" className="sr-only">{`Pernikahan ${pair[0].nickname} dan ${pair[1].nickname}`}</h1>
        <div aria-hidden className="absolute inset-x-0 top-[31%] px-5 text-center">
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

/** Nama dalam panel: Cinzel kapital, dikecilkan bila panjang agar tetap di dalam gunungan. */
function PanelName({ name, className }: { name: string; className?: string }) {
  return (
    <p
      className={cn("whitespace-nowrap font-display font-medium uppercase text-ivory", className)}
      style={{ fontSize: panelNameSize(name), letterSpacing: panelNameSize(name) >= 25 ? 6 : 3 }}
    >
      {name}
    </p>
  );
}
