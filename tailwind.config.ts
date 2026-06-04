import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: {
          primary: "#0A0F1C",
          secondary: "#111827",
          card: "#151D2F",
          hover: "#1E293B",
        },
        blue: {
          primary: "#2563EB",
          glow: "#3B82F6",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        purple: "#8B5CF6",
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
        },
        border: "rgba(255,255,255,0.08)",
      },
      fontSize: {
        "display-xl": ["60px", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "1.15", fontWeight: "700" }],
        "heading-1": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-2": ["30px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-4": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body": ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "caption": ["12px", { lineHeight: "1.4" }],
      },
      spacing: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        "64": "64px",
        "80": "80px",
      },
      borderRadius: {
        "input": "12px",
        "card": "20px",
        "modal": "24px",
        "button": "14px",
        "badge": "999px",
      },
      boxShadow: {
        "sm": "0 2px 8px rgba(0,0,0,0.15)",
        "md": "0 10px 30px rgba(0,0,0,0.25)",
        "premium": "0 20px 60px rgba(0,0,0,0.35)",
        "glow-blue": "0 0 30px rgba(59,130,246,0.30)",
        "glow-blue-strong": "0 0 40px rgba(59,130,246,0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        premium: "30px",
      },
    },
  },
  plugins: [],
};

export default config;
