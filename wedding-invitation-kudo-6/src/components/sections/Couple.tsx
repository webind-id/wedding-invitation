"use client";

import { AtSign } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function Portrait({ person, depth, align }: { person: Person; depth: number; align: "left" | "right" }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 5);

  return (
    <article data-depth={depth} className="relative">
      <div data-reveal="up" className="[perspective:1000px]">
        <div ref={cardRef} className="preserve-3d">
          <Photo src={person.photo} alt={person.fullName} parallax={7} className="arch mx-auto aspect-[3/4] w-[min(78vw,20rem)] shadow-[0_40px_70px_-40px_rgba(57,49,47,0.6)] ring-1 ring-white/70" />
          {/* Kartu nama melayang sedikit di depan foto (translateZ) — terasa saat dimiringkan. */}
          <div
            className={`pearl-card relative mx-auto -mt-14 w-[min(70vw,17rem)] rounded-[1.5rem] px-6 pb-6 pt-5 text-center ${align === "left" ? "sm:-left-6" : "sm:left-6"}`}
            style={{ transform: "translateZ(40px)" }}
          >
            <p className="font-script text-5xl leading-tight text-ink">{person.nickname}</p>
            <p className="mt-1 font-display text-lg leading-snug">
              {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
            </p>
            {/* Data admin sudah berisi "Putri pertama dari", "Bapak …", "Ibu …" — tampilkan apa adanya. */}
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {person.childOrder}
              <br />
              {person.father} &amp; {person.mother}
            </p>
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-mauve transition hover:text-ink"
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

/** Kedua mempelai di lapisan kedalaman yang berlawanan — satu naik, satu turun saat di-scroll. */
export function Couple() {
  const { pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} aria-labelledby="couple-title" className="pearl-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <SectionHeading id="couple-title" label="Mempelai" title="Dua hati, satu perjalanan" />

      <div className="relative mx-auto mt-20 grid max-w-5xl items-start gap-20 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <Portrait person={pair[0]} depth={50} align="left" />

        <div className="pointer-events-none flex justify-center [perspective:900px] md:pt-56">
          <div data-depth="-30" className="preserve-3d">
            <div data-spin="90" className="preserve-3d">
              <Bloom palette="blush" size="6.5rem" seed={8} tilt={20} />
            </div>
          </div>
        </div>

        <div className="md:pt-32">
          <Portrait person={pair[1]} depth={-50} align="right" />
        </div>
      </div>
    </section>
  );
}
