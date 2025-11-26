import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface SignaturePadProps {
  onSignatureChange?: (hasSignature: boolean) => void;
  disabled?: boolean;
  height?: number;
}

export interface SignaturePadRef {
  clearSignature: () => void;
  clearLastPath: () => void;
  hasSignature: () => boolean;
  getSignatureData: () => { paths: string[]; width: number; height: number } | null;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({ 
  onSignatureChange, 
  disabled = false,
  height = 250 
}, ref) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const disabledRef = useRef(disabled);
  const containerRef = useRef<View>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);

  // Update ref when disabled prop changes
  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  // Update height when prop changes
  useEffect(() => {
    setContainerHeight(height);
  }, [height]);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (evt) => {
        if (disabledRef.current) return false;
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `M${locationX},${locationY}`;
        setCurrentPath(newPath);
      },
      onPanResponderMove: (evt) => {
        if (disabledRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => {
          if (!prev) {
            return `M${locationX},${locationY}`;
          }
          return `${prev} L${locationX},${locationY}`;
        });
      },
      onPanResponderRelease: () => {
        if (disabledRef.current) return;
        setCurrentPath((prevPath) => {
          if (prevPath) {
            setPaths((prev) => {
              const newPaths = [...prev, prevPath];
              if (onSignatureChange) {
                onSignatureChange(newPaths.length > 0);
              }
              return newPaths;
            });
          }
          return '';
        });
      },
      onPanResponderTerminate: () => {
        if (disabledRef.current) return;
        setCurrentPath((prevPath) => {
          if (prevPath) {
            setPaths((prev) => {
              const newPaths = [...prev, prevPath];
              if (onSignatureChange) {
                onSignatureChange(newPaths.length > 0);
              }
              return newPaths;
            });
          }
          return '';
        });
      },
    })
  ).current;

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    if (onSignatureChange) {
      onSignatureChange(false);
    }
  };

  const clearLastPath = () => {
    setPaths((prev) => {
      const newPaths = prev.slice(0, -1);
      if (onSignatureChange) {
        onSignatureChange(newPaths.length > 0);
      }
      return newPaths;
    });
    setCurrentPath('');
  };

  const hasSignature = () => paths.length > 0;

  const getSignatureData = () => {
    if (paths.length === 0) return null;
    return {
      paths: [...paths],
      width: containerWidth,
      height: containerHeight,
    };
  };

  useImperativeHandle(ref, () => ({
    clearSignature,
    clearLastPath,
    hasSignature,
    getSignatureData,
  }));

  return (
    <View style={styles.container} ref={containerRef}>
      <View
        style={[styles.signatureContainer, { height: containerHeight }]}
        {...panResponder.panHandlers}
        pointerEvents={disabled ? 'none' : 'auto'}
        onLayout={handleLayout}
      >
        {containerWidth > 0 && containerHeight > 0 && (
          <Svg width={containerWidth} height={containerHeight} style={styles.svgContainer}>
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path}
                stroke="#1F2937"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke="#1F2937"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        )}
        {paths.length === 0 && !currentPath && !disabled && (
          <View style={styles.placeholder} pointerEvents="none">
            <Text style={styles.placeholderText}>اینجا امضا کنید</Text>
          </View>
        )}
        {disabled && paths.length > 0 && (
          <View style={styles.disabledOverlay} pointerEvents="none">
            <Text style={styles.disabledText}>امضا ثبت شده</Text>
          </View>
        )}
      </View>
    </View>
  );
});

SignaturePad.displayName = 'SignaturePad';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  signatureContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    pointerEvents: 'none',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Vazirmatn-Regular',
    color: '#9CA3AF',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  disabledText: {
    fontSize: 14,
    fontFamily: 'Vazirmatn-Bold',
    color: '#10B981',
  },
});

