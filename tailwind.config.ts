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
          dawn:    '#FFF8F0',       // warmest cream for warm surfaces
          sand:    '#EDE5D9',       // warm neutral border/bg
          sage:    '#7B9E84',
          moss:    '#A8C5A0',       // light sage tint
          forest:  '#4A7C59',
          sky:     '#B8D4E8',
          powder:  '#D6EAF5',       // lighter sky
          amber:   '#E8915A',
          peach:   '#F5C4A8',       // soft warm accent
          gold:    '#F4C430',
          mist:    '#F0F4F8',
          petal:   '#F5ECEC',       // soft rose tint for relapse
          bark:    '#8B7355',
          dusk:    '#4A5568',
          slate:   '#64748B',       // lighter dusk for secondary text
          rose:    '#E07B54',
        },
      },
      backgroundImage: {
        // Biome backgrounds
        'meadow-sky':    'linear-gradient(180deg, #B8D4E8 0%, #E8F4F8 60%, #D4E8D0 100%)',
        'forest-sky':    'linear-gradient(180deg, #6B9B6B 0%, #A8C4A8 60%, #5E8B5F 100%)',
        'valley-sky':    'linear-gradient(180deg, #F9D876 0%, #FFE4A0 60%, #C4A87A 100%)',
        'open-sky':      'linear-gradient(180deg, #4A90D9 0%, #87CEEB 60%, #E8F4FF 100%)',
        // App-level gradients
        'app-bg':        'linear-gradient(160deg, #FAF7F2 0%, #F5F0E8 50%, #EEF3EE 100%)',
        'sage-soft':     'linear-gradient(135deg, rgba(123,158,132,0.12) 0%, rgba(168,197,160,0.06) 100%)',
        'amber-glow':    'linear-gradient(135deg, rgba(232,145,90,0.14) 0%, rgba(244,196,48,0.08) 100%)',
        'gold-warm':     'linear-gradient(135deg, rgba(244,196,48,0.18) 0%, rgba(232,145,90,0.10) 100%)',
        'sky-soft':      'linear-gradient(135deg, rgba(184,212,232,0.20) 0%, rgba(214,234,245,0.12) 100%)',
        'nature-deep':   'linear-gradient(135deg, rgba(74,124,89,0.10) 0%, rgba(123,158,132,0.06) 100%)',
        'relapse-soft':  'linear-gradient(160deg, #FFF8F0 0%, #F5ECEC 100%)',
        'stat-sage':     'linear-gradient(135deg, rgba(123,158,132,0.15) 0%, rgba(168,197,160,0.08) 100%)',
        'stat-amber':    'linear-gradient(135deg, rgba(232,145,90,0.15) 0%, rgba(245,196,168,0.08) 100%)',
        'stat-gold':     'linear-gradient(135deg, rgba(244,196,48,0.20) 0%, rgba(232,145,90,0.10) 100%)',
        'stat-blue':     'linear-gradient(135deg, rgba(184,212,232,0.25) 0%, rgba(214,234,245,0.12) 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        widest: '0.15em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Base glass shadows — layered depth
        glass:     '0 2px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.75)',
        'glass-md':'0 4px 28px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.70)',
        'glass-lg':'0 8px 40px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.65)',
        // Colored glow shadows
        'sage-glow':  '0 4px 20px rgba(123,158,132,0.30)',
        'amber-glow': '0 4px 20px rgba(232,145,90,0.28)',
        'gold-glow':  '0 4px 20px rgba(244,196,48,0.32)',
        'rose-glow':  '0 4px 20px rgba(224,123,84,0.28)',
        'sky-glow':   '0 4px 20px rgba(184,212,232,0.40)',
        // Rarity glows for bird cards
        'rarity-common':    '0 0 0 2px rgba(123,158,132,0.20)',
        'rarity-uncommon':  '0 0 0 2px rgba(99,132,199,0.25)',
        'rarity-rare':      '0 0 0 2px rgba(147,112,219,0.30)',
        'rarity-legendary': '0 0 0 2px rgba(244,196,48,0.40), 0 4px 16px rgba(244,196,48,0.20)',
        // Float shadows
        float:     '0 8px 28px rgba(0,0,0,0.09)',
        'float-sm':'0 4px 14px rgba(0,0,0,0.07)',
        // Card shadows
        card:      '0 1px 4px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.09)',
        'card-pressed': '0 1px 6px rgba(0,0,0,0.06)',
      },
      animation: {
        'float':          'float 4s ease-in-out infinite',
        'float-slow':     'float 6s ease-in-out infinite',
        'float-fast':     'float 2.5s ease-in-out infinite',
        'pulse-soft':     'pulse-soft 3s ease-in-out infinite',
        'bounce-gentle':  'bounce-gentle 2s ease-in-out infinite',
        'wing-flap':      'wing-flap 0.4s ease-in-out infinite alternate',
        'fade-in':        'fade-in 0.4s ease-out both',
        'fade-in-fast':   'fade-in 0.25s ease-out both',
        'slide-up':       'slide-up 0.4s ease-out both',
        'slide-up-fast':  'slide-up 0.25s ease-out both',
        'scale-in':       'scale-in 0.3s ease-out both',
        'shimmer':        'shimmer 2.5s linear infinite',
        'heartbeat':      'heartbeat 2.4s ease-in-out infinite',
        'drift':          'drift 9s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
        'pop-in':         'pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
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
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.10)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.06)' },
          '56%':      { transform: 'scale(1)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%':      { transform: 'translate(5px, -7px)' },
          '66%':      { transform: 'translate(-4px, -3px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      // Fine-grained opacity values for subtle UI depth
      opacity: {
        4:  '0.04',
        6:  '0.06',
        7:  '0.07',
        8:  '0.08',
        12: '0.12',
        18: '0.18',
        22: '0.22',
        35: '0.35',
        40: '0.40',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        72: '0.72',
        88: '0.88',
      },
    },
  },
  plugins: [],
}

export default config
