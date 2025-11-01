import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface ActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  title, 
  icon, 
  onPress,
  variant = 'primary'
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-2xl p-5 items-center justify-center min-h-[100px] ${
        isPrimary ? 'bg-honolulu-blue' : 'bg-white border-2 border-gray-200'
      }`}
      style={{
        shadowColor: isPrimary ? '#0077B6' : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isPrimary ? 0.2 : 0,
        shadowRadius: 8,
        elevation: isPrimary ? 4 : 0
      }}
    >
      <View className={`rounded-full w-13 h-13 items-center justify-center mb-3 ${
        isPrimary ? 'bg-white/20' : 'bg-gray-100'
      }`}>
        <Text className="text-3xl">{icon}</Text>
      </View>
      <Text className={`text-base font-yekan-bold text-center ${
        isPrimary ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

