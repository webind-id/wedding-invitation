"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useInvitation } from "../InvitationContext";
import { SectionHeading } from "../ui/SectionHeading";

/** "Kisah Kami": garis waktu emas di atas merah berpola koin. */
export function Story() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  if (content.story.length === 0) return null;

  return (
    <section ref={ref} id="kisah" aria-labelledby="kisah-title" className="sec sec-dark">
      <SectionHeading id="kisah-title" title="Kisah Kami" variant="script" showDivider={false} />
      <p data-reveal="up" className="small-ui mt-1 uppercase tracking-[2px]">
        Perjalanan cinta kami
      </p>

      <ol className="relative mt-[30px] pl-[34px] text-left before:absolute before:bottom-1.5 before:left-3 before:top-1.5 before:w-px before:bg-gradient-to-b before:from-gold-500 before:to-gold-300">
        {content.story.map((chapter, i) => (
          <li
            key={`${chapter.year}-${i}`}
            data-reveal="up"
            className="relative mb-[22px] rounded-2xl bg-ivory px-[18px] pb-4 pt-[18px] shadow-[0_8px_22px_rgba(0,0,0,0.2)] last:mb-0"
          >
            <span aria-hidden className="absolute -left-[29px] top-5 h-3.5 w-3.5 rounded-full bg-gold-400 shadow-[0_0_0_4px_rgba(201,162,75,0.3)]" />
            <p className="font-sans text-[10px] uppercase tracking-[2px] text-gold-600">{chapter.year}</p>
            <h3 className="mb-1.5 mt-0.5 font-display text-base font-semibold tracking-[1px] text-red-800">{chapter.title}</h3>
            <p className="text-[15px] leading-[1.6] text-ink-700 [text-wrap:pretty]">{chapter.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
