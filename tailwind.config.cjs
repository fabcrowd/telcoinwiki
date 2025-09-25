/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050a1b',
        surface: '#0b1327',
        surfaceAlt: '#111c36',
        border: 'rgba(93, 114, 153, 0.4)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular']
      }
    }
  },
  plugins: []
};
