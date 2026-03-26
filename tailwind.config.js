/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — deep corporate navy
        apex: {
          50:  '#EEF2F8',
          100: '#D8E2F0',
          200: '#B2C5E0',
          300: '#7FA3C9',
          400: '#4E80B0',
          500: '#2B5F96',
          600: '#1B4D80',
          700: '#143D68',
          800: '#0F2E50',
          900: '#0A1F3C',
          950: '#060F1E',
        },
        // Accent — warm corporate gold
        brand: {
          50:  '#FDF8EC',
          100: '#F8EDCA',
          200: '#F0D790',
          300: '#E6BE50',
          400: '#D4A030',
          500: '#B8881F',
          600: '#956C17',
          700: '#6E4F10',
        },
      },
    },
  },
  plugins: [],
}
