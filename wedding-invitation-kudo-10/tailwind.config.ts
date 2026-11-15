import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema: Rustic Bohemian
        // Warna Utama: Terracotta, Olive, Cream (plus earthy sand & deep espresso)
        cream: {
          DEFAULT: "#FAF6F0",
          50: "#FDFBF7",
          100: "#FAF6F0",
          200: "#F4EEE5",
          300: "#EAE0D2",
          400: "#DECDBA",
          500: "#CBB69F",
        },
        terracotta: {
          DEFAULT: "#C86D51",
          50: "#FAF1ED",
          100: "#F4DFD8",
          200: "#E8BDB0",
          300: "#DC9986",
          400: "#D37F66",
          500: "#C86D51",
          600: "#B4583C",
          700: "#98442B",
          800: "#7A3521",
          900: "#5D2819",
        },
        olive: {
          DEFAULT: "#6B7A5C",
          50: "#F3F6F1",
          100: "#E5ECE0",
          200: "#CBD8C2",
          300: "#AFC3A2",
          400: "#8D9F80",
          500: "#6B7A5C",
          600: "#556447",
          700: "#414E36",
          800: "#303A28",
          900: "#20271A",
        },
        sand: {
          DEFAULT: "#E5DDD0",
          soft: "#EFE8DE",
          deep: "#D1C3B0",
          dark: "#B8A793",
        },
        earth: {
          ink: "#2B231D",
          muted: "#6E6259",
          subtle: "#9C8E82",
          border: "#D6C8B8",
          warm: "#42362E",
        },
        gold: {
          DEFAULT: "#C59B58",
          light: "#E3C896",
          soft: "#F9F4EB",
          deep: "#A37A38",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Libre Baskerville", "Georgia", "serif"],
        script: ["var(--font-script)", "Alex Brush", "cursive"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      boxShadow: {
        rustic: "0 10px 25px -5px rgba(69, 48, 33, 0.08), 0 8px 10px -6px rgba(69, 48, 33, 0.04)",
        "rustic-sm": "0 4px 12px -2px rgba(69, 48, 33, 0.06)",
        "rustic-lg": "0 20px 35px -10px rgba(69, 48, 33, 0.12), 0 10px 15px -5px rgba(69, 48, 33, 0.05)",
        "rustic-inner": "inset 0 2px 4px 0 rgba(69, 48, 33, 0.06)",
        "seal": "0 4px 14px rgba(152, 68, 43, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        arch: "160px 160px 0 0",
        "arch-sm": "100px 100px 0 0",
      },
    },
  },
  plugins: [],
};

export default config;
