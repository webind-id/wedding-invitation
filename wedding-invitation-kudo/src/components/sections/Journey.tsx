"use client";

import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";
import { useInvitation } from "../InvitationContext";

/** Linimasa vertikal: tahun dalam lingkaran di atas garis putus-putus. */
export function Journey() {
  const { story } = useInvitation().content;
  if (story.length === 0) return null;

  return (
    <section id="kisah" aria-labelledby="kisah-title" className="bg-parchment/60 px-6 py-20">
      <Heading eyebrow="Perjalanan kami" id="kisah-title">
        Bab demi bab
      </Heading>

      <ol className="relative mt-12 space-y-10 before:absolute before:bottom-4 before:left-[1.6rem] before:top-4 before:border-l-2 before:border-dashed before:border-clay/40">
        {story.map((chapter, i) => (
          <FadeIn as="li" key={`${chapter.year}-${chapter.title}`} delay={i * 0.05} className="relative flex gap-5">
            <span className="relative z-10 flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-full bg-linen font-display text-sm italic text-clay ring-2 ring-clay/40">
              {chapter.year}
            </span>
            <div className="pt-2">
              <h3 className="font-display text-xl italic text-forest">{chapter.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark/75">{chapter.text}</p>
            </div>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
