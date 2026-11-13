/**
 * Kartu pratinjau tautan 1200×630 bergaya "Old Money" (kudo-5): kartu undangan cetak ukir di
 * kertas antik, bingkai burgundy ganda, potret oval. Dirender oleh next/og (Satori): hanya
 * flexbox & properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 300, height: 400 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "eb-garamond-latin-500-normal.woff", name: "Garamond", weight: 500, style: "normal" },
  { file: "eb-garamond-latin-500-italic.woff", name: "Garamond", weight: 500, style: "italic" },
  { file: "im-fell-english-latin-400-italic.woff", name: "Fell", weight: 400, style: "italic" },
  { file: "im-fell-english-sc-latin-400-normal.woff", name: "FellSC", weight: 400, style: "normal" },
];

const C = {
  antique: "#F3EBDD",
  parchment: "#E7DAC2",
  burgundy: "#6B1E2A",
  wine: "#4A1520",
  bottle: "#1E3226",
  sepia: "#8A7258",
  ink: "#2B211B",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → oval perkamen bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 66 : longest > 9 ? 80 : 96;
}

function Flourish() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: 80, height: 1, background: C.sepia, display: "flex" }} />
      <div style={{ width: 6, height: 6, margin: "0 10px", transform: "rotate(45deg)", border: `1px solid ${C.burgundy}`, display: "flex" }} />
      <div style={{ width: 8, height: 8, transform: "rotate(45deg)", background: C.burgundy, display: "flex" }} />
      <div style={{ width: 6, height: 6, margin: "0 10px", transform: "rotate(45deg)", border: `1px solid ${C.burgundy}`, display: "flex" }} />
      <div style={{ width: 80, height: 1, background: C.sepia, display: "flex" }} />
    </div>
  );
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", alignItems: "center", background: C.antique, position: "relative" }}>
      {/* Bingkai ukir: garis tebal burgundy + garis rambut di dalamnya */}
      <div style={{ position: "absolute", top: 26, left: 26, right: 26, bottom: 26, border: `3px solid ${C.burgundy}`, display: "flex" }} />
      <div style={{ position: "absolute", top: 36, left: 36, right: 36, bottom: 36, border: `1px solid ${C.burgundy}`, display: "flex" }} />

      <div style={{ display: "flex", marginLeft: 110, padding: 8, border: `1.5px solid ${C.sepia}`, borderRadius: "50%" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.parchment,
            }}
          >
            <div style={{ fontFamily: "Fell", fontStyle: "italic", fontSize: 130, color: C.burgundy }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 80px 0 60px" }}>
        <div style={{ fontFamily: "FellSC", fontSize: 22, letterSpacing: 5, color: C.burgundy }}>Undangan Pernikahan</div>
        <div style={{ display: "flex", marginTop: 18 }}>
          <Flourish />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16 }}>
          <div style={{ fontFamily: "Fell", fontStyle: "italic", fontSize: size, lineHeight: 1.08, color: C.ink }}>{first}</div>
          <div style={{ fontFamily: "Garamond", fontStyle: "italic", fontWeight: 500, fontSize: 36, lineHeight: 1.1, color: C.sepia }}>dan</div>
          <div style={{ fontFamily: "Fell", fontStyle: "italic", fontSize: size, lineHeight: 1.08, color: C.ink }}>{second}</div>
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          <Flourish />
        </div>
        <div style={{ fontFamily: "Garamond", fontWeight: 500, fontSize: 30, color: C.wine, marginTop: 20 }}>{date}</div>
        <div style={{ fontFamily: "FellSC", fontSize: 20, letterSpacing: 1, color: C.sepia, marginTop: 6, maxWidth: 520 }}>{venue}</div>
      </div>
    </div>
  );
}
