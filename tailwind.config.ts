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
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          'gold-dark': '#D97706',
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
          cyan: '#06B6D4',
          dark: '#0D0D1A',
          'card': '#12122A',
          'card-border': 'rgba(245,158,11,0.15)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, rgba(13,13,26,0) 70%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(18,18,42,0.9) 0%, rgba(13,13,26,0.95) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245,158,11,0.2), 0 0 10px rgba(245,158,11,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(245,158,11,0.4), 0 0 40px rgba(245,158,11,0.2)' },
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
