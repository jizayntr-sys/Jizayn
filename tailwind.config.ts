import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',      // Ahşap kahverengi
        secondary: '#D2691E',     // Açık kahverengi
        accent: '#CD853F',        // Peru (vurgu rengi)
        background: '#F9FAFB',    // Açık gri
        textPrimary: '#111827',   // Koyu gri
        wood: {
          50: '#F5E6D3',
          100: '#E8D4B8',
          200: '#D4B896',
          300: '#C19A6B',
          400: '#A67C52',
          500: '#8B4513',
          600: '#6B3410',
          700: '#4A240B',
          800: '#2A1506',
          900: '#1A0D04',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
