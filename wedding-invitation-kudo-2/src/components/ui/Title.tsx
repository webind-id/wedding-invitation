import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface TitleProps {
  /** Nomor babak, mis. "01". */
  reel: string;
  label: string;
  children: ReactNode;
  id?: string;
  align?: "center" | "left";
  className?: string;
}

/** Judul bagian bergaya kartu judul film: nomor babak + label kredit + judul Bodoni. */
export function Title({ reel, label, children, id, align = "center", className }: TitleProps) {
  const centered = align === "center";
  return (
    <Reveal className={cn(centered ? "text-center" : "text-left", className)}>
      <p className={cn("credit flex items-center gap-4", centered && "justify-center")}>
        <span className="font-display text-sm italic tracking-normal text-gold/70">{reel}</span>
        <span className="h-px w-8 bg-gold/50" aria-hidden />
        {label}
      </p>
      <h2 id={id} className="mt-5 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-ivory text-balance">
        {children}
      </h2>
    </Reveal>
  );
}
