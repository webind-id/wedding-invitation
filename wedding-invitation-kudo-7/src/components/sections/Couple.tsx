"use client";

import { AtSign } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Gunungan } from "../three/Gunungan";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function Portrait({ person, depth, label }: { person: Person; depth: number; label: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 5);

  return (
    <article data-depth={depth} className="relative">
      <div data-reveal="up" className="[perspective:1000px]">
        <div ref={cardRef} className="preserve-3d">
          {/* Bingkai gapura: lapis prada di belakang foto */}
          <div className="gapura mx-auto w-[min(76vw,19rem)] bg-prada p-[3px] shadow-[0_40px_70px_-40px_rgba(62,38,21,0.7)]">
            <Photo src={person.photo} alt={person.fullName} parallax={7} className="gapura aspect-[3/4] w-full" />
          </div>
          {/* Papan nama melayang di depan foto (translateZ) — terasa saat dimiringkan. */}
          <div className="panel relative mx-auto -mt-12 w-[min(70vw,17rem)] px-6 pb-6 pt-5 text-center" style={{ transform: "translateZ(40px)" }}>
            <p className="label text-[0.6rem]">{label}</p>
            <p className="mt-1 font-serif text-[2.6rem] italic leading-tight text-ink">{person.nickname}</p>
            <p className="mt-1 font-display text-[0.95rem] leading-snug tracking-wide">
              {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
            </p>
            {/* Data admin sudah berisi "Putri pertama dari", "Bapak …", "Ibu …" — tampilkan apa adanya. */}
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">
              {person.childOrder}
              <br />
              {person.father} &amp; {person.mother}
            </p>
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-display text-xs tracking-wide text-prada-deep transition hover:text-ink"
              >
                <AtSign className="h-3.5 w-3.5" aria-hidden />
                {person.instagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Kedua mempelai di lapisan kedalaman berlawanan; gunungan kecil di tengah berputar mengikuti scroll. */
export function Couple() {
  const { pair, content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const labelOf = (p: Person) => (p === content.bride ? "Penganten putri" : "Penganten kakung");

  return (
    <section ref={ref} data-twirl-track aria-labelledby="couple-title" className="gading-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <SectionHeading id="couple-title" label="Sang Penganten" title="Dua jiwa, satu laku" />

      <div className="relative mx-auto mt-20 grid max-w-5xl items-start gap-16 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <Portrait person={pair[0]} depth={46} label={labelOf(pair[0])} />

        <div className="pointer-events-none flex justify-center [perspective:900px] md:pt-56">
          <div data-depth="-30" className="preserve-3d">
            <div data-twirl="360" className="preserve-3d">
              <Gunungan size="4.5rem" />
            </div>
          </div>
        </div>

        <div className="md:pt-32">
          <Portrait person={pair[1]} depth={-46} label={labelOf(pair[1])} />
        </div>
      </div>
    </section>
  );
}
