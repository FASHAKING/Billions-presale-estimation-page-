import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:        '#0046FF',
          'blue-dark': '#0035CC',
          'blue-mid':  '#0095FF',
          cyan:        '#3EFFC8',
          'lime':      '#C4FF3C',
          green:       '#61D433',
          pink:        '#FF5963',
          dark:        '#070A18',
          card:        '#0C1029',
        },
      },
      backgroundImage: {
        'hero-glow':     'radial-gradient(ellipse at 50% 0%, rgba(0,70,255,0.25) 0%, rgba(7,10,24,0) 70%)',
        'blue-gradient': 'linear-gradient(135deg, #0046FF 0%, #0095FF 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #3EFFC8 0%, #0095FF 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-blue':  'glowBlue 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowBlue: {
          '0%':   { boxShadow: '0 0 8px rgba(0,70,255,0.3)' },
          '100%': { boxShadow: '0 0 24px rgba(0,70,255,0.6)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
