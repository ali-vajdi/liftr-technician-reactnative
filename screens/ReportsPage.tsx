import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ReportsPage: React.FC = () => {
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
          <View className="bg-blue-50 rounded-3xl w-24 h-24 items-center justify-center mb-6 self-center">
            <Ionicons name="document-text" size={48} color="#0077B6" />
          </View>
          <Text className="text-gray-700 text-xl font-yekan-bold text-center mb-2">
            گزارش‌ها
          </Text>
          <Text className="text-gray-400 text-base font-yekan text-center">
            در این بخش می‌توانید گزارش‌های خود را مشاهده کنید
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

