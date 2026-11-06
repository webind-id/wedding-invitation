"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Kurva lambat-masuk-lambat-keluar: semua gerak di template ini terasa tenang. */
export const EASE_SLOW = [0.45, 0, 0.15, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "fade" muncul dari gelap; "blur" fokus perlahan seperti lensa; "rise" naik sedikit. */
  effect?: "fade" | "blur" | "rise";
  as?: "div" | "li" | "p" | "article";
}

const VARIANTS = {
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(14px)", scale: 1.02 }, shown: { opacity: 1, filter: "blur(0px)", scale: 1 } },
  rise: { hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } },
};

/** Muncul saat masuk viewport — sekali, perlahan (1,8 dtk). */
export function Reveal({ children, className, delay = 0, effect = "blur", as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const v = reduce ? VARIANTS.fade : VARIANTS[effect];
  return (
    <Tag
      className={className}
      initial={v.hidden}
      whileInView={v.shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.8, ease: EASE_SLOW, delay }}
    >
      {children}
    </Tag>
  );
}
