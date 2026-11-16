import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Undangan Pernikahan Lampion Malam",
  description: "Undangan pernikahan bertema lampion 3D di bawah langit malam berbintang, bernuansa indigo, amber, dan emas.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1026",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${pinyon.variable} ${jost.variable} ${amiri.variable}`}>
      <body className="bg-night font-sans text-moon antialiased">{children}</body>
    </html>
  );
}
