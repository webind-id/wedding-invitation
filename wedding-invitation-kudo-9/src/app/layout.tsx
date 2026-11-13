import type { Metadata, Viewport } from "next";
import { Amiri, Bodoni_Moda, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

// Hanya untuk nama & tanda tangan.
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: ["400"], variable: "--font-pinyon", display: "swap" });

const amiri = Amiri({ subsets: ["arabic"], weight: ["400"], variable: "--font-arabic", display: "swap", preload: false });

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F4F1F6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${bodoni.variable} ${jost.variable} ${pinyon.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
