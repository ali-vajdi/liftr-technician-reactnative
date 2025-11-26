import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toPersianDigits, toEnglishDigits } from '../utils/numberUtils';

interface PasswordScreenProps {
  phoneNumber: string;
  onPasswordLogin: (password: string) => void;
  onBack: () => void;
  onSwitchToOTP: () => void;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ 
  phoneNumber, 
  onPasswordLogin, 
  onBack, 
  onSwitchToOTP 
}) => {
  // Store display value in Persian digits to prevent flicker (only when visible)
  const [passwordDisplay, setPasswordDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (text: string) => {
    // Convert to English for storage, but store Persian for display when visible
    const englishPassword = toEnglishDigits(text);
    setPasswordDisplay(showPassword ? toPersianDigits(englishPassword) : englishPassword);
  };

  const handlePasswordLogin = () => {
    // Convert display value to English for authentication
    const englishPassword = toEnglishDigits(passwordDisplay);
    if (englishPassword.length < 4) {
      // Basic validation
      return;
    }
    onPasswordLogin(englishPassword);
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
            ورود با رمز عبور
          </Text>
          <View className="w-9"></View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-4 sm:px-6">
          {/* Password Input Section */}
          <View className="flex-1 justify-center max-w-md mx-auto w-full">
            <View className="mb-8">
              <Text className="text-gray-600 text-base font-yekan text-center mb-2">
                رمز عبور خود را وارد کنید
              </Text>
              <Text className="text-honolulu-blue text-lg font-yekan-bold text-center" style={{ fontFamily: 'Vazirmatn-Bold' }}>
                {toPersianDigits(phoneNumber)}
              </Text>
            </View>

            {/* Password Input Form */}
            <View>
              <View className="mb-6">
                <Text className="text-gray-700 text-sm font-yekan mb-2 px-1">
                  رمز عبور
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                  <TextInput
                    value={passwordDisplay}
                    onChangeText={handlePasswordChange}
                    placeholder="رمز عبور خود را وارد کنید"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    className="flex-1 text-gray-900 text-base font-yekan"
                    style={{ textAlign: 'right', fontFamily: 'Vazirmatn-Regular' }}
                  />
                  <TouchableOpacity 
                    onPress={() => {
                      const newShowPassword = !showPassword;
                      setShowPassword(newShowPassword);
                      // Update display value when toggling visibility
                      const englishPassword = toEnglishDigits(passwordDisplay);
                      setPasswordDisplay(newShowPassword ? toPersianDigits(englishPassword) : englishPassword);
                    }}
                    className="ml-3"
                  >
                    <Text className="text-gray-500 text-lg">
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handlePasswordLogin}
                disabled={toEnglishDigits(passwordDisplay).length < 4}
                activeOpacity={0.8}
                style={{
                  shadowColor: toEnglishDigits(passwordDisplay).length >= 4 ? '#0077B6' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: toEnglishDigits(passwordDisplay).length >= 4 ? 4 : 0
                }}
              >
                <View className={`w-full rounded-2xl py-4 items-center ${
                  toEnglishDigits(passwordDisplay).length >= 4 
                    ? 'bg-honolulu-blue' 
                    : 'bg-gray-200'
                }`}>
                  <Text className={`text-base font-yekan-bold ${
                    toEnglishDigits(passwordDisplay).length >= 4 ? 'text-white' : 'text-gray-400'
                  }`}>
                    ورود
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* OTP Option */}
            <View className="mt-6">
              <TouchableOpacity 
                onPress={onSwitchToOTP}
                activeOpacity={0.7}
                style={{
                  borderWidth: 2,
                  borderColor: '#0077B6',
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  overflow: 'hidden'
                }}
              >
                <Text className="text-honolulu-blue text-base font-yekan-bold">
                  ورود با رمز یکبار مصرف
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-6">
              <Text className="text-gray-500 text-xs sm:text-sm font-yekan text-center px-4">
                رمز عبور خود را فراموش کرده‌اید؟ از رمز یکبار مصرف استفاده کنید
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
