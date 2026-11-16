/**
 * Kartu pratinjau tautan 1200×630 bergaya "Lampion Malam":
 * langit malam indigo, lampion amber bercahaya, teks emas, foto sampul berbingkai lampion.
 * Dirender oleh next/og (Satori) — hanya flexbox & gradien, tanpa transform 3D.
 */
export const OG_PHOTO = { width: 440, height: 480 } as const;

export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "cormorant-garamond-latin-300-normal.woff", name: "Cormorant", weight: 300, style: "normal" },
  { file: "cormorant-garamond-latin-400-italic.woff", name: "Cormorant", weight: 400, style: "italic" },
  { file: "jetbrains-mono-latin-400-normal.woff", name: "Mono", weight: 400, style: "normal" },
];

const C = {
  night: "#0B1026",
  nightDeep: "#05081A",
  moon: "#FDF3DC",
  muted: "#C9C3D9",
  gold: "#E7C27A",
  goldLight: "#F4DDAA",
  ember: "#F5A524",
};

export interface OgCardProps {
  first: string;
  second: string;
  date: string;
  venue: string;
  photo: string | null;
}

/** Lampion datar sederhana (persegi panjang membulat bergradasi + pendar). */
function OgLantern({ left, top, size, opacity }: { left: number; top: number; size: number; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size * 1.3,
        borderRadius: `${size * 0.2}px ${size * 0.2}px ${size * 0.35}px ${size * 0.35}px`,
        backgroundImage: "linear-gradient(to bottom, #FFF1C9 0%, #F8B23A 55%, #C9561F 100%)",
        boxShadow: `0 0 ${size}px ${size * 0.3}px rgba(245,165,36,0.35)`,
        opacity,
        display: "flex",
      }}
    />
  );
}

const SKY: { left: number; top: number; size: number; opacity: number }[] = [
  { left: 30, top: 560, size: 24, opacity: 0.5 },
  { left: 180, top: 60, size: 18, opacity: 0.45 },
  { left: 560, top: 520, size: 22, opacity: 0.5 },
  { left: 640, top: 70, size: 30, opacity: 0.7 },
  { left: 1120, top: 520, size: 20, opacity: 0.5 },
  { left: 1110, top: 40, size: 16, opacity: 0.4 },
];

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 90px",
        backgroundColor: C.night,
        backgroundImage: `radial-gradient(ellipse at 50% 0%, #27336A 0%, ${C.night} 55%, ${C.nightDeep} 100%)`,
        fontFamily: "Cormorant",
        color: C.moon,
      }}
    >
      {SKY.map((l) => (
        <OgLantern key={`${l.left}-${l.top}`} {...l} />
      ))}

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 560 }}>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: `1px solid ${C.gold}`,
            borderRadius: 30,
            padding: "8px 22px",
            fontSize: 16,
            color: C.goldLight,
            letterSpacing: 4,
            fontFamily: "Mono",
            marginBottom: 26,
          }}
        >
          THE WEDDING OF
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.05, color: C.moon }}>
          <span>{first}</span>
          <span style={{ fontStyle: "italic", color: C.ember, fontSize: 56, margin: "2px 0" }}>&amp;</span>
          <span>{second}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            paddingTop: 20,
            borderTop: `1px solid rgba(231,194,122,0.4)`,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: C.goldLight }}>{date}</div>
          {venue && <div style={{ display: "flex", fontSize: 22, color: C.muted, marginTop: 6 }}>{venue}</div>}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: OG_PHOTO.width,
          height: OG_PHOTO.height,
          padding: 8,
          borderRadius: "220px 220px 40px 40px",
          border: `2px solid ${C.gold}`,
          backgroundColor: C.nightDeep,
          boxShadow: "0 0 70px 6px rgba(245,165,36,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "212px 212px 32px 32px",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "linear-gradient(to bottom, #1B2550, #0B1026)",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: C.gold }}>UNDANGAN</div>
          )}
        </div>
      </div>
    </div>
  );
}
