/**
 * Kartu pratinjau tautan 1200×630 bergaya "Keraton Sogan" (kudo-7): kertas gading, garis prada
 * keemasan, aksen sogan batik. Dirender oleh next/og (Satori): hanya flexbox & properti CSS dasar,
 * setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 440, height: 630 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "marcellus-latin-400-normal.woff", name: "Marcellus", weight: 400, style: "normal" },
  { file: "eb-garamond-latin-400-italic.woff", name: "Garamond", weight: 400, style: "italic" },
  { file: "eb-garamond-latin-500-normal.woff", name: "Garamond", weight: 500, style: "normal" },
];

const C = {
  gading: "#F5EEE1",
  kertas: "#EDE3D1",
  prada: "#B8914E",
  pradaDeep: "#7E5C28",
  pradaLight: "#DCC08A",
  sogan: "#6E4426",
  soganDeep: "#3E2615",
  ink: "#2B1D14",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → panel sogan bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 70 : longest > 9 ? 86 : 104;
}

/** Belah ketupat prada di sudut bingkai. */
function Corner({ top, left }: { top: number; left: number }) {
  return (
    <div style={{ position: "absolute", top, left, width: 14, height: 14, transform: "rotate(45deg)", background: C.prada, display: "flex" }} />
  );
}

/** Pemisah: garis prada, kuncup tengah, garis prada. */
function Ornament() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: 70, height: 1.5, background: C.prada, display: "flex" }} />
      <div style={{ width: 8, height: 8, marginLeft: 10, transform: "rotate(45deg)", border: `1.5px solid ${C.prada}`, display: "flex" }} />
      <div style={{ width: 12, height: 12, margin: "0 8px", transform: "rotate(45deg)", background: C.sogan, display: "flex" }} />
      <div style={{ width: 8, height: 8, marginRight: 10, transform: "rotate(45deg)", border: `1.5px solid ${C.prada}`, display: "flex" }} />
      <div style={{ width: 70, height: 1.5, background: C.prada, display: "flex" }} />
    </div>
  );
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  const panel = 1200 - OG_PHOTO.width;
  return (
    <div style={{ width: 1200, height: 630, display: "flex", background: C.gading }}>
      <div style={{ width: panel, height: 630, display: "flex", position: "relative", alignItems: "center", justifyContent: "center", background: C.gading }}>
        {/* Pita sogan atas & bawah */}
        <div style={{ position: "absolute", top: 0, left: 0, width: panel, height: 12, background: C.sogan, display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: panel, height: 12, background: C.sogan, display: "flex" }} />
        <div style={{ position: "absolute", top: 36, left: 36, width: panel - 72, height: 630 - 72, border: `1.5px solid ${C.prada}`, display: "flex" }} />
        <div style={{ position: "absolute", top: 44, left: 44, width: panel - 88, height: 630 - 88, border: `1px solid ${C.pradaLight}`, display: "flex" }} />
        <Corner top={29} left={29} />
        <Corner top={29} left={panel - 43} />
        <Corner top={630 - 43} left={29} />
        <Corner top={630 - 43} left={panel - 43} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 80px" }}>
          <div style={{ fontFamily: "Marcellus", fontSize: 18, letterSpacing: 7, color: C.pradaDeep }}>UNDANGAN PERNIKAHAN</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 24 }}>
            <div style={{ fontFamily: "Garamond", fontStyle: "italic", fontSize: size, lineHeight: 1.05, color: C.soganDeep }}>{first}</div>
            <div style={{ fontFamily: "Marcellus", fontSize: 36, lineHeight: 1.2, color: C.prada }}>&amp;</div>
            <div style={{ fontFamily: "Garamond", fontStyle: "italic", fontSize: size, lineHeight: 1.05, color: C.soganDeep }}>{second}</div>
          </div>
          <div style={{ display: "flex", marginTop: 26 }}>
            <Ornament />
          </div>
          <div style={{ fontFamily: "Garamond", fontWeight: 500, fontSize: 30, color: C.ink, marginTop: 22 }}>{date}</div>
          <div style={{ fontFamily: "Marcellus", fontSize: 19, letterSpacing: 1, color: C.sogan, marginTop: 6, maxWidth: 560 }}>{venue}</div>
        </div>
      </div>

      <div style={{ width: OG_PHOTO.width, height: OG_PHOTO.height, display: "flex", position: "relative" }}>
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
              background: `linear-gradient(180deg, ${C.sogan} 0%, ${C.soganDeep} 100%)`,
            }}
          >
            <div style={{ fontFamily: "Marcellus", fontSize: 140, color: C.pradaLight }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
        {/* Garis prada di tepi foto */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 630, background: C.prada, display: "flex" }} />
        <div style={{ position: "absolute", top: 24, left: 30, right: 24, bottom: 24, border: `1px solid rgba(220,192,138,0.7)`, display: "flex" }} />
      </div>
    </div>
  );
}
