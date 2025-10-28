/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'federal-blue': '#03045E',
        'honolulu-blue': '#0077B6',
        'pacific-cyan': '#00B4D8',
        'non-photo-blue': '#90E0EF',
        'light-cyan': '#CAF0F8',
        'glass-white': 'rgba(255, 255, 255, 0.25)',
        'glass-blue': 'rgba(0, 119, 182, 0.2)',
        'glass-cyan': 'rgba(0, 180, 216, 0.15)',
      },
      fontFamily: {
        'yekan': ['Yekan', 'system-ui', 'sans-serif'],
        'yekan-bold': ['YekanBold', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
