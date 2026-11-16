"use client";

import { useGSAP } from "@gsap/react";
import { CalendarHeart, MapPin } from "lucide-react";
import { useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Lantern3D } from "../lantern/Lantern3D";
import { LanternSky } from "../lantern/LanternSky";
import { Photo } from "../ui/Photo";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair, monogram } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  useScrollScene(ref);
  useTilt(frameRef, 6);

  const countdown = useCountdown(content.events[0]?.start ?? "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-intro]", ref.current);
        if (!isOpen) {
          gsap.set(items, { autoAlpha: 0, y: 24 });
          return;
        }
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.1 });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [isOpen] },
  );

  const firstEvent = content.events[0];
  const dateStr = firstEvent ? formatLongDate(firstEvent.start, content.timeZone) : "";
  const dotDate = firstEvent ? formatDotDate(firstEvent.start, content.timeZone) : "";

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className="night-sky relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-28"
    >
      <div aria-hidden className="moon-disc pointer-events-none absolute right-[6%] top-[3%] h-10 w-10 opacity-80 sm:right-[10%] sm:top-[6%] sm:h-20 sm:w-20" />
      <LanternSky mode="rise" count={14} seed={21} options={{ maxSize: 40 }} className="[--rise:160vh]" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <div data-intro>
          <span className="badge-gold">Malam Seribu Lampion</span>
        </div>

        <p data-intro className="text-glow mt-4 font-script text-4xl text-ember-300 sm:text-5xl">
          The Wedding of
        </p>

        <h1
          id="hero-title"
          data-intro
          className="my-2 font-serif text-5xl font-semibold leading-tight tracking-tight text-moon sm:text-6xl md:text-7xl"
        >
          {pair[0].nickname}
          <span className="text-glow mx-3 inline-block font-serif text-4xl font-normal italic text-ember-300 sm:text-5xl">&amp;</span>
          {pair[1].nickname}
        </h1>

        <div data-intro className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-moon-muted sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <CalendarHeart className="h-4 w-4 text-ember-300" aria-hidden />
            {dateStr}
          </span>
          {firstEvent?.venue && (
            <>
              <span className="text-gold/50">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ember-300" aria-hidden />
                {firstEvent.venue}
              </span>
            </>
          )}
        </div>

        {/* Foto utama dalam bingkai lampion, digantung seutas tali */}
        <div data-intro className="relative mt-14 w-full max-w-[17rem] sm:max-w-xs [perspective:1000px]">
          <div aria-hidden className="absolute -top-14 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
            <span className="h-6 w-px bg-gold/50" />
            <Lantern3D size={30} variant="crimson" spin={12} />
          </div>
          <div ref={frameRef} className="preserve-3d">
            <div className="lantern-frame">
              <div className="lantern-frame-inner aspect-[4/5] w-full">
                <Photo
                  src={content.coverPhoto}
                  alt={`Foto pernikahan ${pair[0].nickname} dan ${pair[1].nickname}`}
                  className="h-full w-full"
                  eager
                  parallax={5}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night-950/60 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-4 text-center font-sans text-[0.7rem] tracking-[0.3em] text-gold-light">
                  {dotDate}
                </p>
              </div>
            </div>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-night-900 px-3 py-0.5 font-serif text-sm font-semibold tracking-widest text-gold-light">
              {monogram}
            </span>
          </div>
        </div>

        {/* Hitung mundur */}
        <div data-intro className="mt-12 w-full max-w-md">
          <p className="mb-4 font-sans text-[0.7rem] uppercase tracking-[0.3em] text-moon-subtle">Menuju malam bahagia</p>
          {countdown?.done ? (
            <p className="text-glow font-serif text-2xl font-semibold text-ember-200">Hari bahagia telah tiba!</p>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {UNITS.map(({ key, label }) => (
                <div
                  key={key}
                  className="rounded-t-[40px] rounded-b-xl border border-gold/25 bg-gradient-to-b from-ember-500/20 to-night-800/80 px-1 pb-3 pt-5 shadow-glow-sm"
                >
                  <span className="block font-serif text-3xl font-semibold tabular-nums text-moon sm:text-4xl">
                    {countdown ? String(countdown[key]).padStart(2, "0") : "—"}
                  </span>
                  <span className="mt-0.5 block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ember-200">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
