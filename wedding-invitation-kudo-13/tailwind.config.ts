import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema: Gerbang Rembulan — pernikahan Tionghoa di klenteng: merah imperial, emas, gading, bunga mei.
        red: {
          950: "#2A0505",
          900: "#4A0909",
          800: "#6E0F0F",
          700: "#9E1B1B",
          500: "#C2302A",
        },
        gold: {
          600: "#A9842F",
          500: "#C9A24B",
          400: "#D9B865",
          300: "#EDD9A0",
        },
        cream: {
          200: "#F0DCC0",
          100: "#F8EBD6",
        },
        ivory: "#FDF7EE",
        ink: {
          700: "#6E2A1E",
          500: "#9A5A44",
        },
        jade: "#2F5D50",
        mei: {
          DEFAULT: "#F7C4C9",
          deep: "#D9788A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        script: ["var(--font-script)", "Pinyon Script", "cursive"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        han: ["var(--font-han)", "Noto Serif SC", "Songti SC", "SimSun", "serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      maxWidth: {
        column: "460px",
      },
      boxShadow: {
        column: "0 0 80px rgba(0, 0, 0, 0.6)",
        gold: "0 6px 18px rgba(169, 132, 47, 0.35)",
        "gold-lg": "0 10px 24px rgba(169, 132, 47, 0.45)",
        card: "0 14px 34px rgba(74, 9, 9, 0.28)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 0.8, 0.26, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
