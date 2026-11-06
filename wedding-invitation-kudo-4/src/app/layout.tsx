import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F2E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${newsreader.variable} ${hanken.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
