/**
 * Kartu pratinjau tautan 1200×630 bergaya "Luxury Editorial" (kudo-4): sampul majalah dengan
 * masthead, foto utama, dan kolom tipografi. Dirender oleh next/og (Satori): hanya flexbox &
 * properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 470, height: 630 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "newsreader-latin-400-normal.woff", name: "Newsreader", weight: 400, style: "normal" },
  { file: "newsreader-latin-400-italic.woff", name: "Newsreader", weight: 400, style: "italic" },
  { file: "hanken-grotesk-latin-500-normal.woff", name: "Hanken", weight: 500, style: "normal" },
  { file: "hanken-grotesk-latin-700-normal.woff", name: "Hanken", weight: 700, style: "normal" },
];

const C = {
  ivory: "#F7F2E8",
  champagne: "#E9DCC3",
  bone: "#EFE7D8",
  ink: "#141210",
  stone: "#77706A",
  rule: "#D8CCB5",
  gold: "#A8895A",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → panel champagne bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 70 : longest > 9 ? 86 : 104;
}

function Rule() {
  return <div style={{ width: "100%", height: 1, background: C.ink, display: "flex" }} />;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", background: C.ivory }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 60px 44px 64px" }}>
        {/* Masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 30, color: C.ink }}>The Wedding Issue</div>
          <div style={{ fontFamily: "Hanken", fontWeight: 700, fontSize: 13, letterSpacing: 4, color: C.gold }}>EDISI ISTIMEWA</div>
        </div>
        <div style={{ display: "flex", marginTop: 14 }}>
          <Rule />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "Hanken", fontWeight: 700, fontSize: 15, letterSpacing: 6, color: C.stone }}>UNDANGAN PERNIKAHAN</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 14 }}>
            <div style={{ fontFamily: "Newsreader", fontSize: size, lineHeight: 0.98, letterSpacing: -1, color: C.ink }}>{first}</div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: Math.round(size * 0.62), lineHeight: 1, color: C.gold, marginRight: 16 }}>&amp;</div>
              <div style={{ fontFamily: "Newsreader", fontSize: size, lineHeight: 0.98, letterSpacing: -1, color: C.ink }}>{second}</div>
            </div>
          </div>
          <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 24, color: C.stone, marginTop: 20 }}>Sebuah cerita cinta, dan Anda diundang merayakannya.</div>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ width: "100%", height: 1, background: C.rule, display: "flex" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 16 }}>
          <div style={{ fontFamily: "Hanken", fontWeight: 700, fontSize: 19, letterSpacing: 2, color: C.ink }}>{date.toUpperCase()}</div>
          <div style={{ fontFamily: "Hanken", fontWeight: 500, fontSize: 17, color: C.stone, maxWidth: 330, textAlign: "right" }}>{venue}</div>
        </div>
      </div>

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
            background: `linear-gradient(160deg, ${C.bone} 0%, ${C.champagne} 100%)`,
          }}
        >
          <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 170, color: C.gold }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
        </div>
      )}
    </div>
  );
}
