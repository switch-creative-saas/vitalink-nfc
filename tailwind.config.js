/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        royal: '#1B3A8F',
        'indigo-deep': '#4F46E5',
        vita: {
          purple: '#7C3AED',
          accent: '#6366F1',
          accentLight: '#A5B4FC',
        },
        severity: {
          severe: '#DC2626',
          moderate: '#F59E0B',
          mild: '#FBBF24',
        },
        'vita-dark': {
          base: '#15091F',
          surface: '#1F0F30',
          surfaceLight: '#2A1640',
          glow: '#9333EA',
          glowSoft: '#A855F7',
          border: 'rgba(216, 180, 254, 0.18)',
          text: '#F3E8FF',
          textMuted: '#C4B5FD',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '4xl': '2rem',
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'glass': '0 8px 32px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 30px -10px rgba(10, 30, 60, 0.15)',
        'vita': '0 8px 32px rgba(124, 58, 237, 0.15)',
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "mesh-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glass-shimmer": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "emergency-pulse": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(220, 38, 38, 0.15)" },
          "50%": { boxShadow: "0 0 24px rgba(220, 38, 38, 0.35)" },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.15)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.15)" },
          "60%": { transform: "scale(1)" },
        },
        "vital-cycle": {
          "0%": { backgroundColor: "#DC2626" },
          "25%": { backgroundColor: "#F59E0B" },
          "50%": { backgroundColor: "#3B82F6" },
          "75%": { backgroundColor: "#10B981" },
          "100%": { backgroundColor: "#DC2626" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "mesh-shift": "mesh-shift 18s ease-in-out infinite",
        "glass-shimmer": "glass-shimmer 2s ease-in-out infinite",
        "emergency-pulse": "emergency-pulse 2s ease-in-out infinite",
        "heartbeat": "heartbeat 0.833s ease-in-out infinite",
        "vital-cycle": "vital-cycle 8s linear infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
