import type { ReactNode } from "react";
import type { ChapterId } from "@/lib/chapters";
import { cn } from "@/lib/cn";

interface SceneProps {
  chapter: ChapterId;
  /** Foto panggung selama scene ini aktif; null = panggung digelapkan. */
  photo: string | null;
  /** Pasang id bab sebagai anchor (hanya pada scene pertama tiap bab). */
  anchor?: boolean;
  /** Setinggi layar penuh. */
  fullscreen?: boolean;
  className?: string;
  label?: string;
  children: ReactNode;
}

/** Satu "adegan" dalam gulir: membawa foto panggung & bab untuk pelacak scene. */
export function Scene({ chapter, photo, anchor, fullscreen = true, className, label, children }: SceneProps) {
  return (
    <section
      id={anchor ? chapter : undefined}
      data-stage={photo ?? ""}
      data-chapter={chapter}
      aria-label={label}
      className={cn("relative", fullscreen && "min-h-[100svh]", className)}
    >
      {children}
    </section>
  );
}
