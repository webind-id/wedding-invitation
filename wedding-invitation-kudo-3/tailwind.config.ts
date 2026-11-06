import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Chiaroscuro — gelap pekat, cokelat tua, krem hangat seperti cahaya senja.
        ink: "#0A0908",
        charcoal: "#1B1A19",
        soot: "#2A2725",
        umber: "#3B2A20",
        bronze: "#9A7656",
        cream: "#EFE6D6",
        haze: "#A39A8C",
      },
      fontFamily: {
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        arabic: ["var(--font-scheherazade)", "serif"],
      },
      transitionDuration: {
        slow: "1800ms",
        slower: "2400ms",
      },
      keyframes: {
        "ken-burns": {
          "0%": { transform: "scale(1.06) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.18) translate3d(-2%,-1.5%,0)" },
        },
        "light-leak": {
          "0%, 100%": { transform: "translate3d(-10%,-6%,0) scale(1)" },
          "50%": { transform: "translate3d(12%,8%,0) scale(1.2)" },
        },
        equalizer: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "ken-burns": "ken-burns 16s ease-in-out infinite alternate",
        "light-leak": "light-leak 18s ease-in-out infinite",
        equalizer: "equalizer 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
