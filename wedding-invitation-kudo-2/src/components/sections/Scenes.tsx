"use client";

import { cn } from "@/lib/cn";
import { photoAt, reelNumber } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";

/**
 * Kisah cinta sebagai rangkaian adegan: setiap bab dipasangkan dengan satu
 * foto berformat layar lebar (2.39:1), bergantian kiri–kanan di desktop.
 */
export function Scenes() {
  const { content, photos } = useInvitation();
  if (content.story.length === 0) return null;

  return (
    <section id="adegan" aria-labelledby="adegan-title" className="film-grain bg-onyx py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Title reel="03" label="Adegan demi adegan" id="adegan-title">
          Kisah <em className="text-gold">di balik layar</em>
        </Title>

        <ol className="mt-20 space-y-20 sm:space-y-28">
          {content.story.map((chapter, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={`${chapter.year}-${i}`} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <Reveal effect="iris" className={cn("lg:col-span-7", flip && "lg:order-2")}>
                  <div className="relative">
                    <Photo src={photoAt(photos, i + 2)} alt={chapter.title} className="aspect-[2.39/1]" imgClassName="animate-slow-zoom" />
                    {/* Letterbox atas-bawah + nomor adegan seperti papan klapper */}
                    <span aria-hidden className="absolute inset-x-0 top-0 h-3 bg-void" />
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-3 bg-void" />
                    <span className="absolute left-4 top-6 font-display text-6xl italic leading-none text-ivory/90 drop-shadow-lg">
                      {reelNumber(i + 1)}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.15} className={cn("lg:col-span-5", flip && "lg:order-1 lg:text-right")}>
                  <p className="credit">Adegan {reelNumber(i + 1)} · {chapter.year}</p>
                  <h3 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{chapter.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-smoke sm:text-base">{chapter.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
