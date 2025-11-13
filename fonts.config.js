// Font configuration for React Native
// Note: For native platforms, TTF versions are required
// For web, woff2 files from assets/fonts/yekan-bakh/woff2/ are used via @font-face in global.css
export const fonts = {
  // Yekan Bakh font weights - TTF versions needed for native
  // These should be converted from woff2 or obtained separately
  'YekanBakhFaNum-Thin': require('./assets/fonts/Yekan.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-Light': require('./assets/fonts/Yekan.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-Regular': require('./assets/fonts/Yekan.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-SemiBold': require('./assets/fonts/YekanBold.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-Bold': require('./assets/fonts/YekanBold.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-ExtraBold': require('./assets/fonts/YekanBold.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-Black': require('./assets/fonts/YekanBold.ttf'), // Fallback until TTF available
  'YekanBakhFaNum-ExtraBlack': require('./assets/fonts/YekanBold.ttf'), // Fallback until TTF available
};

// Font family names for use in styles
export const fontFamilies = {
  yekan: 'YekanBakhFaNum',
  yekanBold: 'YekanBakhFaNum',
};
