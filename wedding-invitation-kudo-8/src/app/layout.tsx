import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Huruf judul & teks — serif klasik seperti kredit pembuka film.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Huruf mono untuk koordinat, ketinggian, timecode, dan label adegan.
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const amiri = Amiri({ subsets: ["arabic"], weight: ["400"], variable: "--font-arabic", display: "swap", preload: false });

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#07090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${mono.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
