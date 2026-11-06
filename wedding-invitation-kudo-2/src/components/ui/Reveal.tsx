"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_CINEMA = [0.65, 0, 0.35, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "rise" naik pelan; "iris" membuka dari tengah seperti iris kamera. */
  effect?: "rise" | "iris" | "fade";
  as?: "div" | "li" | "article" | "figure" | "section";
}

const VARIANTS = {
  rise: { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  iris: {
    hidden: { opacity: 0, clipPath: "inset(18% 18% 18% 18%)" },
    shown: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  },
};

/** Muncul saat masuk viewport — sekali saja. */
export function Reveal({ children, className, delay = 0, effect = "rise", as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const v = reduce ? VARIANTS.fade : VARIANTS[effect];
  return (
    <Tag
      className={className}
      initial={v.hidden}
      whileInView={v.shown}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: effect === "iris" ? 1.4 : 1, ease: effect === "iris" ? EASE_CINEMA : EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}
