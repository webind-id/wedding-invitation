"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/**
 * <img> yang tidak pernah merusak layout: bila kosong atau gagal dimuat,
 * tampil panel gelap bergradasi dengan monogram emas.
 */
export function Photo({ src, alt, className, imgClassName, eager }: PhotoProps) {
  const { monogram } = useInvitation();
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Gambar hasil SSR bisa gagal sebelum React hydrate — onError tak terpanggil.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-graphite", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,#2a2a30_0%,#121215_60%,#08080a_100%)]"
        >
          <span className="font-display text-3xl italic tracking-wide text-gold/50">{monogram}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover text-transparent", imgClassName)}
        />
      )}
    </div>
  );
}
