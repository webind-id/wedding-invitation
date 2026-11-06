"use client";

import { cn } from "@/lib/cn";
import { useInvitation } from "./InvitationContext";
import { Photo } from "./ui/Photo";

/**
 * Panggung: lapisan foto tetap di belakang seluruh undangan. Foto aktif
 * muncul perlahan (crossfade 2,4 dtk) dengan Ken Burns; lapisan gelap,
 * vinyet, rona cokelat, dan bocoran cahaya hangat membuat suasana moody.
 */
export function Stage({ src }: { src: string }) {
  const { photos } = useInvitation();
  // Foto aktif mungkin tidak ada di pool (mis. URL kosong) — panggung jadi gelap.
  const layers = src && !photos.includes(src) ? [...photos, src] : photos;

  return (
    <div aria-hidden className="grain fixed inset-0 -z-10 overflow-hidden bg-ink">
      {layers.map((p) => {
        const isOn = p === src;
        return (
          <div key={p} className={cn("absolute inset-0 transition-opacity duration-slower ease-in-out", isOn ? "opacity-100" : "opacity-0")}>
            <Photo src={p} alt="" className="h-full w-full" imgClassName="animate-ken-burns" eager={isOn} />
          </div>
        );
      })}

      {/* Lapisan suasana */}
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-0 bg-umber/25 mix-blend-multiply" />
      <div className="absolute -inset-1/4 animate-light-leak bg-[radial-gradient(circle_at_30%_30%,rgba(214,150,90,0.22),transparent_42%)] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,9,8,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
    </div>
  );
}
