import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { toPersianDigits } from '../../utils/numberUtils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  onPress 
}) => {
  const CardContent = (
    <View className="bg-white rounded-3xl p-5 border border-gray-100" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2
    }}>
      <View className="flex-row-reverse justify-between items-start mb-3">
        <View 
          className="rounded-2xl w-14 h-14 items-center justify-center"
          style={{ backgroundColor: `${color}33` }}
        >
          <Text className="text-3xl">{icon}</Text>
        </View>
        <Text className="text-4xl font-yekan-bold text-gray-900" style={{ fontFamily: 'YekanBakhFaNum-Bold' }}>
          {toPersianDigits(value)}
        </Text>
      </View>
      <Text className="text-base font-yekan text-gray-600" style={{ textAlign: 'right', fontFamily: 'YekanBakhFaNum-Regular' }}>
        {title}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

