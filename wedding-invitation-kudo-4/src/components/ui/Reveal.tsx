"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "article" | "header";
}

/** Naik halus 14px sambil muncul — tenang, sekali saja, tanpa kedip. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE_EDITORIAL, delay }}
    >
      {children}
    </Tag>
  );
}
