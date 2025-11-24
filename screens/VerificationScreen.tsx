import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface VerificationScreenProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  phoneNumber, 
  onVerify, 
  onBack, 
  onResend 
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (verificationCode: string) => {
    if (verificationCode.length !== 6) {
      Alert.alert('خطا', 'لطفاً کد ۶ رقمی را کامل وارد کنید');
      return;
    }

    // Here you would typically validate the code with your backend
    // For now, we'll accept any 6-digit code
    onVerify(verificationCode);
  };

  const handleResend = () => {
    if (timeLeft > 0) {
      Alert.alert('خطا', `لطفاً ${formatTime(timeLeft)} صبر کنید`);
      return;
    }
    
    setTimeLeft(120);
    setCode(['', '', '', '', '', '']);
    onResend();
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
            تأیید شماره تلفن
          </Text>
          <View className="w-9"></View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-4 sm:px-6">
          {/* Code Input Section */}
          <View className="flex-1 justify-center max-w-md mx-auto w-full">
            <View className="mb-8">
              <Text className="text-gray-600 text-base font-yekan text-center mb-2">
                کد تأیید به شماره زیر ارسال شد:
              </Text>
              <Text className="text-honolulu-blue text-lg font-yekan-bold text-center">
                {phoneNumber}
              </Text>
            </View>

            {/* Code Input Form */}
            <View>
              <Text className="text-gray-700 text-sm font-yekan mb-4 text-center">
                کد تأیید ۶ رقمی
              </Text>
              
              <View className="flex-row justify-center mb-6 flex-wrap">
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(value) => {
                      const cleanedValue = value.replace(/[^0-9]/g, '');
                      handleCodeChange(cleanedValue, index);
                    }}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="w-12 h-14 mx-1 text-center text-xl font-yekan-bold rounded-2xl bg-gray-50 text-gray-900"
                    style={{ 
                      borderWidth: 2,
                      borderColor: digit ? '#0077B6' : '#F3F4F6'
                    }}
                  />
                ))}
              </View>

              {/* Timer */}
              <View className="items-center mb-8">
                {timeLeft > 0 ? (
                  <Text className="text-gray-500 text-sm font-yekan">
                    ارسال مجدد کد در {formatTime(timeLeft)}
                  </Text>
                ) : (
                  <TouchableOpacity 
                    onPress={handleResend}
                    className="px-6 py-2 bg-gray-50 rounded-full"
                  >
                    <Text className="text-honolulu-blue text-sm font-yekan-bold">
                      ارسال مجدد کد
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleVerify(code.join(''))}
                disabled={!code.every(digit => digit !== '')}
                activeOpacity={0.8}
                style={{
                  shadowColor: code.every(digit => digit !== '') ? '#0077B6' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: code.every(digit => digit !== '') ? 4 : 0
                }}
              >
                <View className={`w-full rounded-2xl py-4 items-center ${
                  code.every(digit => digit !== '') 
                    ? 'bg-honolulu-blue' 
                    : 'bg-gray-200'
                }`}>
                  <Text className={`text-base font-yekan-bold ${
                    code.every(digit => digit !== '') ? 'text-white' : 'text-gray-400'
                  }`}>
                    تأیید و ورود
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-gray-500 text-xs sm:text-sm font-yekan text-center px-4">
                کد تأیید را دریافت نکردید؟ شماره تلفن را بررسی کنید
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
