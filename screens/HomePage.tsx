import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const HomePage: React.FC = () => {
  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center">
        <View className="bg-white rounded-3xl w-full p-6 mb-4" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6 self-center">
            <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
          </View>
          <Text className="text-gray-700 text-xl font-yekan-bold text-center mb-2">
            صفحه اصلی
          </Text>
          <Text className="text-gray-400 text-base font-yekan text-center">
            خوش آمدید به داشبورد لیفتر
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

