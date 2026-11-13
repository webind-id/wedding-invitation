"use client";

import { AtSign } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/cn";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Potret bulat seperti bulan: cincin tipis melayang di depan foto (translateZ),
 * teratai mengapung di tepi bawah — terasa berlapis saat condong mengikuti kursor.
 */
function MoonPortrait({ person, flip }: { person: Person; flip: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  useTilt(frameRef, 6);

  return (
    <div className="[perspective:1000px]">
      <div ref={frameRef} className="preserve-3d relative mx-auto w-[min(72vw,19rem)]">
        <Photo src={person.photo} alt={person.fullName} parallax={7} className="aspect-square rounded-full shadow-[0_40px_70px_-40px_rgba(78,49,89,0.7)]" />
        <span aria-hidden className="absolute -inset-3 rounded-full border border-lavender/60" style={{ transform: "translateZ(30px)" }} />
        <span aria-hidden className="absolute -inset-6 rounded-full border border-dashed border-lavender/35" style={{ transform: "translateZ(55px)" }} />
        <div aria-hidden className={cn("preserve-3d absolute -bottom-6", flip ? "-left-4" : "-right-4")} style={{ transform: "translateZ(80px)" }}>
          <Flower kind="lotus" palette={flip ? "apricot" : "lilac"} size="clamp(5.5rem,16vw,7.5rem)" seed={flip ? 21 : 20} pad tilt={50} />
        </div>
      </div>
    </div>
  );
}

function PersonRow({ person, depth, flip }: { person: Person; depth: number; flip: boolean }) {
  return (
    <article className={cn("grid items-center gap-10 md:grid-cols-2 md:gap-14", flip && "md:[direction:rtl]")}>
      <div data-depth={depth} className="[direction:ltr]">
        <div data-reveal="zoom">
          <MoonPortrait person={person} flip={flip} />
        </div>
      </div>
      <div data-depth={-depth / 2} className={cn("text-center [direction:ltr]", flip ? "md:text-right" : "md:text-left")}>
        <div data-reveal-group>
          <p data-reveal-item className="font-script text-[clamp(3.6rem,11vw,5.2rem)] leading-none text-ink">
            {person.nickname}
          </p>
          <h3 data-reveal-item className="mt-3 font-display text-xl leading-snug sm:text-2xl">
            {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
          </h3>
          {/* Data admin sudah berisi "Putri pertama dari", "Bapak …", "Ibu …" — tampilkan apa adanya. */}
          <p data-reveal-item className="mt-4 text-sm leading-relaxed text-ink/70">
            {person.childOrder}
            <br />
            {person.father} &amp; {person.mother}
          </p>
          {person.instagram && (
            <p data-reveal-item className="mt-5">
              <a
                href={`https://instagram.com/${person.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-plum/20 px-4 py-2 text-xs font-medium tracking-wide text-plum-deep transition hover:border-plum hover:bg-lilac/30"
              >
                <AtSign className="h-3.5 w-3.5" aria-hidden />
                {person.instagram}
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Kedua mempelai bersilang: foto–nama lalu nama–foto, di lapisan kedalaman yang berlawanan. */
export function Couple() {
  const { pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} aria-labelledby="couple-title" className="mist-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <SectionHeading id="couple-title" label="Mempelai" title="Dua hati, satu perjalanan" />

      <div className="relative mx-auto mt-20 max-w-5xl">
        <PersonRow person={pair[0]} depth={40} flip={false} />

        <div aria-hidden className="pointer-events-none relative my-16 flex items-center justify-center gap-6 md:my-10 [perspective:900px]">
          <span className="h-px w-16 bg-lavender/60 sm:w-28" />
          <div data-depth="-30" className="preserve-3d">
            <div data-spin="120" className="preserve-3d">
              <Flower kind="dahlia" palette="plum" size="5.5rem" seed={8} tilt={18} />
            </div>
          </div>
          <span className="h-px w-16 bg-lavender/60 sm:w-28" />
        </div>

        <PersonRow person={pair[1]} depth={-40} flip />
      </div>
    </section>
  );
}
