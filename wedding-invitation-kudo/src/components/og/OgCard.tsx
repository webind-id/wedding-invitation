/**
 * Kartu pratinjau tautan 1200×630 bergaya "botanical letterpress" (kudo), dirender oleh
 * next/og (Satori): hanya flexbox & properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 400, height: 520 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "fraunces-latin-500-normal.woff", name: "Fraunces", weight: 500, style: "normal" },
  { file: "fraunces-latin-500-italic.woff", name: "Fraunces", weight: 500, style: "italic" },
  { file: "plus-jakarta-sans-latin-500-normal.woff", name: "Jakarta", weight: 500, style: "normal" },
  { file: "plus-jakarta-sans-latin-700-normal.woff", name: "Jakarta", weight: 700, style: "normal" },
];

const C = {
  linen: "#F6F0E6",
  parchment: "#EADFCC",
  forest: "#1F3A2E",
  moss: "#4F6B57",
  sage: "#A9B8A0",
  clay: "#B4623A",
  blush: "#E8C9B5",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → lengkung linen bermonogram. */
  photo: string | null;
}

const ARCH = `${OG_PHOTO.width / 2}px ${OG_PHOTO.width / 2}px 6px 6px`;

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 64 : longest > 9 ? 78 : 96;
}

/** Tangkai daun kecil: garis sage dengan daun belah ketupat di tengah. */
function Sprig() {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
      <div style={{ width: 64, height: 1.5, background: C.sage, display: "flex" }} />
      <div style={{ width: 10, height: 18, margin: "0 8px", borderRadius: "50%", background: C.sage, transform: "rotate(-35deg)", display: "flex" }} />
      <div style={{ width: 10, height: 18, marginRight: 8, borderRadius: "50%", background: C.moss, transform: "rotate(35deg)", display: "flex" }} />
      <div style={{ width: 64, height: 1.5, background: C.sage, display: "flex" }} />
    </div>
  );
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", alignItems: "center", background: C.linen, position: "relative" }}>
      <div style={{ position: "absolute", top: 22, left: 22, right: 22, bottom: 22, border: `1.5px solid ${C.parchment}`, display: "flex" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0 40px 0 96px" }}>
        <div style={{ fontFamily: "Jakarta", fontWeight: 700, fontSize: 17, letterSpacing: 6, color: C.clay }}>UNDANGAN PERNIKAHAN</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
          <div style={{ fontFamily: "Fraunces", fontWeight: 500, fontSize: size, lineHeight: 1.02, color: C.forest }}>{first}</div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: Math.round(size * 0.6), lineHeight: 1.1, color: C.clay, marginLeft: 6 }}>&amp;</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 500, fontSize: size, lineHeight: 1.02, color: C.forest }}>{second}</div>
        </div>
        <Sprig />
        <div style={{ fontFamily: "Jakarta", fontWeight: 700, fontSize: 26, color: C.forest, marginTop: 24 }}>{date}</div>
        <div style={{ fontFamily: "Jakarta", fontWeight: 500, fontSize: 20, color: C.moss, marginTop: 8, maxWidth: 560 }}>{venue}</div>
      </div>

      <div style={{ display: "flex", marginRight: 92, padding: 10, border: `1.5px solid ${C.sage}`, borderRadius: `${OG_PHOTO.width / 2 + 10}px ${OG_PHOTO.width / 2 + 10}px 10px 10px` }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover", borderRadius: ARCH }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              borderRadius: ARCH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(180deg, ${C.blush} 0%, ${C.parchment} 100%)`,
            }}
          >
            <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 140, color: C.forest }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
      </div>
    </div>
  );
}
