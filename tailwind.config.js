/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Remap brand tokens
      colors: {
        background: '#050508',
        foreground: '#EDF2F7',

        // Remap every gray shade used in components to dark equivalents.
        // This means bg-white, bg-gray-*, text-gray-* all become dark
        // without touching any component files.
        white: '#141A1F',          // bg-white → dark card surface
        gray: {
          50:  '#0F1318',          // bg-gray-50 → slightly lighter dark
          100: '#141A1F',          // bg-gray-100 → dark card
          200: 'rgba(255,255,255,0.07)', // divide-gray-200, border-gray-200
          300: '#4A5568',          // text-gray-300 → muted
          400: '#6B7280',          // text-gray-400 → dim
          500: '#A0AEC0',          // text-gray-500 → readable dim
          600: '#A0AEC0',          // text-gray-600
          700: '#CBD5E0',          // text-gray-700 → bright dim
          800: '#1A2030',          // bg-gray-800 (tooltip bg) stays dark
          900: '#EDF2F7',          // text-gray-900 → primary text
        },

        // Brand accent colours
        blue: {
          50:  'rgba(91,184,232,0.12)',
          100: 'rgba(91,184,232,0.18)',
          500: '#5BB8E8',
          600: '#5BB8E8',
          700: '#3A90C4',
        },
        red: {
          50:  'rgba(239,68,68,0.10)',
          500: '#FC8181',
          700: '#FC8181',
        },
        green: {
          500: '#68D391',
          600: '#48BB78',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
