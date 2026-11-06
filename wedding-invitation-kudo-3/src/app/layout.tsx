import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, Scheherazade_New } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-scheherazade",
  display: "swap",
  preload: false,
});

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0908",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${instrument.variable} ${manrope.variable} ${scheherazade.variable}`}>
      <body>{children}</body>
    </html>
  );
}
