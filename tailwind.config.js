const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],
  darkMode: 'class',
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
        'yekan': platformSelect({
          ios: 'Vazirmatn-Regular',
          android: 'Vazirmatn-Regular',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-bold': platformSelect({
          ios: 'Vazirmatn-Bold',
          android: 'Vazirmatn-Bold',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-thin': platformSelect({
          ios: 'Vazirmatn-Thin',
          android: 'Vazirmatn-Thin',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-light': platformSelect({
          ios: 'Vazirmatn-Light',
          android: 'Vazirmatn-Light',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-semibold': platformSelect({
          ios: 'Vazirmatn-SemiBold',
          android: 'Vazirmatn-SemiBold',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-extrabold': platformSelect({
          ios: 'Vazirmatn-ExtraBold',
          android: 'Vazirmatn-ExtraBold',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-black': platformSelect({
          ios: 'Vazirmatn-Black',
          android: 'Vazirmatn-Black',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
        'yekan-extablack': platformSelect({
          ios: 'Vazirmatn-Black',
          android: 'Vazirmatn-Black',
          default: 'Vazirmatn, system-ui, sans-serif',
        }),
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
