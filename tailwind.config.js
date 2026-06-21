/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        rose: {
          gold: "#C9A27C",
          goldLight: "#D4B58F",
          goldDark: "#B8916B",
        },
        blush: {
          50: "#FDF9F7",
          100: "#FAF0EB",
          200: "#F5E6E0",
          300: "#EDD3C8",
        },
        ink: {
          900: "#2C2C2C",
          700: "#4A4A4A",
          500: "#7A7A7A",
          300: "#B0B0B0",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        elegant: "0 10px 40px -10px rgba(201, 162, 124, 0.3)",
        card: "0 4px 20px -5px rgba(44, 44, 44, 0.08)",
        glow: "0 0 30px rgba(201, 162, 124, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
