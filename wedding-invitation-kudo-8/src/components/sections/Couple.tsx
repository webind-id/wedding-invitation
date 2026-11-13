"use client";

import { AtSign } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { formatElevation, MOUNTAINS, type Mountain } from "@/lib/mountains";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { StickyScene } from "../film/StickyScene";
import { Photo } from "../ui/Photo";

interface CastCreditProps {
  person: Person;
  role: string;
  mountain: Mountain;
  depth: number;
  isReversed?: boolean;
}

/** Kredit pemeran: potret ber-grade film, nama besar, "sebagai …", orang tua, dan gunungnya. */
function CastCredit({ person, role, mountain, depth, isReversed }: CastCreditProps) {
  return (
    <article className={cn("grid items-end gap-7 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10", isReversed && "md:[&>*:first-child]:order-2")}>
      <div data-depth={depth}>
        <div data-reveal="zoom" className="relative mx-auto w-[min(78vw,22rem)]">
          <Photo src={person.photo} alt={person.fullName} parallax={7} className="aspect-[4/5] w-full [filter:saturate(0.85)_contrast(1.05)]" />
          <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.55)]" />
          <p className="absolute left-3 top-3 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-seluloid/80">
            {mountain.name} · {formatElevation(mountain.elevation)}
          </p>
        </div>
      </div>

      <div className={cn("text-center md:text-left", isReversed && "md:text-right")}>
        <p data-reveal="fade" className="label">
          Starring
        </p>
        <h3 data-reveal="up" className="credit mt-4 text-[clamp(2.2rem,7vw,3.6rem)] leading-[1.02]">
          {person.nickname}
        </h3>
        <p data-reveal="up" className="mt-3 font-display text-xl text-seluloid/90">
          {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
        </p>
        <p data-reveal="up" className="mt-1 font-display text-lg italic text-amber">
          sebagai {role}
        </p>
        {/* Data admin sudah berisi "Putri pertama dari", "Bapak …", "Ibu …" — tampilkan apa adanya. */}
        <p data-reveal="up" className="mt-5 text-[1.05rem] leading-relaxed text-seluloid/65">
          {person.childOrder}
          <br />
          {person.father} &amp; {person.mother}
        </p>
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-seluloid/70 transition hover:text-amber"
          >
            <AtSign className="h-3.5 w-3.5" aria-hidden />
            {person.instagram}
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * Starring — dua pemeran utama. Mempelai wanita = Sindoro, mempelai pria = Sumbing:
 * gunung kembar yang selalu berdampingan. Latar Sumbing menempel selama adegan.
 */
export function Couple() {
  const { pair, content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const isBride = (p: Person) => p === content.bride;
  const roleOf = (p: Person) => (isBride(p) ? "Mempelai Wanita" : "Mempelai Pria");
  const mountainOf = (p: Person) => (isBride(p) ? MOUNTAINS.sindoro : MOUNTAINS.sumbing);

  return (
    <section ref={ref} aria-labelledby="couple-title">
      <StickyScene scene="sumbing" dim={0.75}>
        <div className="px-6 pb-32 pt-28 sm:px-10 sm:pb-44 sm:pt-36">
          <div data-reveal="fade" className="flex justify-center">
            <Slate scene={4} mountain="sumbing" />
          </div>
          <TitleCard id="couple-title" kicker="The Cast" title="Dua Pendaki" subtitle="satu tujuan" intro="Seperti Sindoro dan Sumbing yang berdiri berdampingan, kami memilih menempuh jalur yang sama." className="mt-6" />

          <div className="mx-auto mt-24 max-w-5xl space-y-28 sm:space-y-36">
            <CastCredit person={pair[0]} role={roleOf(pair[0])} mountain={mountainOf(pair[0])} depth={30} />
            <CastCredit person={pair[1]} role={roleOf(pair[1])} mountain={mountainOf(pair[1])} depth={-30} isReversed />
          </div>
        </div>
      </StickyScene>
    </section>
  );
}
