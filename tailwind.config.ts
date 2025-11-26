import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#2ee7d8",
        accent: "#2ee7d8",
        bg: "#0f151c"
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(46,231,216,0.25)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: [typography]
};

export default config;
