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
 * tampil bidang champagne dengan monogram serif.
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
    <div className={cn("relative overflow-hidden bg-champagne", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,#EFE7D8_0%,#E2D2B4_100%)]"
        >
          <span className="font-serif text-4xl font-light italic text-gold/60">{monogram}</span>
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
