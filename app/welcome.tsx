import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with curved design */}
      <View style={styles.header}>
        {/* Decorative lines pattern */}
        <View style={styles.patternContainer}>
          <View style={styles.patternLine1} />
          <View style={styles.patternLine2} />
          <View style={styles.patternLine3} />
          <View style={styles.patternLine4} />
        </View>
        
        {/* Curved bottom border */}
        <Svg
          width={width}
          height={140}
          style={styles.curve}
          viewBox={`0 0 ${width} 140`}
        >
          <Path
            d={`M0,140 Q${width * 0.25},100 ${width * 0.5},110 Q${width * 0.75},90 ${width},100 L${width},140 Z`}
            fill="#ffffff"
          />
        </Svg>
      </View>

      {/* Content area */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>خوش آمدید</Text>
          <Text style={styles.subtitle}>
            به اپلیکیشن تکنسین لیفتر خوش آمدید
          </Text>
          <Text style={styles.description}>
            برای شروع، لطفاً وارد حساب کاربری خود شوید
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>ادامه</Text>
            <View style={styles.arrowButton}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: height * 0.65,
    backgroundColor: '#0077B6',
    position: 'relative',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternLine1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '60%',
    height: 3,
    backgroundColor: 'rgba(202, 240, 248, 0.4)',
    borderRadius: 2,
    transform: [{ rotate: '-15deg' }],
  },
  patternLine2: {
    position: 'absolute',
    top: '35%',
    right: '15%',
    width: '50%',
    height: 3,
    backgroundColor: 'rgba(144, 224, 239, 0.5)',
    borderRadius: 2,
    transform: [{ rotate: '20deg' }],
  },
  patternLine3: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    width: '40%',
    height: 3,
    backgroundColor: 'rgba(0, 180, 216, 0.3)',
    borderRadius: 2,
    transform: [{ rotate: '-10deg' }],
  },
  patternLine4: {
    position: 'absolute',
    top: '65%',
    right: '25%',
    width: '45%',
    height: 3,
    backgroundColor: 'rgba(202, 240, 248, 0.4)',
    borderRadius: 2,
    transform: [{ rotate: '15deg' }],
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 26,
  },
  description: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'right',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  continueText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0077B6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
