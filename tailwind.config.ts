import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbfd",
          100: "#d9f4f8",
          200: "#b3e7ef",
          300: "#7fd3e1",
          400: "#42b8cd",
          500: "#219bb2",
          600: "#1b7c91",
          700: "#1a6376",
          800: "#1b5362",
          900: "#0f3641",
          950: "#08232b"
        },
        ink: "#0f172a",
        shell: "#f8fafc"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 45px -20px rgba(8, 35, 43, 0.25)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top left, rgba(66,184,205,0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(16,185,129,0.12), transparent 35%)"
      }
    }
  },
  plugins: []
};

export default config;
