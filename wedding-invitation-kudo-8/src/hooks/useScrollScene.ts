"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Semua gerak scroll satu adegan — satu sistem untuk seluruh halaman.
 *
 * Masuk (sekali, tidak berulang):
 *   data-reveal="up|fade|zoom"   muncul saat terlihat
 *   data-reveal-group            anak [data-reveal-item] muncul bergantian
 *
 * Parallax (mengikuti scroll; di ponsel amplitudonya setengah):
 *   data-depth="px"              y +px → −px saat melintasi layar (negatif = arah sebaliknya)
 *   data-drift="px"              x px → 0 saat mendekati tengah layar (gunungan "ditancapkan")
 *   data-spin="deg"              berputar −deg/2 → deg/2
 *   data-turn="deg"              rotateY deg → 0 saat mendekat (kartu berbalik menghadap)
 *   data-twirl="deg"             rotateY −deg/2 → deg/2 sepanjang adegan (gunungan dimainkan dalang)
 *   data-parallax + [data-parallax-layer]   foto bergeser di dalam bingkainya (lihat <Photo parallax>)
 *   data-zoom="0.12"             Ken Burns: skala 1.12 → 1 sepanjang adegan (latar foto film);
 *                                trigger = ancestor [data-zoom-track] bila ada
 *
 * prefers-reduced-motion: tidak ada gerak sama sekali, semua langsung terlihat.
 * Jangan gabungkan data-reveal dengan atribut parallax di elemen yang sama — pakai pembungkus.
 */
export function useScrollScene(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const k = desktop ? 1 : 0.5;
          const q = gsap.utils.selector(scope);
          const num = (el: Element, key: string) => Number((el as HTMLElement).dataset[key]) || 0;
          const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });
          const across = (trigger: Element) => ({ trigger, start: "top bottom", end: "bottom top", scrub: 0.8 });
          // clamp(): titik akhir tidak melampaui ujung halaman, jadi elemen di dasar halaman tetap selesai bergerak.
          const approach = (trigger: Element) => ({ trigger, start: "top bottom", end: "clamp(center 55%)", scrub: 0.8 });

          // ── Masuk ──
          q("[data-reveal='up']").forEach((el) => gsap.from(el, { autoAlpha: 0, y: 24, duration: 1.3, ease: "power3.out", scrollTrigger: once(el) }));
          q("[data-reveal='fade']").forEach((el) => gsap.from(el, { autoAlpha: 0, duration: 1.6, ease: "power1.out", scrollTrigger: once(el) }));
          q("[data-reveal='zoom']").forEach((el) =>
            gsap.from(el, { autoAlpha: 0, scale: desktop ? 0.94 : 0.97, duration: 1.6, ease: "power3.out", scrollTrigger: once(el) }),
          );
          q("[data-reveal-group]").forEach((group) => {
            const items = group.querySelectorAll("[data-reveal-item]");
            if (items.length) gsap.from(items, { autoAlpha: 0, y: 20, duration: 1.1, ease: "power3.out", stagger: 0.14, scrollTrigger: once(group) });
          });

          // ── Parallax ──
          q("[data-depth]").forEach((el) => {
            const d = num(el, "depth") * k;
            gsap.fromTo(el, { y: d }, { y: -d, ease: "none", scrollTrigger: across(el) });
          });
          q("[data-drift]").forEach((el) => gsap.fromTo(el, { x: num(el, "drift") * k }, { x: 0, ease: "none", scrollTrigger: approach(el) }));
          q("[data-spin]").forEach((el) => {
            const deg = num(el, "spin");
            gsap.fromTo(el, { rotation: -deg / 2 }, { rotation: deg / 2, ease: "none", scrollTrigger: across(el) });
          });
          q("[data-turn]").forEach((el) => gsap.fromTo(el, { rotationY: num(el, "turn") * k }, { rotationY: 0, ease: "none", scrollTrigger: approach(el) }));
          q("[data-twirl]").forEach((el) => {
            const deg = num(el, "twirl");
            const track = el.closest("[data-twirl-track]") ?? el;
            gsap.fromTo(el, { rotationY: -deg / 2 }, { rotationY: deg / 2, ease: "none", scrollTrigger: { trigger: track, start: "top bottom", end: "clamp(bottom top)", scrub: 1 } });
          });
          q("[data-zoom]").forEach((el) => {
            const z = num(el, "zoom") * k;
            // Latar sticky tidak bisa jadi pemicu yang andal — pakai pembungkus adegannya.
            const track = el.closest("[data-zoom-track]") ?? el.parentElement ?? el;
            gsap.fromTo(el, { scale: 1 + z }, { scale: 1, ease: "none", scrollTrigger: across(track) });
          });
          q("[data-parallax]").forEach((el) => {
            const layer = el.querySelector("[data-parallax-layer]");
            const amount = num(el, "parallax");
            if (layer && amount) gsap.fromTo(layer, { yPercent: -amount * k }, { yPercent: amount * k, ease: "none", scrollTrigger: across(el) });
          });
        },
      );
      return () => mm.revert();
    },
    { scope },
  );
}

export { gsap, ScrollTrigger };
