import type { Metadata, Viewport } from "next";
import { Alex_Brush, Amiri, Libre_Baskerville, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: "Undangan Pernikahan Rustic Bohemian",
  description: "Undangan pernikahan elegan dengan tema Rustic Bohemian bernuansa terracotta, olive, dan cream untuk garden wedding.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF6F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${libreBaskerville.variable} ${alexBrush.variable} ${jakarta.variable} ${amiri.variable}`}
    >
      <body className="bg-cream font-sans text-earth-ink antialiased selection:bg-terracotta/20 selection:text-terracotta-900">
        {children}
      </body>
    </html>
  );
}
