import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  organizationName?: string;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ organizationName, onBackPress, showBack = false }) => {
  return (
    <View 
      className="bg-white border-b border-gray-100"
      style={{ 
        flexDirection: 'row-reverse', 
        alignItems: 'center', 
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 64,
      }}
    >
      {/* Right side: Logo */}
      <View style={{ 
        width: 40, 
        height: 40, 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </View>
      
      {/* Left side: Organization name */}
      <View style={{ 
        flex: 1, 
        marginHorizontal: 16,
        minWidth: 0,
      }}>
        <Text 
          className="text-honolulu-blue text-xl font-yekan-bold" 
          style={{ 
            textAlign: 'right',
            fontSize: 18,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {organizationName || 'لیفتر'}
        </Text>
      </View>
      
      {/* Back button - shown when needed, positioned on the left */}
      <View style={{ 
        width: 40, 
        height: 40,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {showBack && onBackPress ? (
          <TouchableOpacity 
            onPress={onBackPress}
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

