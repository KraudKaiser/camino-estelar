import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#0B1724",
          900: "#0F1D2F",
          800: "#162A3F",
          700: "#1B3047",
          600: "#29445C",
          500: "#345A7A",
        },
        accent: {
          DEFAULT: "#7EDDD3",
          light: "#9CE8DF",
          dark: "#5BC4B8",
          warm: "#4DB8AC",
        },
        text: {
          primary: "#F4F7FA",
          secondary: "#B9C6D3",
          muted: "#7A8FA0",
        },
        success: "#4a9d6e",
        error: "#c45c5c",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-slow": "fadeIn 1s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-up-slow": "slideUp 1s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(126, 221, 211, 0.1)" },
          "100%": { boxShadow: "0 0 30px rgba(126, 221, 211, 0.2)" },
        },
      },
      boxShadow: {
        "glow": "0 0 20px rgba(126, 221, 211, 0.15)",
        "glow-lg": "0 0 40px rgba(126, 221, 211, 0.2)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
