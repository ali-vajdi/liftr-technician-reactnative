import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toPersianDigits, toEnglishDigits } from '../utils/numberUtils';

interface LoginScreenProps {
  onLogin: (phoneNumber: string) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  // Store display value in Persian digits to prevent flicker
  const [phoneNumberDisplay, setPhoneNumberDisplay] = useState('');

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters (works with both English and Persian)
    const cleaned = text.replace(/[^0-9۰-۹]/g, '');
    
    // Convert to English for processing
    const englishText = toEnglishDigits(cleaned);
    
    // Format as Iranian phone number (09xxxxxxxxx)
    if (englishText.length <= 11) {
      if (englishText.startsWith('09')) {
        return englishText;
      } else if (englishText.startsWith('9')) {
        return '0' + englishText;
      } else if (englishText.length > 0) {
        return '09' + englishText;
      }
    }
    return englishText.slice(0, 11);
  };

  const handlePhoneChange = (text: string) => {
    // Immediately convert any input (English or Persian) to Persian for display
    const englishText = toEnglishDigits(text);
    const formatted = formatPhoneNumber(englishText);
    // Store Persian version for display to prevent flicker
    setPhoneNumberDisplay(toPersianDigits(formatted));
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = () => {
    // Convert display value to English for validation and API call
    const englishPhone = toEnglishDigits(phoneNumberDisplay);
    
    if (!englishPhone) {
      Alert.alert('خطا', 'لطفاً شماره تلفن خود را وارد کنید');
      return;
    }

    if (!validatePhoneNumber(englishPhone)) {
      Alert.alert('خطا', 'لطفاً شماره تلفن معتبر وارد کنید');
      return;
    }

    onLogin(englishPhone);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View className="bg-white px-5 py-3" style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
      }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={onBack}
            className="w-9 h-9 bg-gray-50 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-gray-800 text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 text-base font-yekan-bold">
            ورود به سیستم
          </Text>
          <View className="w-9"></View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-4 sm:px-6">
          {/* Phone Input Section */}
          <View className="flex-1 justify-center max-w-md mx-auto w-full">
            <Text className="text-gray-600 text-base font-yekan text-center mb-8">
              شماره تلفن همراه خود را وارد کنید
            </Text>

            {/* Phone Input Form */}
            <View>
              <View className="mb-6">
                <Text className="text-gray-700 text-sm font-yekan mb-2 px-1">
                  شماره تلفن همراه
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                  <Text className="text-gray-500 text-base font-yekan ml-3">+98</Text>
                  <TextInput
                    value={phoneNumberDisplay}
                    onChangeText={handlePhoneChange}
                    placeholder="۹۱۲ ۳۴۵ ۶۷۸۹"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    maxLength={11}
                    className="flex-1 text-gray-900 text-base font-yekan"
                    style={{ textAlign: 'right', fontFamily: 'Vazirmatn-Regular' }}
                  />
                </View>
              </View>

              <Text className="text-gray-500 text-sm font-yekan text-center mb-6 px-4">
                کد تأیید به این شماره ارسال خواهد شد
              </Text>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={phoneNumberDisplay.length !== 11}
                activeOpacity={0.8}
                style={{
                  shadowColor: phoneNumberDisplay.length === 11 ? '#0077B6' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: phoneNumberDisplay.length === 11 ? 4 : 0
                }}
              >
                <View className={`w-full rounded-2xl py-4 items-center ${
                  phoneNumberDisplay.length === 11 
                    ? 'bg-honolulu-blue' 
                    : 'bg-gray-200'
                }`}>
                  <Text className={`text-base font-yekan-bold ${
                    phoneNumberDisplay.length === 11 ? 'text-white' : 'text-gray-400'
                  }`}>
                    ادامه
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-gray-500 text-xs sm:text-sm font-yekan text-center px-4">
                با ورود به سیستم، شرایط و قوانین را می‌پذیرید
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
