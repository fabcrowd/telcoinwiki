import type { Config } from 'tailwindcss'

const telcoinColors = {
  sky: 'var(--tc-blue-sky)',
  core: 'var(--tc-blue-core)',
  royal: 'var(--tc-blue-royal)',
  violet: 'var(--tc-blue-violet)',
  ink: 'var(--tc-ink)',
  'ink-muted': 'var(--tc-ink-muted)',
  'ink-subtle': 'var(--tc-ink-subtle)',
  surface: 'var(--tc-surface)',
  'surface-2': 'var(--tc-surface-2)',
  border: 'var(--tc-border)',
  'border-strong': 'var(--tc-border-strong)',
  bg: 'var(--tc-bg)',
  'bg-gradient-top': 'var(--tc-bg-gradient-top)',
  primary: {
    50: 'var(--tc-primary-50)',
    300: 'var(--tc-primary-300)',
    500: 'var(--tc-primary-500)',
    700: 'var(--tc-primary-700)',
    DEFAULT: 'var(--tc-primary-500)',
  },
  accent: {
    soft: 'var(--tc-accent-soft)',
    veil: 'var(--tc-accent-veil)',
    outline: 'var(--tc-accent-outline)',
    strong: 'var(--tc-accent-strong)',
    DEFAULT: 'var(--tc-accent)',
  },
  royalTone: {
    soft: 'var(--tc-royal-soft)',
    outline: 'var(--tc-royal-outline)',
  },
  neutral: {
    50: 'var(--tc-neutral-50)',
    100: 'var(--tc-neutral-100)',
    200: 'var(--tc-neutral-200)',
    300: 'var(--tc-neutral-300)',
    500: 'var(--tc-neutral-500)',
    600: 'var(--tc-neutral-600)',
  },
  white: 'var(--tc-white)',
}

const config: Config = {
  content: ['index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        telcoin: telcoinColors,
      },
      fontFamily: {
        display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: 'var(--tc-radius)',
        'brand-lg': 'var(--tc-radius-lg)',
      },
      boxShadow: {
        glass: 'var(--tc-shadow)',
      },
      backgroundImage: {
        'hero-radial': 'var(--tc-hero-radial)',
        'hero-linear': 'var(--tc-hero-linear)',
        'ocean-gradient': 'var(--tc-ocean-gradient)',
      },
      backdropBlur: {
        card: '12px',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(-2%, -4%, 0)' },
          '50%': { transform: 'translate3d(4%, 4%, 0)' },
        },
      },
      animation: {
        gradient: 'gradient 18s ease infinite',
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        float: 'float 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
