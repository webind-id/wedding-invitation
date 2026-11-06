import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Botanical letterpress palette — warm paper, deep forest, fired clay.
        linen: "#F6F0E6",
        parchment: "#EADFCC",
        forest: "#1F3A2E",
        moss: "#4F6B57",
        sage: "#A9B8A0",
        clay: "#B4623A",
        blush: "#E8C9B5",
        bark: "#2A2420",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      borderRadius: {
        arch: "999px 999px 1.25rem 1.25rem",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        drift: {
          "0%": { transform: "scale(1.04) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.12) translate3d(-2%,-1%,0)" },
        },
      },
      animation: {
        sway: "sway 6s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        drift: "drift 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
