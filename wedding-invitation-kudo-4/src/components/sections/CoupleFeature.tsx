"use client";

import { cn } from "@/lib/cn";
import { photoAt } from "@/lib/photos";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Figure } from "../ui/Figure";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";

interface ProfileProps {
  person: Person;
  role: string;
  figure: number;
  /** Komposisi asimetris: foto di kiri (lebar) atau kanan (lebih sempit & turun). */
  layout: "photo-left" | "photo-right";
}

function Profile({ person, role, figure, layout }: ProfileProps) {
  const left = layout === "photo-left";
  return (
    <article className="grid items-end gap-10 lg:grid-cols-12 lg:gap-10">
      <Figure
        src={person.photo}
        alt={person.fullName}
        number={figure}
        caption={`${person.fullName}, ${role.toLowerCase()}.`}
        frameClassName="aspect-[4/5]"
        captionAlign={left ? "left" : "right"}
        className={cn(left ? "lg:col-span-7" : "lg:order-2 lg:col-span-5 lg:col-start-8 lg:mt-32")}
      />
      <Reveal className={cn("lg:pb-14", left ? "lg:col-span-4 lg:col-start-9" : "lg:order-1 lg:col-span-6 lg:col-start-1")}>
        <p className="rubric">{role}</p>
        <h3 className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.8rem)] font-light leading-[0.95] tracking-[-0.03em]">
          {person.fullName}
        </h3>
        {person.title && <p className="mt-2 font-serif text-lg italic text-gold">{person.title}</p>}
        <div className="rule mt-8 pt-5">
          <p className="font-serif text-lg leading-relaxed text-ink/80">
            {person.childOrder} <span className="text-ink">{person.father}</span> &amp; <span className="text-ink">{person.mother}</span>.
          </p>
          {person.instagram && (
            <a
              href={`https://instagram.com/${person.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rubric link-underline mt-5 inline-block text-ink"
            >
              Instagram — @{person.instagram}
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}

/** Profil mempelai: dua komposisi asimetris yang saling berlawanan. */
export function CoupleFeature() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const roleOf = (p: Person) => (p === content.bride ? "Mempelai wanita" : "Mempelai pria");
  const withPhoto = (p: Person, i: number): Person => ({ ...p, photo: p.photo || photoAt(photos, i) });

  return (
    <section id="mempelai" data-rubric="mempelai" aria-labelledby="mempelai-title" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <Opener id="mempelai" titleId="mempelai-title" deck="Dua pribadi, dua keluarga, satu kisah yang kini berlanjut bersama.">
          Profil <em>mempelai</em>
        </Opener>
        <div className="mt-16 space-y-24 sm:mt-24 sm:space-y-32">
          <Profile person={withPhoto(first, 2)} role={roleOf(first)} figure={2} layout="photo-left" />
          <Profile person={withPhoto(second, 3)} role={roleOf(second)} figure={3} layout="photo-right" />
        </div>
      </div>
    </section>
  );
}
