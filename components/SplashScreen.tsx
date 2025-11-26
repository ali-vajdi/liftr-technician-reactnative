import React from 'react';
import { View, Image, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
  visible: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView 
        edges={['top', 'bottom', 'left', 'right']}
        style={styles.safeArea}
      >
        <View style={styles.content}>
          {/* Logo in center */}
          <Image
            source={require('../assets/icon-splash.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* White circular loading indicator below logo */}
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === 'web' 
      ? { position: 'fixed' as const }
      : { position: 'absolute' as const }
    ),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#359cd7',
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 9999 : 0,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#359cd7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#359cd7',
  },
  logo: {
    width: Platform.OS === 'web' ? 200 : 160,
    height: Platform.OS === 'web' ? 200 : 160,
    marginBottom: 40,
  },
  loaderContainer: {
    marginTop: 20,
  },
});

