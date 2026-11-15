"use client";

import { useGSAP } from "@gsap/react";
import { CalendarHeart, MapPin } from "lucide-react";
import { useRef } from "react";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { useCountdown } from "@/hooks/useCountdown";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { PampasGrass } from "../rustic/PampasGrass";
import { WaxSeal } from "../rustic/WaxSeal";
import { Photo } from "../ui/Photo";

export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair, monogram } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollScene(ref);
  useTilt(cardRef, 5);

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
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1,
        });
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
      className="rustic-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Daun Kering Parallax Latar ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="45" className="absolute -left-12 sm:-left-8 top-[6%] animate-sway-slow opacity-75">
          <DriedPalm size={170} color="#C86D51" opacity={0.55} />
        </div>
        <div data-depth="-35" className="absolute -right-12 sm:-right-8 top-[8%] animate-sway-reverse opacity-70">
          <PampasGrass size={160} color="#D4A373" opacity={0.65} mirror />
        </div>
        <div data-depth="30" className="absolute -left-10 sm:-left-6 bottom-[8%] opacity-65">
          <EucalyptusStem size={130} color="#6B7A5C" opacity={0.6} />
        </div>
        <div data-depth="-40" className="absolute -right-10 sm:-right-6 bottom-[6%] opacity-70">
          <DriedPalm size={180} color="#C86D51" opacity={0.5} mirror />
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Intro Badge */}
        <div data-intro className="mb-2">
          <span className="badge-olive">
            GARDEN &amp; OUTDOOR CELEBRATION
          </span>
        </div>

        <p data-intro className="font-script text-3xl sm:text-4xl text-terracotta mt-2 mb-0">
          The Wedding of
        </p>

        {/* Pasangan Judul */}
        <h1
          id="hero-title"
          data-intro
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-earth-ink my-3 leading-tight"
        >
          {pair[0].nickname}
          <span className="mx-2 sm:mx-3 inline-block font-script text-3xl sm:text-4xl text-terracotta-600 font-normal">
            &amp;
          </span>
          {pair[1].nickname}
        </h1>

        {/* Tanggal & Lokasi Acara */}
        <div data-intro className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-earth-muted mt-1 mb-2">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CalendarHeart className="h-4 w-4 text-terracotta" aria-hidden />
            {dateStr}
          </span>
          {firstEvent?.venue && (
            <>
              <span className="text-sand-deep">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-olive" aria-hidden />
                {firstEvent.venue}
              </span>
            </>
          )}
        </div>

        {/* ── Frame Foto Bohemian Archway Centerpiece ──────────────────── */}
        <div
          ref={cardRef}
          data-intro
          className="preserve-3d relative my-8 w-full max-w-xs sm:max-w-sm [perspective:1000px]"
        >
          <div className="boho-arch-frame bg-cream-50/95 p-3 sm:p-4">
            <div className="boho-arch-inner relative aspect-[4/5] w-full shadow-inner">
              <Photo
                src={content.coverPhoto}
                alt={`Foto pernikahan ${pair[0].nickname} dan ${pair[1].nickname}`}
                className="h-full w-full object-cover"
                eager
                parallax={5}
              />
            </div>

            {/* Aksen Cap Lilin (Wax Seal) di Sudut Atas Frame */}
            <div className="absolute -top-3 -right-3 z-20">
              <WaxSeal monogram={monogram} size={48} variant="terracotta" />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-sand-deep/60 pt-2 font-serif text-[0.72rem] text-earth-muted">
              <span>EST. 2027</span>
              <span className="font-sans font-semibold tracking-wider text-terracotta-700">{dotDate}</span>
            </div>
          </div>
        </div>

        {/* ── Kotak Hitung Mundur (Countdown Timer) ────────────────────── */}
        <div data-intro className="mt-2 w-full max-w-md">
          <div className="rustic-card p-5 sm:p-6 bg-cream-50/90 border border-sand-deep/60">
            <p className="font-sans text-[0.75rem] tracking-widest text-earth-muted uppercase font-semibold mb-4">
              HITUNG MUNDUR HARI BAHAGIA
            </p>

            {countdown?.done ? (
              <p className="font-serif text-lg font-bold text-terracotta-700">
                Hari Bahagia Telah Tiba!
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="rounded-xl border border-sand-deep/50 bg-white p-2.5 sm:p-3 shadow-rustic-sm">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-terracotta-700">
                    {countdown ? String(countdown.days).padStart(2, "0") : "—"}
                  </span>
                  <span className="block font-sans text-[0.68rem] text-olive-700 font-medium uppercase mt-0.5">Hari</span>
                </div>
                <div className="rounded-xl border border-sand-deep/50 bg-white p-2.5 sm:p-3 shadow-rustic-sm">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-terracotta-700">
                    {countdown ? String(countdown.hours).padStart(2, "0") : "—"}
                  </span>
                  <span className="block font-sans text-[0.68rem] text-olive-700 font-medium uppercase mt-0.5">Jam</span>
                </div>
                <div className="rounded-xl border border-sand-deep/50 bg-white p-2.5 sm:p-3 shadow-rustic-sm">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-terracotta-700">
                    {countdown ? String(countdown.minutes).padStart(2, "0") : "—"}
                  </span>
                  <span className="block font-sans text-[0.68rem] text-olive-700 font-medium uppercase mt-0.5">Menit</span>
                </div>
                <div className="rounded-xl border border-sand-deep/50 bg-white p-2.5 sm:p-3 shadow-rustic-sm">
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-terracotta-700">
                    {countdown ? String(countdown.seconds).padStart(2, "0") : "—"}
                  </span>
                  <span className="block font-sans text-[0.68rem] text-olive-700 font-medium uppercase mt-0.5">Detik</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
