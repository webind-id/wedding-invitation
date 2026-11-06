import type { ReactNode } from "react";
import { CHAPTERS, chapterIndex, toRoman, type ChapterId } from "@/lib/chapters";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface ChapterHeadingProps {
  chapter: ChapterId;
  children: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}

/** "Bab III — Acara" + judul serif besar. */
export function ChapterHeading({ chapter, children, id, align = "left", className }: ChapterHeadingProps) {
  const index = chapterIndex(chapter);
  const label = CHAPTERS[index]?.label ?? "";
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      <p className="kicker">
        Bab {toRoman(index + 1)} <span className="mx-2 text-cream/30">—</span> {label}
      </p>
      <h2 id={id} className="subtitle mt-4 font-serif text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.95] text-cream text-balance">
        {children}
      </h2>
    </Reveal>
  );
}
