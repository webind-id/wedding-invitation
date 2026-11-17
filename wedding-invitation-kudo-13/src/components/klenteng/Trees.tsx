import { memo } from "react";
import { bamboo, bush, BUSH_VIEWBOX, plumTree, TREE_VIEWBOX, type Blossom, type BushTone } from "@/lib/scenery";
import { swayStyle, swayTiming } from "@/lib/sway";

/**
 * Pohon mei, rumpun bambu, dan semak bunga untuk adegan klenteng. Bergoyang pelan (kelas
 * `.sway-*`, aktif hanya saat bagiannya terlihat — lihat useSwayZone). memo: ratusan elemen.
 *
 * overflow="visible": cabang pohon mei menjulur jauh melewati viewBox (x ≈ −60…460 dari 0…300),
 * jadi SVG tidak boleh memotongnya di mana pun pohon diletakkan.
 */

const TREE_BASE = { x: TREE_VIEWBOX.width / 2, y: TREE_VIEWBOX.height };

function Flowers({ items }: { items: Blossom[] }) {
  return (
    <>
      {items.map((f, i) => (
        <use key={i} href={f.isRed ? "#kl-mei-red" : "#kl-mei"} x={f.x} y={f.y} width={f.size} height={f.size} />
      ))}
    </>
  );
}

export const PlumTree = memo(function PlumTree({ seed, lean, mirror }: { seed: number; lean: number; mirror?: boolean }) {
  const tree = plumTree(seed, lean);
  return (
    <svg
      viewBox={`0 0 ${TREE_VIEWBOX.width} ${TREE_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      overflow="visible"
      className={mirror ? "-scale-x-100" : undefined}
      aria-hidden
      focusable="false"
    >
      <g className="sway-tree" style={swayStyle(TREE_BASE, swayTiming(seed, 0, 8, 1.5))}>
        <g fill="none" stroke="#2E0B08" strokeLinecap="round">
          {tree.branches.map((b, i) => (
            <path key={i} d={b.d} strokeWidth={b.width} />
          ))}
        </g>
        <Flowers items={tree.blossoms.map((b) => ({ ...b, x: b.x - b.size / 2, y: b.y - b.size / 2 }))} />
      </g>
    </svg>
  );
});

export const BambooGrove = memo(function BambooGrove({ seed, mirror }: { seed: number; mirror?: boolean }) {
  const grove = bamboo(seed);
  return (
    <svg
      viewBox={`0 0 ${TREE_VIEWBOX.width} ${TREE_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      overflow="visible"
      className={mirror ? "-scale-x-100" : undefined}
      aria-hidden
      focusable="false"
    >
      {grove.stalks.map((s, i) => (
        <g key={i} className="sway-tree" style={swayStyle({ x: s.base, y: TREE_VIEWBOX.height }, swayTiming(seed, i + 1, 6, 1))}>
          <path d={s.d} fill="none" stroke={s.color} strokeWidth={s.width} />
          <path d={s.nodes.join(" ")} stroke="#C9A24B" strokeOpacity=".35" strokeWidth="1.5" />
          {s.leaves.map((leaf, k) => (
            <path key={k} d={leaf} fill="#3E3A24" />
          ))}
        </g>
      ))}
    </svg>
  );
});

export const BlossomBush = memo(function BlossomBush({ seed, tone, mirror }: { seed: number; tone: BushTone; mirror?: boolean }) {
  const shape = bush(seed, tone);
  const timing = swayTiming(seed, 0, 7, 1);
  return (
    <svg viewBox={`0 0 ${BUSH_VIEWBOX} ${BUSH_VIEWBOX}`} overflow="visible" className={mirror ? "-scale-x-100" : undefined} aria-hidden focusable="false">
      <g className="sway-bush" style={{ ["--sway-delay" as string]: `${timing.delay}s`, ["--sway-dur" as string]: `${timing.duration}s` }}>
        {shape.branches.map((b, i) => (
          <path key={`b${i}`} d={b.d} fill="none" stroke={shape.dark} strokeWidth={b.width} strokeLinecap="round" />
        ))}
        {shape.masses.map((m, i) => (
          <circle key={`m${i}`} cx={m.cx} cy={m.cy} r={m.r} fill={shape.dark} opacity=".75" />
        ))}
        {shape.dots.map((d, i) => (
          <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} />
        ))}
        <Flowers items={shape.flowers} />
      </g>
    </svg>
  );
});
