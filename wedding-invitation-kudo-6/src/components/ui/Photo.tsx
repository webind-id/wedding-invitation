"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";

interface PhotoProps {
  src: string;
  alt: string;
  /** Ukuran & bentuk bingkai (mis. "arch aspect-[3/4]"). */
  className?: string;
  eager?: boolean;
  /** Foto bergeser ±n% di dalam bingkainya mengikuti scroll (maks. 8). */
  parallax?: number;
}

const MAX_PARALLAX = 8;

/**
 * Foto yang tidak pernah merusak tata letak: bila kosong atau gagal dimuat, tampil
 * permukaan pearl bermonogram. Dengan `parallax`, foto berada di lapisan 20% lebih tinggi
 * dari bingkai sehingga bisa bergeser tanpa memperlihatkan tepinya.
 */
export function Photo({ src, alt, className, eager, parallax }: PhotoProps) {
  const { monogram } = useInvitation();
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);
  const amount = parallax ? Math.min(MAX_PARALLAX, Math.abs(parallax)) : 0;

  // Gambar hasil SSR bisa gagal sebelum React hydrate — onError tak terpanggil.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-pearl", className)} data-parallax={amount || undefined}>
      {failed ? (
        <div role="img" aria-label={alt || undefined} className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_30%_20%,#FBF1F0_0%,#E9E3DA_70%)]">
          <span className="font-script text-5xl text-rose/60">{monogram}</span>
        </div>
      ) : (
        <div data-parallax-layer className={amount ? "absolute inset-x-0 -top-[10%] h-[120%]" : "absolute inset-0"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover text-transparent"
          />
        </div>
      )}
    </div>
  );
}
