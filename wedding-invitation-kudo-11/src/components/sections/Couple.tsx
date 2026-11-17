"use client";

import { AtSign, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import type { LanternVariant } from "@/lib/lanterns";
import { type Person, withHonorific } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Lantern3D } from "../lantern/Lantern3D";
import { LanternSky } from "../lantern/LanternSky";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function PortraitCard({ person, role, variant }: { person: Person; role: string; variant: LanternVariant }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 5);

  return (
    <div data-reveal="zoom" className="[perspective:1200px]">
      <article ref={cardRef} className="preserve-3d glass-night flex flex-col items-center px-6 pb-8 pt-16 text-center">
        {/* Lampion tergantung di atas kartu */}
        <div aria-hidden className="absolute -top-10 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <Lantern3D size={44} variant={variant} spin={16} />
        </div>

        <span className="badge-gold mb-5">{role}</span>

        <div className="lantern-frame mb-6 w-44 sm:w-52">
          <div className="lantern-frame-inner aspect-[4/5] w-full">
            <Photo src={person.photo} alt={person.fullName} parallax={4} className="h-full w-full" />
          </div>
        </div>

        <p className="text-glow font-script text-5xl leading-tight text-ember-300">{person.nickname}</p>

        <h3 className="mt-1 font-serif text-xl font-semibold tracking-tight text-moon sm:text-2xl">
          {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
        </h3>

        {(person.childOrder || person.father || person.mother) && (
          <div className="mt-4 max-w-xs border-t border-gold/20 pt-3 text-sm leading-relaxed text-moon-muted">
            {person.childOrder && <p className="font-medium text-moon">{person.childOrder}</p>}
            {(person.father || person.mother) && (
              <p className="mt-1">
                {withHonorific(person.father, "Bapak")} &amp; {withHonorific(person.mother, "Ibu")}
              </p>
            )}
          </div>
        )}

        {person.address && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-moon-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ember-300" aria-hidden />
            <span>{person.address}</span>
          </p>
        )}

        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-night mt-5 px-4 py-2 text-xs normal-case tracking-wide sm:text-xs"
          >
            <AtSign className="h-3.5 w-3.5 text-ember-300" aria-hidden />
            <span>{person.instagram.startsWith("@") ? person.instagram : `@${person.instagram}`}</span>
          </a>
        )}
      </article>
    </div>
  );
}

export function Couple() {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const isBrideFirst = content.headlineOrder === "bride-first";

  return (
    <section ref={ref} id="couple" aria-labelledby="couple-title" className="night-sky relative overflow-hidden px-4 py-20 sm:py-28">
      <LanternSky count={8} seed={42} options={{ maxSize: 34 }} />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          id="couple-title"
          badge="The Happy Couple"
          scriptTitle="Mempelai"
          title="Dua Cahaya, Satu Langit"
          subtitle="Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon ridho-Nya, kami bermaksud melangsungkan pernikahan kami."
        />

        <div className="mt-16 grid grid-cols-1 items-stretch gap-16 md:grid-cols-2 md:gap-10">
          <PortraitCard person={pair[0]} role={isBrideFirst ? "The Bride" : "The Groom"} variant="amber" />
          <PortraitCard person={pair[1]} role={isBrideFirst ? "The Groom" : "The Bride"} variant="rose" />
        </div>
      </div>
    </section>
  );
}
