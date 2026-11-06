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
 * tampil cahaya cokelat redup dengan monogram krem.
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
    <div className={cn("relative overflow-hidden bg-charcoal", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_35%_30%,#5a3f2c_0%,#2a1d15_45%,#0a0908_100%)]"
        >
          <span className="font-serif text-4xl italic text-cream/25">{monogram}</span>
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
