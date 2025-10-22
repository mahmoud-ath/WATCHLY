/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Color palette
        bgDark: "#0A0A0A",       // Main background
        sidebar: "#f84200ff",      // Sidebar and header
        card: "#1E3A8A",         // Movie card
        primary: "#F97316",      // Accent orange
        textLight: "#FFFFFF",
        textDark: "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        fancy: ['"Rock Salt"', "cursive"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(249, 115, 22, 0.4)",
      },
      transitionTimingFunction: {
        "in-out-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
