import { useId } from "react";

/** Tepi lilin berbentuk bunga — 8 lengkung lembut seperti kelopak. */
const BLOB = (() => {
  const points = 48;
  const parts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = 45 + Math.cos(a * 8) * 3.4;
    parts.push(`${i === 0 ? "M" : "L"}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `${parts.join(" ")}Z`;
})();

/** Segel lilin plum bermonogram dengan cap teratai kecil — matte, tanpa kilau logam. */
export function WaxSeal({ monogram, size = "4.75rem" }: { monogram: string; size?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="-55 -55 110 110" style={{ width: size, height: size }} className="drop-shadow-[0_8px_10px_rgba(78,49,89,0.4)]" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-wax`} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#9A78A6" />
          <stop offset="0.55" stopColor="#6E4A7C" />
          <stop offset="1" stopColor="#4E3159" />
        </radialGradient>
      </defs>
      <path d={BLOB} fill={`url(#${uid}-wax)`} />
      <circle r="32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <circle r="29" fill="none" stroke="rgba(40,20,48,0.35)" strokeWidth="1" />
      <path d="M0 -26 C-5 -22 -6 -17 0 -13 C6 -17 5 -22 0 -26Z M-9 -21 C-12 -16 -8 -13 -2 -13 C-4 -17 -6 -20 -9 -21Z M9 -21 C12 -16 8 -13 2 -13 C4 -17 6 -20 9 -21Z" fill="rgba(244,241,246,0.55)" />
      <text y="14" textAnchor="middle" fontFamily="var(--font-bodoni), serif" fontStyle="italic" fontSize="24" fill="#F4F1F6" opacity="0.92">
        {monogram}
      </text>
    </svg>
  );
}
