import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema: Lampion Malam (3D Sky Lantern)
        // Langit malam indigo, cahaya lampion amber, merah lampion, emas, dan cahaya bulan.
        night: {
          DEFAULT: "#0B1026",
          950: "#05081A",
          900: "#0B1026",
          800: "#121A3A",
          700: "#1B2550",
          600: "#27336A",
          500: "#3A4785",
          400: "#5562A3",
        },
        ember: {
          DEFAULT: "#F5A524",
          50: "#FFF8E8",
          100: "#FEEBC0",
          200: "#FCD98A",
          300: "#FBC45A",
          400: "#F8B23A",
          500: "#F5A524",
          600: "#DB8710",
          700: "#B4680B",
          800: "#8C4F0E",
          900: "#6B3C10",
        },
        vermilion: {
          DEFAULT: "#D9482B",
          300: "#F08A6B",
          400: "#E8694D",
          500: "#D9482B",
          600: "#B5361E",
          700: "#8E2A18",
        },
        gold: {
          DEFAULT: "#E7C27A",
          light: "#F4DDAA",
          deep: "#B8913F",
        },
        moon: {
          DEFAULT: "#FDF3DC",
          muted: "#C9C3D9",
          subtle: "#9A95B8",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        script: ["var(--font-script)", "Pinyon Script", "cursive"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(245, 165, 36, 0.45)",
        "glow-sm": "0 0 18px -6px rgba(245, 165, 36, 0.5)",
        "glow-lg": "0 0 80px -10px rgba(245, 165, 36, 0.55)",
        night: "0 24px 50px -20px rgba(2, 4, 16, 0.8)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
