import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-naskh",
  display: "swap",
  preload: false,
});

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#08080A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${bodoni.variable} ${jost.variable} ${naskh.variable}`}>
      <body>{children}</body>
    </html>
  );
}
