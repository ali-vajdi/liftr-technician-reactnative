/**
 * Utility functions for signature handling
 */

/**
 * Converts SVG paths to base64 data URI
 * In React Native, this creates an SVG string and converts it to base64
 * The backend can then convert the SVG to an image if needed
 */
export const convertSignatureToBase64 = (
  paths: string[],
  width: number,
  height: number
): string => {
  if (paths.length === 0) {
    return '';
  }

  // Create SVG string
  const svgPaths = paths
    .map(
      (path) =>
        `<path d="${path}" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join('');

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${svgPaths}
</svg>`;

  // Convert to base64
  // For React Native, we'll encode the SVG string as base64
  try {
    // Try using btoa (available in some React Native environments)
    if (typeof btoa !== 'undefined') {
      const encoded = btoa(unescape(encodeURIComponent(svgString)));
      return `data:image/svg+xml;base64,${encoded}`;
    }
    
    // Fallback: Try Buffer (Node.js/Expo environment)
    if (typeof Buffer !== 'undefined') {
      const encoded = Buffer.from(svgString, 'utf8').toString('base64');
      return `data:image/svg+xml;base64,${encoded}`;
    }
    
    // If neither is available, return SVG string (backend can convert)
    console.warn('Base64 encoding not available, sending SVG string directly');
    return svgString;
  } catch (error) {
    // If all methods fail, return the SVG string directly (backend can handle it)
    console.error('Error converting signature to base64:', error);
    return svgString;
  }
};

/**
 * Note: For better image quality in React Native, consider using react-native-view-shot
 * This requires installing: npm install react-native-view-shot
 * 
 * Example usage with react-native-view-shot:
 * import { captureRef } from 'react-native-view-shot';
 * import * as FileSystem from 'expo-file-system';
 * 
 * const uri = await captureRef(signatureViewRef, { 
 *   format: 'png', 
 *   quality: 1.0 
 * });
 * const base64 = await FileSystem.readAsStringAsync(uri, { 
 *   encoding: FileSystem.EncodingType.Base64 
 * });
 * return `data:image/png;base64,${base64}`;
 */

