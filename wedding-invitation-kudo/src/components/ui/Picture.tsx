"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}


/**
 * <img> yang tidak pernah merusak layout: bila file belum ada, tampil
 * placeholder kertas bergaris dengan monogram pasangan.
 */
export function Picture({ src, alt, className, imgClassName, eager }: PictureProps) {
  const { monogram } = useInvitation();
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Gambar hasil SSR bisa gagal sebelum React hydrate, sehingga onError tidak
  // pernah terpanggil — cek ulang statusnya sekali saat mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-parchment", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#EADFCC_0_10px,#E3D5BE_10px_11px)]"
        >
          <span className="font-display text-4xl italic text-moss/50">{monogram}</span>
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
