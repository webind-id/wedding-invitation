import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Studio" — kertas hangat, tinta gelap, aksen tanah liat (selaras brand undangan).
        paper: "#F7F4EE",
        card: "#FFFDF9",
        line: "#E6E0D4",
        ink: "#1D1C1A",
        muted: "#6E6A62",
        clay: "#B4623A",
        forest: "#1F3A2E",
        moss: "#4F6B57",
        danger: "#A33A2B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
