import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBackPress, showBack = false }) => {
  return (
    <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-gray-100">
      {showBack && onBackPress ? (
        <TouchableOpacity 
          onPress={onBackPress}
          className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-forward" size={20} color="#4B5563" />
        </TouchableOpacity>
      ) : (
        <View className="w-10"></View>
      )}
      
      <View className="items-center flex-1">
        <Text className="text-honolulu-blue text-xl font-yekan-bold">
          {title}
        </Text>
      </View>
      
      <View className="w-10"></View>
    </View>
  );
};

