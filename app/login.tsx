import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const validateIranianPhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it starts with 09 and has 11 digits total
    if (cleanPhone.length === 11 && cleanPhone.startsWith('09')) {
      return true;
    }
    
    // Check if it starts with +98 and has 13 digits total
    if (cleanPhone.length === 13 && cleanPhone.startsWith('989')) {
      return true;
    }
    
    return false;
  };

  const formatPhoneNumber = (text: string): string => {
    // Remove any non-digit characters
    const cleanText = text.replace(/\D/g, '');
    
    // If it starts with +98, keep it as is
    if (text.startsWith('+98')) {
      return text;
    }
    
    // If it starts with 09, format it
    if (cleanText.startsWith('09')) {
      return cleanText;
    }
    
    // If it starts with 9, add 0
    if (cleanText.startsWith('9') && cleanText.length <= 10) {
      return '0' + cleanText;
    }
    
    return cleanText;
  };

  const handlePhoneNumberChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    const formatted = formatPhoneNumber(numericText);
    setPhoneNumber(formatted);
  };

  const handleLogin = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('خطا', 'لطفاً شماره تلفن خود را وارد کنید');
      return;
    }

    if (!validateIranianPhoneNumber(phoneNumber)) {
      Alert.alert('خطا', 'لطفاً شماره تلفن معتبر ایرانی وارد کنید');
      return;
    }

    // Navigate to verification screen
    router.push({
      pathname: '/verify',
      params: { phoneNumber: phoneNumber }
    });
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
          
          {/* Medium stars */}
          <View style={styles.star1} />
          <View style={styles.star2} />
          <View style={styles.star3} />
          
          {/* Small twinkling dots */}
          <View style={styles.twinkle1} />
          <View style={styles.twinkle2} />
          <View style={styles.twinkle3} />
          <View style={styles.twinkle4} />
          <View style={styles.twinkle5} />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>ورود</Text>
          <Text style={styles.subtitle}>شماره تلفن همراه خود را وارد کنید</Text>
        </View>
        
        {/* Simple curved bottom border */}
        <Svg
          width={width}
          height={50}
          style={styles.curve}
          viewBox={`0 0 ${width} 50`}
        >
          <Path
            d={`M0,50 Q${width * 0.5},15 ${width},50 L${width},50 Z`}
            fill="#ffffff"
          />
        </Svg>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>شماره تلفن همراه</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="09123456789"
                keyboardType="numeric"
                textAlign="right"
                maxLength={13}
                autoFocus
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ورود</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              با ورود، شما شرایط و قوانین استفاده را می‌پذیرید
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: height * 0.4,
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
    top: '15%',
    left: '20%',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(202, 240, 248, 0.3)',
  },
  galaxyCircle2: {
    position: 'absolute',
    top: '65%',
    right: '25%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(144, 224, 239, 0.4)',
  },
  
  // Medium stars
  star1: {
    position: 'absolute',
    top: '35%',
    right: '40%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(202, 240, 248, 0.6)',
  },
  star2: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(144, 224, 239, 0.7)',
  },
  star3: {
    position: 'absolute',
    top: '80%',
    right: '50%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 180, 216, 0.5)',
  },
  
  // Small twinkling dots
  twinkle1: {
    position: 'absolute',
    top: '25%',
    right: '15%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(202, 240, 248, 0.9)',
  },
  twinkle2: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(144, 224, 239, 0.8)',
  },
  twinkle3: {
    position: 'absolute',
    top: '70%',
    right: '10%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 180, 216, 0.7)',
  },
  twinkle4: {
    position: 'absolute',
    top: '30%',
    left: '60%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(202, 240, 248, 0.9)',
  },
  twinkle5: {
    position: 'absolute',
    top: '85%',
    right: '60%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(144, 224, 239, 0.8)',
  },
  headerContent: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -40 }],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    backgroundColor: '#ffffff',
    textAlign: 'right',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#0077B6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#0077B6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
