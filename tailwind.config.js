/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sunrise: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },
        orange70s: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Painted Orange
          600: '#EA580C', // Deep Terracotta
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        paper: {
          warm: '#FDFBF7',
          cream: '#FAF5FF',
          border: '#E9D5FF',
        },
        arenaNight: {
          bg: '#0F081D',
          surface: '#1A0D30',
          card: '#241242',
          border: '#4C1D95'
        }
      },
      fontFamily: {
        capitol: ['Cinzel', 'Cinzel Decorative', 'serif', 'system-ui'],
        retro: ['"Share Tech Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.3), inset 0 0 10px rgba(249, 115, 22, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.5), inset 0 0 20px rgba(124, 58, 237, 0.4)' },
        },
        reapingSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.08)' },
          '100%': { transform: 'rotate(360deg) scale(1)' }
        },
        tributeRise: {
          '0%': { transform: 'translateY(40px) scale(0.85)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      animation: {
        'glow-pulse': 'pulseGlow 3s ease-in-out infinite',
        'reaping-spin': 'reapingSpin 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'tribute-rise': 'tributeRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }
    },
  },
  plugins: [],
}
