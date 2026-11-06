"use client";

import { useEffect, useState } from "react";

/** Scene harus bertahan di tengah layar selama ini sebelum panggung berganti. */
const SETTLE_MS = 450;

export interface ActiveScene {
  /** URL foto panggung untuk scene aktif; "" = panggung digelapkan. */
  stage: string;
  chapter: string | null;
}

/**
 * Lacak scene yang melintasi garis tengah layar. Setiap <Scene> membawa
 * data-stage (foto latar) dan data-chapter; panggung & indikator bab
 * mengikuti scene ini.
 */
export function useSceneTracker(isActive: boolean, initialStage: string): ActiveScene {
  const [active, setActive] = useState<ActiveScene>({ stage: initialStage, chapter: null });

  useEffect(() => {
    if (!isActive) return;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        const el = hit.target as HTMLElement;
        clearTimeout(timer);
        timer = setTimeout(() => {
          setActive((prev) => {
            const next = { stage: el.dataset.stage ?? "", chapter: el.dataset.chapter ?? null };
            return prev.stage === next.stage && prev.chapter === next.chapter ? prev : next;
          });
        }, SETTLE_MS);
      },
      // Pita tipis di tengah layar: hanya satu scene yang melintasinya pada satu waktu.
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );
    scenes.forEach((s) => observer.observe(s));
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isActive]);

  return active;
}
