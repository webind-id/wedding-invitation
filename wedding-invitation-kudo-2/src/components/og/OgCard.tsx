/**
 * Kartu pratinjau tautan 1200×630 bergaya "Noir Premiere" (kudo-2): poster pemutaran perdana,
 * hitam pekat dengan emas. Dirender oleh next/og (Satori): hanya flexbox & properti CSS dasar,
 * setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 560, height: 630 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "bodoni-moda-latin-400-normal.woff", name: "Bodoni", weight: 400, style: "normal" },
  { file: "bodoni-moda-latin-500-italic.woff", name: "Bodoni", weight: 500, style: "italic" },
  { file: "jost-latin-400-normal.woff", name: "Jost", weight: 400, style: "normal" },
  { file: "jost-latin-500-normal.woff", name: "Jost", weight: 500, style: "normal" },
];

const C = {
  void: "#08080A",
  onyx: "#121215",
  graphite: "#1C1C21",
  smoke: "#8B8780",
  ivory: "#F2ECE1",
  gold: "#C9A66B",
  goldDeep: "#9C7B45",
  ember: "#7A2E2A",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → sorot lampu bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 58 : longest > 9 ? 70 : 86;
}

function GoldRule({ width }: { width: number }) {
  return <div style={{ width, height: 1, background: C.gold, display: "flex" }} />;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", background: C.void, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: OG_PHOTO.width, height: OG_PHOTO.height, display: "flex" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle at 50% 35%, ${C.graphite} 0%, ${C.onyx} 45%, ${C.void} 85%)`,
            }}
          >
            <div style={{ fontFamily: "Bodoni", fontStyle: "italic", fontSize: 150, color: C.gold }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
        {/* Foto meredup ke hitam di sisi teks */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 260, height: 630, display: "flex", background: `linear-gradient(90deg, ${C.void} 0%, rgba(8,8,10,0) 100%)` }} />
      </div>

      {/* Bingkai emas tipis ganda */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: `1px solid ${C.goldDeep}`, display: "flex" }} />
      <div style={{ position: "absolute", top: 30, left: 30, right: 30, bottom: 30, border: `1px solid rgba(201,166,107,0.35)`, display: "flex" }} />

      <div style={{ width: 700, height: 630, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 60px 0 80px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <GoldRule width={44} />
          <div style={{ fontFamily: "Jost", fontWeight: 500, fontSize: 16, letterSpacing: 7, color: C.gold, margin: "0 18px" }}>UNDANGAN PERNIKAHAN</div>
          <GoldRule width={44} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30 }}>
          <div style={{ fontFamily: "Bodoni", fontSize: size, lineHeight: 1.04, letterSpacing: 4, color: C.ivory, textTransform: "uppercase" }}>{first}</div>
          <div style={{ fontFamily: "Bodoni", fontStyle: "italic", fontWeight: 500, fontSize: 46, lineHeight: 1.2, color: C.gold }}>&amp;</div>
          <div style={{ fontFamily: "Bodoni", fontSize: size, lineHeight: 1.04, letterSpacing: 4, color: C.ivory, textTransform: "uppercase" }}>{second}</div>
        </div>
        <div style={{ display: "flex", marginTop: 32 }}>
          <GoldRule width={120} />
        </div>
        <div style={{ fontFamily: "Jost", fontWeight: 500, fontSize: 24, letterSpacing: 3, color: C.ivory, marginTop: 26, textTransform: "uppercase" }}>{date}</div>
        <div style={{ fontFamily: "Jost", fontSize: 19, color: C.smoke, marginTop: 10, maxWidth: 520 }}>{venue}</div>
      </div>
    </div>
  );
}
