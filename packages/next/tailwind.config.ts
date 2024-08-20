import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        "left-panel": "125px",
        "track-height": "125px",
        "control-height": "35px",
      },
      backgroundColor: {
        default: "#F5F5F5",
        "default-hover": "#EAEAEA",
        btn: "#FAFAFA",
        "btn-focused": "#EDEDED",
      },
      borderColor: {
        btn: "#DBDBDB",
      },
      boxShadow: {
        "custom-sm": "0px 8px 20px rgba(0, 0, 0, 0.05)",
        a: "0px 5px 20px rgba(0, 0, 0, 0.05)",
        b: "0px 5px 20px rgba(0, 0, 0, 0.15)",
        c: "0px 5px 20px rgba(0, 0, 0, 0.30)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
      transitionProperty: {
        brightness: "brightness",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        ".center": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;

export default config;
