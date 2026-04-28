import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "backdrop-blur-sm",
    "backdrop-blur",
    "backdrop-blur-md",
    "backdrop-blur-lg",
    "backdrop-blur-xl",
    "bg-white/5",
    "bg-white/10",
    "bg-white/20",
    "bg-white/30",
    "bg-white/40",
    "bg-white/50",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-purple':   'var(--gradient-purple)',
        'gradient-banner':   'var(--gradient-banner)',
        'gradient-splash':   'var(--gradient-splash)',
        'gradient-welcome':  'var(--gradient-welcome)',
        'gradient-pink-onb': 'var(--gradient-pink-onb)',
        'gradient-blue-onb': 'var(--gradient-blue-onb)',
        'gradient-partner':  'var(--gradient-partner)',
        'g-purple': 'linear-gradient(160deg, hsl(262 83% 58%) 0%, hsl(252 70% 48%) 55%, hsl(280 75% 48%) 100%)',
      },
      boxShadow: {
        'card-soft': 'var(--shadow-card)',
        'soft':      'var(--shadow-soft)',
        'tile':      'var(--shadow-tile)',
        'g-tile':    'var(--shadow-tile)',
        'g-card':    'var(--shadow-card)',
        'g-card-lg': '0 8px 32px -6px hsl(252 50% 30% / 0.20)',
        'g-primary': '0 4px 20px -4px hsl(252 80% 58% / 0.40)',
      },
      colors: {
        'primary-deep': 'hsl(var(--primary-deep))',
        'primary-soft': 'hsl(var(--primary-soft))',
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin],
};

export default config;
