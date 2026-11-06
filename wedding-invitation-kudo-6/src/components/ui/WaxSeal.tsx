import { useId } from "react";

/** Tepi lilin yang tidak rata — lingkaran dengan 14 tonjolan lembut. */
const BLOB = (() => {
  const points = 28;
  const parts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = 46 + (i % 2 === 0 ? 3.2 : -1.4);
    parts.push(`${i === 0 ? "M" : "L"}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `${parts.join(" ")}Z`;
})();

/** Segel lilin dusty rose bermonogram — matte, bukan emas mengilap. */
export function WaxSeal({ monogram, size = "4.75rem" }: { monogram: string; size?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="-55 -55 110 110" style={{ width: size, height: size }} className="drop-shadow-[0_8px_10px_rgba(120,70,76,0.35)]" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-wax`} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#D3A9AE" />
          <stop offset="0.55" stopColor="#B9858B" />
          <stop offset="1" stopColor="#9C6B72" />
        </radialGradient>
      </defs>
      <path d={BLOB} fill={`url(#${uid}-wax)`} />
      <circle r="33" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <circle r="30" fill="none" stroke="rgba(110,60,66,0.35)" strokeWidth="1" />
      <text y="9" textAnchor="middle" fontFamily="var(--font-cormorant), serif" fontStyle="italic" fontSize="27" fill="#FBF3F1" opacity="0.92">
        {monogram}
      </text>
    </svg>
  );
}
