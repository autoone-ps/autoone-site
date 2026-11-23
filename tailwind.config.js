/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        electric: '#0B5FFF',
        navy: '#031B46',
        midnight: '#020912',
        ice: '#F4F7FF',
        mist: '#DCE8FF',
      },
      fontFamily: {
        sans: ['Outfit', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(11,95,255,.55)',
      },
    },
  },
  plugins: [],
}
