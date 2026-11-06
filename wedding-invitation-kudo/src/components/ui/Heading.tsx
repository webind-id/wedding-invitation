import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FadeIn } from "./FadeIn";

interface HeadingProps {
  eyebrow: string;
  children: ReactNode;
  id?: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Eyebrow kecil + judul Fraunces italic. */
export function Heading({ eyebrow, children, id, tone = "dark", className }: HeadingProps) {
  return (
    <FadeIn className={cn("text-center", className)}>
      <p className={cn("eyebrow", tone === "light" && "text-blush")}>{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          "mt-3 font-display text-[2.4rem] font-light italic leading-[1.05] tracking-tight",
          tone === "dark" ? "text-forest" : "text-linen",
        )}
      >
        {children}
      </h2>
    </FadeIn>
  );
}
