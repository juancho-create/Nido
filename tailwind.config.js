/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clinic: {
          950: '#070b12',
          900: '#0b1220',
          850: '#0f1729',
          800: '#131c31',
          700: '#1c2842',
          600: '#2a3a5c',
          accent: '#22d3ee',
          accent2: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
