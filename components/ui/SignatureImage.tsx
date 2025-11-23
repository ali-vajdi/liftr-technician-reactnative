import React, { useMemo } from 'react';
import { View, Image, Platform, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SignatureImageProps {
  signature: string;
  style?: ViewStyle | ImageStyle;
  width?: number | string;
  height?: number;
}

/**
 * Component to display signature images
 * Handles both SVG data URIs (using react-native-svg) and PNG/JPEG data URIs (using Image)
 * Android's Image component doesn't support SVG data URIs, so we need to parse and render SVG manually
 */
export const SignatureImage: React.FC<SignatureImageProps> = ({
  signature,
  style,
  width = '100%',
  height = 200,
}) => {
  const isSvgDataUri = useMemo(() => {
    return signature.startsWith('data:image/svg+xml') || signature.startsWith('<?xml');
  }, [signature]);

  const svgContent = useMemo(() => {
    if (!isSvgDataUri) return null;

    try {
      let svgString = signature;

      // If it's a data URI, extract the base64 content
      if (signature.startsWith('data:image/svg+xml;base64,')) {
        const base64Data = signature.replace('data:image/svg+xml;base64,', '');
        // Decode base64 - try Buffer first (available in Expo/React Native)
        if (typeof Buffer !== 'undefined') {
          svgString = Buffer.from(base64Data, 'base64').toString('utf8');
        } else if (typeof atob !== 'undefined') {
          // Fallback to atob if available
          svgString = atob(base64Data);
        } else {
          // Last resort: try to decode manually (simple base64 decode)
          try {
            // Use a polyfill approach
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let result = '';
            let i = 0;
            const cleanBase64 = base64Data.replace(/[^A-Za-z0-9\+\/]/g, '');
            while (i < cleanBase64.length) {
              const encoded1 = chars.indexOf(cleanBase64.charAt(i++));
              const encoded2 = chars.indexOf(cleanBase64.charAt(i++));
              const encoded3 = chars.indexOf(cleanBase64.charAt(i++));
              const encoded4 = chars.indexOf(cleanBase64.charAt(i++));
              const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
              result += String.fromCharCode((bitmap >> 16) & 255);
              if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
              if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
            }
            svgString = result;
          } catch (e) {
            console.error('Failed to decode base64:', e);
            return null;
          }
        }
      } else if (signature.startsWith('data:image/svg+xml,')) {
        // URL encoded SVG
        const encodedSvg = signature.replace('data:image/svg+xml,', '');
        svgString = decodeURIComponent(encodedSvg);
      }

      // Parse SVG to extract paths
      const pathMatches = svgString.match(/<path[^>]*d="([^"]*)"[^>]*>/g);
      if (!pathMatches || pathMatches.length === 0) {
        return null;
      }

      const paths: Array<{ d: string; stroke?: string; strokeWidth?: string }> = [];
      
      pathMatches.forEach((match) => {
        const dMatch = match.match(/d="([^"]*)"/);
        const strokeMatch = match.match(/stroke="([^"]*)"/);
        const strokeWidthMatch = match.match(/stroke-width="([^"]*)"/);
        
        if (dMatch) {
          paths.push({
            d: dMatch[1],
            stroke: strokeMatch ? strokeMatch[1] : '#1F2937',
            strokeWidth: strokeWidthMatch ? strokeWidthMatch[1] : '2.5',
          });
        }
      });

      // Extract SVG dimensions
      const widthMatch = svgString.match(/width="([^"]*)"/);
      const heightMatch = svgString.match(/height="([^"]*)"/);
      const svgWidth = widthMatch ? parseFloat(widthMatch[1]) : 400;
      const svgHeight = heightMatch ? parseFloat(heightMatch[1]) : 250;

      return { paths, width: svgWidth, height: svgHeight };
    } catch (error) {
      console.error('Error parsing SVG signature:', error);
      return null;
    }
  }, [signature, isSvgDataUri]);

  // If it's not SVG or we couldn't parse it, try using Image component
  if (!isSvgDataUri || !svgContent) {
    return (
      <Image
        source={{ uri: signature }}
        style={[styles.image, { width, height }, style]}
        resizeMode="contain"
      />
    );
  }

  // Render SVG using react-native-svg
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg
        width={typeof width === 'number' ? width : '100%'}
        height={height}
        viewBox={`0 0 ${svgContent.width} ${svgContent.height}`}
        style={styles.svg}
      >
        {svgContent.paths.map((pathData, index) => (
          <Path
            key={index}
            d={pathData.d}
            stroke={pathData.stroke || '#1F2937'}
            strokeWidth={parseFloat(pathData.strokeWidth || '2.5')}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    flex: 1,
  },
  image: {
    backgroundColor: 'white',
  },
});

