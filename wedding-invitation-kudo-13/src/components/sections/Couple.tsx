"use client";

import { AtSign, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { type Person, withHonorific } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { FretEdges, Glyph } from "../klenteng/Ornaments";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function PersonCard({ person }: { person: Person }) {
  const handle = person.instagram.replace(/^@/, "");
  return (
    <article data-reveal="zoom">
      {/* Bingkai rembulan bertepi emas, diapit ranting mei */}
      <div className="moon h-[220px] w-[220px]">
        <div className="moon-in">
          <Photo src={person.photo} alt={person.fullName} parallax={4} className="h-full w-full" />
        </div>
        <Glyph id="branch" className="pointer-events-none absolute -bottom-1.5 -left-[46px] z-[2] h-[90px] w-[120px]" />
        <Glyph id="branch" className="pointer-events-none absolute -right-[46px] -top-1 z-[2] h-[90px] w-[120px] rotate-180" />
      </div>

      <h3 className="mt-5 font-script text-[52px] font-normal leading-none text-red-700">{person.nickname}</h3>
      <p className="mt-2 font-display text-base font-medium tracking-[1.5px] text-red-900">
        {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
      </p>
      {(person.childOrder || person.father || person.mother) && (
        <p className="small-ui mb-3.5 mt-1.5">
          {person.childOrder && (
            <>
              {person.childOrder}
              <br />
            </>
          )}
          {withHonorific(person.father, "Bapak")} &amp; {withHonorific(person.mother, "Ibu")}
        </p>
      )}
      {person.address && (
        <p className="small-ui -mt-1.5 mb-3.5 inline-flex items-start gap-1.5">
          <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-red-700" aria-hidden />
          <span>{person.address}</span>
        </p>
      )}
      {handle && (
        <div>
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" className="btn-red normal-case tracking-normal">
            <AtSign className="h-[15px] w-[15px]" aria-hidden />
            {handle}
          </a>
        </div>
      )}
    </article>
  );
}

export function Couple() {
  const { pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="mempelai" aria-labelledby="mempelai-title" className="sec coin-bg bg-cream-100">
      <FretEdges />
      <SectionHeading id="mempelai-title" title="Kedua Mempelai" variant="display" />
      <PersonCard person={pair[0]} />
      <p data-reveal="up" aria-hidden lang="zh" className="mb-5 mt-[34px] font-han text-[64px] leading-none text-gold-500">
        囍
      </p>
      <PersonCard person={pair[1]} />
    </section>
  );
}
