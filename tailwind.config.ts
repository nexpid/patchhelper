import type { Config } from "tailwindcss";
import plugin from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "background-primary": {
          light: "#ffffff",
          dark: "#313338",
        },
        "background-secondary": {
          light: "#f2f3f5",
          dark: "#2b2d31",
        },
        "background-modifier-accent": {
          light: "#80848e3d",
          dark: "#4e50587a",
        },
        "text-normal": {
          light: "#313338",
          dark: "#dbdee1",
        },
        "text-danger": {
          light: "#a12829",
          dark: "#fa777b",
        },
        "header-primary": {
          light: "#060607",
          dark: "#f2f3f5",
        },
        "header-secondary": {
          light: "#4e5058",
          dark: "#b5bac1",
        },
        "input-background": {
          light: "#00000014",
          dark: "#1e1f22",
        },
        "info-warning-background": {
          light: "#af76151a",
          dark: "#f0b2321a",
        },
        "info-warning-foreground": {
          light: "#af7615",
          dark: "#f0b232",
        },
        "info-help-background": {
          light: "#006be71a",
          dark: "#00aafc1a",
        },
        "info-help-foreground": {
          light: "#006be7",
          dark: "#00aafc",
        },
        "info-danger-background": {
          light: "#da373c1a",
          dark: "#f23f431a",
        },
        "info-danger-foreground": {
          light: "#da373c",
          dark: "#f23f43",
        },
        "info-danger-text": {
          light: "#000000",
          dark: "#ffffff",
        },
        "info-positive-background": {
          light: "#24934e0d",
          dark: "#23a55a1a",
        },
        "info-positive-foreground": {
          light: "#24934e",
          dark: "#23a55a",
        },
        "info-box-text": {
          light: "#000000",
          dark: "#ffffff",
        },
      },
      fontFamily: {
        primary:
          "'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        display:
          "'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        code: "Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace",
      },
    },
  },
  plugins: [],
};
export default config;
