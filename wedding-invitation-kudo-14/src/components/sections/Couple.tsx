"use client";

import { AtSign, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { type Person, withHonorific } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";
import { LeafHem } from "../taman/Foliage";
import { Photo } from "../ui/Photo";

const IMG = "/images/taman";

interface PersonRowProps {
  person: Person;
  /** Sisi foto. Baris kedua dibalik → susunan zig-zag. */
  photoSide: "left" | "right";
  /** Tokoh wayang samar di belakang biodata: Shinta untuk mempelai wanita, Rama untuk pria. */
  figure: "shinta" | "rama";
}

function PersonRow({ person, photoSide, figure }: PersonRowProps) {
  const handle = person.instagram.replace(/^@/, "");
  const isRight = photoSide === "right";
  return (
    <article className={cn("relative grid items-end gap-4", isRight ? "grid-cols-[1fr_54%]" : "grid-cols-[54%_1fr]")}>
      <div data-reveal="zoom" className={cn("relative", isRight && "order-2")}>
        <div className="gerbang h-[290px] max-[360px]:h-[250px]">
          <Photo src={person.photo} alt={person.fullName} parallax={4} className="h-full w-full" />
        </div>
        {/* Kupu-kupu hinggap di puncak gerbang; bunga di kaki luar gerbang */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/kupukupu.webp`} alt="" aria-hidden width={240} height={134} loading="lazy" className={cn("pointer-events-none absolute -top-3 z-[3] w-[46px]", isRight ? "left-[30%] rotate-[18deg]" : "right-[30%] -rotate-[18deg]")} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/bunga-1.webp`} alt="" aria-hidden width={414} height={760} loading="lazy" decoding="async" className={cn("pointer-events-none absolute -bottom-6 z-[3] w-[78px]", isRight ? "-right-7 -scale-x-100" : "-left-7")} />
      </div>

      <div data-reveal="up" className={cn("relative pb-1", isRight ? "order-1 text-right" : "text-left")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/${figure === "shinta" ? "shinta1" : "rama1"}.webp`}
          alt=""
          aria-hidden
          width={636}
          height={900}
          loading="lazy"
          decoding="async"
          className={cn("pointer-events-none absolute -bottom-4 -z-0 h-[250px] w-auto max-w-none opacity-[0.1]", isRight ? "-left-6" : "-right-6")}
        />
        <div className="relative">
          <h3 className="font-script text-[46px] font-normal leading-none text-marun-800 [text-wrap:balance]">{person.nickname}</h3>
          <p className="mt-2 font-display text-[13px] font-semibold uppercase leading-snug tracking-[1.5px] text-marun-800">
            {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
          </p>
          {(person.childOrder || person.father || person.mother) && (
            <p className="small-ui mt-2 leading-[1.6]">
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
            <p className={cn("small-ui mt-1.5 flex items-start gap-1", isRight && "justify-end")}>
              <MapPin className="mt-[3px] h-3 w-3 shrink-0 text-gold-600" aria-hidden />
              <span>{person.address}</span>
            </p>
          )}
          {handle && (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 border-b border-gold-500/70 pb-0.5 font-sans text-xs font-medium text-marun-700 transition-colors hover:border-marun-700 hover:text-marun-900"
            >
              <AtSign className="h-3.5 w-3.5" aria-hidden />
              {handle}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Babak "Jejer" — dalam pedalangan, adegan pertama yang memperkenalkan para tokoh.
 * Mempelai tampil zig-zag: foto dalam gerbang bergantian kiri/kanan, biodata di sisi lain
 * dengan Shinta/Rama samar di belakangnya.
 */
export function Couple() {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const figureOf = (p: Person) => (p === content.bride ? "shinta" : "rama");

  return (
    <section ref={ref} id="mempelai" aria-labelledby="mempelai-title" className="sec bg-cream-100">
      <LeafHem />
      <Babak id="mempelai-title" name="Jejer" title="Sang Mempelai" />

      <div className="mt-12">
        <PersonRow person={pair[0]} photoSide="left" figure={figureOf(pair[0])} />
        <div data-reveal="up" aria-hidden className="my-10 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/70" />
          <span className="font-serif text-[64px] italic leading-none text-blush-deep">&amp;</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/70" />
        </div>
        <PersonRow person={pair[1]} photoSide="right" figure={figureOf(pair[1])} />
      </div>
    </section>
  );
}
