"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Jarak geser awal dalam px (positif = naik dari bawah). */
  rise?: number;
  as?: "div" | "li" | "article" | "figure";
}

/** Muncul perlahan saat masuk viewport — sekali saja. */
export function FadeIn({ children, className, delay = 0, rise = 22, as = "div" }: FadeInProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE_SOFT, delay }}
    >
      {children}
    </Tag>
  );
}
