"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_GENTLE = [0.33, 1, 0.68, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "article" | "header" | "figure";
}

/** Muncul pelan seperti tinta yang meresap — sekali saja, tanpa kedip. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: EASE_GENTLE, delay }}
    >
      {children}
    </Tag>
  );
}
