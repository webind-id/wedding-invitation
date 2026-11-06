"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Kisah pasangan. Satu bunga besar menempel di samping (sticky) dan mekar perlahan —
 * cincin kelopaknya merenggang — seiring cerita dibaca dari bab ke bab.
 */
export function Story() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  if (content.story.length === 0) return null;

  return (
    <section ref={ref} data-bloom-track aria-labelledby="story-title" className="relative px-6 py-28 sm:py-40">
      <SectionHeading id="story-title" label="Kisah kami" title="Bagaimana semuanya bermula" />

      <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:mt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-[16vh] md:h-[64vh]">
          <div className="flex h-full items-center justify-center [perspective:1100px]">
            <div data-spin="120" className="preserve-3d">
              <Bloom palette="blush" size="clamp(12rem,32vw,22rem)" seed={2} leaves={5} tilt={42} opensOnScroll />
            </div>
          </div>
        </div>

        <ol className="relative space-y-10 md:space-y-16 md:py-[8vh]">
          {/* Benang tipis yang menghubungkan bab-bab. */}
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-champagne to-transparent md:left-0" />
          {content.story.map((chapter, i) => (
            <li key={`${chapter.year}-${i}`} data-depth={i % 2 ? -26 : 26} className="relative pl-12 md:pl-10">
              <span aria-hidden className="absolute left-[11px] top-9 h-2.5 w-2.5 rotate-45 bg-champagne md:-left-[5px]" />
              <div data-reveal="up" className={cn("pearl-card rounded-[2rem] px-7 py-8 sm:px-9", i % 2 && "md:ml-10")}>
                <p className="font-display text-4xl font-light text-champagne-deep">{chapter.year}</p>
                <h3 className="mt-2 font-display text-2xl italic leading-snug">{chapter.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70 [text-wrap:pretty]">{chapter.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
