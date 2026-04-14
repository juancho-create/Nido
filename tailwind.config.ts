import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nido: {
          cream:   '#FAF7F2',
          sage:    '#7B9E84',
          forest:  '#4A7C59',
          sky:     '#B8D4E8',
          amber:   '#E8915A',
          gold:    '#F4C430',
          mist:    '#F0F4F8',
          bark:    '#8B7355',
          dusk:    '#4A5568',
          rose:    '#E07B54',
        },
      },
      backgroundImage: {
        'meadow-sky':  'linear-gradient(180deg, #B8D4E8 0%, #E8F4F8 60%, #D4E8D0 100%)',
        'forest-sky':  'linear-gradient(180deg, #6B9B6B 0%, #A8C4A8 60%, #5E8B5F 100%)',
        'valley-sky':  'linear-gradient(180deg, #F9D876 0%, #FFE4A0 60%, #C4A87A 100%)',
        'open-sky':    'linear-gradient(180deg, #4A90D9 0%, #87CEEB 60%, #E8F4FF 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass:  '0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-md': '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        float:  '0 8px 24px rgba(0,0,0,0.12)',
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'float-slow':   'float 6s ease-in-out infinite',
        'float-fast':   'float 2.5s ease-in-out infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
        'bounce-gentle':'bounce-gentle 2s ease-in-out infinite',
        'wing-flap':    'wing-flap 0.4s ease-in-out infinite alternate',
        'fade-in':      'fade-in 0.4s ease-out',
        'slide-up':     'slide-up 0.4s ease-out',
        'scale-in':     'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'wing-flap': {
          '0%':   { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.85)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
