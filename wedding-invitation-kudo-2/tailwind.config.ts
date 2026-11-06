import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Noir Premiere — hitam pekat bioskop, emas sampanye, gading.
        void: "#08080A",
        onyx: "#121215",
        graphite: "#1C1C21",
        smoke: "#8B8780",
        ivory: "#F2ECE1",
        gold: "#C9A66B",
        "gold-deep": "#9C7B45",
        ember: "#7A2E2A",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "Didot", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
        arabic: ["var(--font-naskh)", "serif"],
      },
      letterSpacing: {
        marquee: "0.42em",
      },
      keyframes: {
        reel: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        credits: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(0,-50%,0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "48%": { opacity: "1" },
          "50%": { opacity: "0.82" },
          "52%": { opacity: "1" },
        },
        "slow-zoom": {
          from: { transform: "scale(1.02)" },
          to: { transform: "scale(1.12)" },
        },
        "beam-sweep": {
          "0%, 100%": { transform: "rotate(-8deg)", opacity: "0.35" },
          "50%": { transform: "rotate(8deg)", opacity: "0.55" },
        },
      },
      animation: {
        reel: "reel 48s linear infinite",
        credits: "credits 40s linear infinite",
        flicker: "flicker 6s steps(1) infinite",
        "slow-zoom": "slow-zoom 22s ease-in-out infinite alternate",
        "beam-sweep": "beam-sweep 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
