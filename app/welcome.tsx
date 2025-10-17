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
        {/* Galaxy-like circle patterns */}
        <View style={styles.patternContainer}>
          {/* Large galaxy circles */}
          <View style={styles.galaxyCircle1} />
          <View style={styles.galaxyCircle2} />
          <View style={styles.galaxyCircle3} />
          
          {/* Medium stars */}
          <View style={styles.star1} />
          <View style={styles.star2} />
          <View style={styles.star3} />
          <View style={styles.star4} />
          <View style={styles.star5} />
          
          {/* Small twinkling dots */}
          <View style={styles.twinkle1} />
          <View style={styles.twinkle2} />
          <View style={styles.twinkle3} />
          <View style={styles.twinkle4} />
          <View style={styles.twinkle5} />
          <View style={styles.twinkle6} />
          <View style={styles.twinkle7} />
          <View style={styles.twinkle8} />
        </View>
        
        {/* Simple curved bottom border */}
        <Svg
          width={width}
          height={60}
          style={styles.curve}
          viewBox={`0 0 ${width} 60`}
        >
          <Path
            d={`M0,60 Q${width * 0.5},20 ${width},60 L${width},60 Z`}
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
  // Large galaxy circles
  galaxyCircle1: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(202, 240, 248, 0.3)',
  },
  galaxyCircle2: {
    position: 'absolute',
    top: '50%',
    right: '20%',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(144, 224, 239, 0.4)',
  },
  galaxyCircle3: {
    position: 'absolute',
    top: '75%',
    left: '25%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 180, 216, 0.3)',
  },
  
  // Medium stars
  star1: {
    position: 'absolute',
    top: '25%',
    right: '35%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(202, 240, 248, 0.6)',
  },
  star2: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(144, 224, 239, 0.7)',
  },
  star3: {
    position: 'absolute',
    top: '65%',
    right: '45%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 180, 216, 0.5)',
  },
  star4: {
    position: 'absolute',
    top: '30%',
    left: '60%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(202, 240, 248, 0.8)',
  },
  star5: {
    position: 'absolute',
    top: '80%',
    right: '60%',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(144, 224, 239, 0.6)',
  },
  
  // Small twinkling dots
  twinkle1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(202, 240, 248, 0.9)',
  },
  twinkle2: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(144, 224, 239, 0.8)',
  },
  twinkle3: {
    position: 'absolute',
    top: '55%',
    right: '5%',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(0, 180, 216, 0.7)',
  },
  twinkle4: {
    position: 'absolute',
    top: '20%',
    left: '70%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(202, 240, 248, 0.9)',
  },
  twinkle5: {
    position: 'absolute',
    top: '45%',
    right: '70%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(144, 224, 239, 0.8)',
  },
  twinkle6: {
    position: 'absolute',
    top: '70%',
    left: '5%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 180, 216, 0.9)',
  },
  twinkle7: {
    position: 'absolute',
    top: '85%',
    right: '30%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(202, 240, 248, 0.7)',
  },
  twinkle8: {
    position: 'absolute',
    top: '60%',
    left: '80%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(144, 224, 239, 0.9)',
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
