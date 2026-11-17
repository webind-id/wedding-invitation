import { memo } from "react";
import { bush, BUSH_VIEWBOX, palm, PALM_VIEWBOX, type BushTone, type PalmTone } from "@/lib/scenery";
import { swayStyle, swayTiming } from "@/lib/sway";

/**
 * Pohon kelapa & semak bunga untuk adegan pembuka. Bergoyang pelan seperti di desain asal:
 * batang dari pangkalnya, tiap pelepah dari mahkota dengan irama sendiri, semak dari bawah
 * (kelas `.sway-*`, aktif hanya saat bagiannya terlihat — lihat useSwayZone). memo: ratusan elemen.
 * overflow="visible": pelepah menjulur melewati viewBox, jangan dipotong.
 */
export const Palm = memo(function Palm({ seed, tone, lean, mirror }: { seed: number; tone: PalmTone; lean: number; mirror?: boolean }) {
  const tree = palm(seed, tone, lean);
  return (
    <svg
      viewBox={`0 0 ${PALM_VIEWBOX.width} ${PALM_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      overflow="visible"
      className={mirror ? "-scale-x-100" : undefined}
      aria-hidden
      focusable="false"
    >
      <g className="sway-tree" style={swayStyle({ x: PALM_VIEWBOX.width / 2, y: PALM_VIEWBOX.height }, swayTiming(seed, 0, 8, 1.5))}>
        <path d={tree.trunk} fill="none" stroke={tree.trunkColor} strokeWidth="15" strokeLinecap="round" />
        <path d={tree.trunk} fill="none" stroke="#E9D6A0" strokeOpacity=".22" strokeWidth="15" strokeDasharray="2 9" />
        {tree.fronds.map((frond, i) => (
          <g key={i} className="sway-frond" style={swayStyle(tree.crown, swayTiming(seed, i + 1, 3.8, 2))} stroke={frond.color} fill="none" strokeLinecap="round">
            <path d={frond.rib} strokeWidth="3" />
            <path d={frond.leaflets} strokeWidth="2.6" />
          </g>
        ))}
        <g fill={tree.trunkColor}>
          <circle cx={tree.crown.x - 7} cy={tree.crown.y + 10} r="7" />
          <circle cx={tree.crown.x + 6} cy={tree.crown.y + 12} r="7" />
          <circle cx={tree.crown.x} cy={tree.crown.y + 20} r="6.5" />
        </g>
      </g>
    </svg>
  );
});

export const Bush = memo(function Bush({ seed, tone, mirror }: { seed: number; tone: BushTone; mirror?: boolean }) {
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
        {shape.flowers.map((f, i) => (
          <use key={`f${i}`} href="#rm-melati" x={f.x} y={f.y} width={f.size} height={f.size} />
        ))}
      </g>
    </svg>
  );
});
