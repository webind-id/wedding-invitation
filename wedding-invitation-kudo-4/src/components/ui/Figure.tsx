"use client";

import { motion, useReducedMotion } from "framer-motion";
import { figureLabel } from "@/lib/issue";
import { cn } from "@/lib/cn";
import { Photo } from "./Photo";
import { EASE_EDITORIAL } from "./Reveal";

interface FigureProps {
  src: string;
  alt: string;
  /** Nomor gambar untuk keterangan "Gbr. 03"; tanpa nomor = tanpa keterangan. */
  number?: number;
  caption?: string;
  /** Kelas rasio/ukuran bingkai foto, mis. "aspect-[3/4]". */
  frameClassName?: string;
  className?: string;
  eager?: boolean;
  captionAlign?: "left" | "right";
}

/**
 * Foto editorial: terbuka dari bawah (clip-path) saat masuk layar, lalu
 * zoom halus ke ukuran asli; keterangan kecil bernomor di bawahnya.
 */
export function Figure({ src, alt, number, caption, frameClassName, className, eager, captionAlign = "left" }: FigureProps) {
  const reduce = useReducedMotion();
  return (
    <figure className={className}>
      <motion.div
        initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
        whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.4, ease: EASE_EDITORIAL }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{ scale: reduce ? 1 : 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE_EDITORIAL }}
        >
          <Photo src={src} alt={alt} eager={eager} className={cn("w-full", frameClassName)} />
        </motion.div>
      </motion.div>
      {(number !== undefined || caption) && (
        <figcaption className={cn("mt-3 flex gap-3 text-[0.72rem] leading-snug text-stone", captionAlign === "right" && "justify-end text-right")}>
          {number !== undefined && <span className="shrink-0 font-sans font-medium uppercase tracking-[0.18em] text-ink">{figureLabel(number)}</span>}
          {caption && <span className="font-serif italic">{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
