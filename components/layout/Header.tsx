import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuPress }) => {
  return (
    <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-gray-100">
      <TouchableOpacity 
        onPress={onMenuPress}
        className="w-10 h-10 bg-honolulu-blue rounded-xl items-center justify-center"
        activeOpacity={0.7}
      >
        <View style={{ gap: 4 }}>
          <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
          <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
          <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
        </View>
      </TouchableOpacity>
      
      <View className="items-center flex-1">
        <Text className="text-honolulu-blue text-xl font-yekan-bold">
          {title}
        </Text>
      </View>
      
      <View className="w-10"></View>
    </View>
  );
};

