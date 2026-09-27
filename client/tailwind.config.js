/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080B14',
          900: '#0B1220',
          800: '#121A2B',
          700: '#1A2438',
          600: '#26324A',
          500: '#3A4B6B',
        },
        signal: {
          DEFAULT: '#6C8CFF',
          soft: '#8FA6FF',
          dim: '#3D4E96',
        },
        mist: {
          DEFAULT: '#E7EAF3',
          dim: '#A9B2C9',
          faint: '#6E778F',
        },
        ok: '#34D399',
        warn: '#FBBF24',
        danger: '#F87171',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(108,140,255,0.15), 0 8px 30px rgba(108,140,255,0.08)',
      },
    },
  },
  plugins: [],
};
