import { cn } from "@/lib/cn";
import { SCENES, type SceneId } from "@/lib/scenes";

interface SceneBackdropProps {
  scene: SceneId;
  /** Foto di layar pertama: dimuat segera dengan prioritas tinggi. */
  eager?: boolean;
  /** Besarnya Ken Burns mengikuti scroll (0 = diam). */
  zoom?: number;
  /** Kegelapan bagian atas (0–1); dasar adegan selalu pekat agar teks terbaca. */
  dim?: number;
  className?: string;
}

/**
 * Latar adegan: foto gunung selebar layar dengan color grade film (teal–amber),
 * gradasi gelap atas–bawah, dan vignette. Dekoratif — teks adegan ada di atasnya.
 */
export function SceneBackdrop({ scene, eager, zoom = 0.12, dim = 0.55, className }: SceneBackdropProps) {
  const s = SCENES[scene];
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-film", className)}>
      <div data-zoom={zoom || undefined} className="absolute inset-0">
        <picture>
          {/* Foto potret diganti versi lanskap di layar lebar agar tidak buram saat direntangkan. */}
          {s.wide && <source media="(min-width: 768px)" srcSet={s.wide.src} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt=""
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            className="h-full w-full object-cover [filter:saturate(0.82)_contrast(1.08)_brightness(0.92)] [object-position:var(--focus)] md:[object-position:var(--focus-wide,var(--focus))]"
            style={{ ["--focus" as string]: s.focus, ...(s.wide ? { ["--focus-wide" as string]: s.wide.focus } : {}) }}
          />
        </picture>
      </div>
      <div className="grade-tint absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(7,9,11,${dim}) 0%, rgba(7,9,11,${dim * 0.25}) 34%, rgba(7,9,11,${dim * 0.35}) 58%, rgba(7,9,11,0.94) 100%)`,
        }}
      />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
