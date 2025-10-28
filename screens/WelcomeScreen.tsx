import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 justify-center items-center px-4 sm:px-8">
        {/* Vector Image */}
        <View className="items-center mb-12 sm:mb-16">
          <Image
            source={require('../assets/images/elevator-installation-isolated-concept-vector.png')}
            className="w-64 h-64 sm:w-80 sm:h-80 mb-8"
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View className="items-center mb-12 sm:mb-16">
          <Text className="text-honolulu-blue text-2xl sm:text-3xl font-yekan-bold text-center mb-3">
            لیفتر
          </Text>
          <Text className="text-gray-600 text-base sm:text-lg font-yekan text-center">
            پلتفرم مدیریت خدمات فنی
          </Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={onGetStarted}
          className="w-full max-w-md bg-honolulu-blue rounded-2xl py-4 sm:py-5 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg sm:text-xl font-yekan-bold">
            شروع کنید
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
