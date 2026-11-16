"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  parallax?: number;
}

const MAX_PARALLAX = 8;

export function Photo({ src, alt, className, eager, parallax }: PhotoProps) {
  const { monogram } = useInvitation();
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);
  const amount = parallax ? Math.min(MAX_PARALLAX, Math.abs(parallax)) : 0;

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-night-800",
        className,
      )}
      data-parallax={amount || undefined}
    >
      {failed ? (
        <div
          role="img"
          aria-label={alt || undefined}
          className="absolute inset-0 grid place-items-center bg-gradient-to-b from-night-700 to-night-900"
        >
          <span className="font-serif text-3xl font-semibold tracking-widest text-gold/50">{monogram}</span>
        </div>
      ) : (
        <div
          data-parallax-layer
          className={amount ? "absolute inset-x-0 -top-[10%] h-[120%]" : "absolute inset-0"}
        >
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
