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
  /** Nuansa film lama: sepia lembut + butiran + vinyet. Default aktif. */
  film?: boolean;
}

/**
 * <img> yang tidak pernah merusak layout: bila kosong atau gagal dimuat,
 * tampil kertas sepia dengan monogram. Foto diberi nuansa film lama.
 */
export function Photo({ src, alt, className, imgClassName, eager, film = true }: PhotoProps) {
  const { monogram } = useInvitation();
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Gambar hasil SSR bisa gagal sebelum React hydrate — onError tak terpanggil.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-parchment", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#EFE3CC_0%,#D9C6A4_100%)]"
        >
          <span className="font-fell text-4xl italic text-burgundy/40">{monogram}</span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            onError={() => setFailed(true)}
            className={cn("absolute inset-0 h-full w-full object-cover text-transparent", film && "film", imgClassName)}
          />
          {film && (
            <div aria-hidden className="paper absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(74,48,32,0.45)_100%)]" />
          )}
        </>
      )}
    </div>
  );
}
