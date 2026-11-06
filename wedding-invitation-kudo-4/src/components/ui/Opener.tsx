import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { folio, rubric, type RubricId } from "@/lib/issue";
import { Reveal } from "./Reveal";

interface OpenerProps {
  id: RubricId;
  children: ReactNode;
  /** Deck: kalimat pengantar di bawah judul, gaya majalah. */
  deck?: ReactNode;
  titleId?: string;
  className?: string;
}

/** Pembuka rubrik: label + nomor halaman di garis rambut, judul serif besar, dan deck. */
export function Opener({ id, children, deck, titleId, className }: OpenerProps) {
  const r = rubric(id);
  return (
    <Reveal as="header" className={cn("max-w-4xl", className)}>
      <div className="rule flex items-baseline justify-between pt-3">
        <p className="rubric">{r.label}</p>
        <p className="font-serif text-sm italic text-stone">hal. {folio(r.page)}</p>
      </div>
      <h2 id={titleId} className="mt-8 font-serif text-[clamp(2.8rem,7.5vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-balance">
        {children}
      </h2>
      {deck && <div className="mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-stone">{deck}</div>}
    </Reveal>
  );
}
