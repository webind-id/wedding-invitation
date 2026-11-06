"use client";

import { folio, RUBRICS } from "@/lib/issue";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Figure } from "../ui/Figure";
import { Reveal } from "../ui/Reveal";

/** Halaman pembuka edisi: daftar isi di kiri, surat pengantar + ayat di kanan. */
export function Contents() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const { verse, invitationIntro } = content;

  return (
    <section id="pengantar" data-rubric="pengantar" aria-labelledby="daftar-isi" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Daftar isi */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="rubric">Di edisi ini</p>
            <h2 id="daftar-isi" className="mt-4 font-serif text-[clamp(3rem,7vw,5.5rem)] font-light leading-none tracking-[-0.03em]">
              Daftar <em>isi</em>
            </h2>
          </Reveal>
          <ol className="mt-10">
            {RUBRICS.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 0.05}>
                <a href={`#${r.id}`} className="group flex items-baseline gap-4 border-b border-rule py-3.5 transition duration-500 hover:pl-2">
                  <span className="w-8 font-serif text-sm italic text-gold">{folio(r.page)}</span>
                  <span className="flex-1 font-serif text-xl group-hover:italic">{r.label}</span>
                  <span aria-hidden className="text-stone transition duration-500 group-hover:translate-x-1 group-hover:text-ink">
                    →
                  </span>
                </a>
              </Reveal>
            ))}
          </ol>
          <Figure
            src={content.posterPhoto || photoAt(photos, 1)}
            alt=""
            number={1}
            caption="Potret edisi ini."
            frameClassName="aspect-[3/2]"
            className="mt-14 hidden lg:block"
          />
        </div>

        {/* Surat pengantar */}
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-28">
          <Reveal>
            <p className="rubric">Surat pengantar</p>
            <p className="mt-6 font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-snug text-balance">
              Para pembaca yang kami cintai,
            </p>
          </Reveal>
          {invitationIntro && (
            <Reveal delay={0.1} className="article mt-6">
              <p className="drop-cap">{invitationIntro}</p>
            </Reveal>
          )}

          {(verse.arabic || verse.translation) && (
            <Reveal delay={0.15} as="article" className="my-14 border-y border-ink py-10">
              {verse.arabic && (
                <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.1] sm:text-[1.7rem]">
                  {verse.arabic}
                </p>
              )}
              {verse.translation && (
                <blockquote className="mt-6 font-serif text-2xl font-light italic leading-snug text-ink/90 sm:text-[1.7rem]">
                  “{verse.translation}”
                </blockquote>
              )}
              {verse.source && <p className="rubric mt-5">— {verse.source}</p>}
            </Reveal>
          )}

          <Reveal delay={0.2}>
            <p className="font-serif text-lg italic text-stone">Dengan cinta,</p>
            <p className="mt-1 font-serif text-3xl font-light">
              {first.nickname} <span className="italic text-gold">&amp;</span> {second.nickname}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
