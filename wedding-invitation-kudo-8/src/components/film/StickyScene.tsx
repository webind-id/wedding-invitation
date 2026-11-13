import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { SceneId } from "@/lib/scenes";
import { SceneBackdrop } from "./SceneBackdrop";

interface StickySceneProps {
  scene: SceneId;
  children: ReactNode;
  dim?: number;
  zoom?: number;
  eager?: boolean;
  /** Lapisan tambahan di atas foto (mis. HUD) yang ikut menempel. */
  overlay?: ReactNode;
  className?: string;
}

/**
 * Foto adegan menempel selayar penuh (sticky) sementara isi bab menggulir di atasnya —
 * seperti kamera yang diam dan teks yang lewat. Ken Burns mengikuti seluruh adegan.
 */
export function StickyScene({ scene, children, dim, zoom, eager, overlay, className }: StickySceneProps) {
  return (
    <div data-zoom-track className={cn("relative", className)}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <SceneBackdrop scene={scene} dim={dim} zoom={zoom} eager={eager} />
        {overlay}
      </div>
      <div className="on-photo relative -mt-[100svh]">{children}</div>
    </div>
  );
}
