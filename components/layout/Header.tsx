import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { toPersianDigits } from '../../utils/numberUtils';

interface HeaderProps {
  organizationName?: string;
  onBackPress?: () => void;
  showBack?: boolean;
  onMessagesPress?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  organizationName, 
  onBackPress, 
  showBack = false,
  onMessagesPress,
  unreadCount = 0,
}) => {
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
      
      {/* Middle: Organization name */}
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
            fontFamily: 'YekanBakhFaNum-Regular',
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {organizationName || 'لیفتر'}
        </Text>
      </View>
      
      {/* Left side: Messages icon and Back button */}
      <View style={{ 
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        {/* Messages icon - shown when not on detail page */}
        {!showBack && onMessagesPress && (
          <TouchableOpacity 
            onPress={onMessagesPress}
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={20} color="#4B5563" />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -2,
                left: -2,
                backgroundColor: '#EF4444',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'white',
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 11,
                  fontFamily: 'YekanBakhFaNum-Bold',
                }}>
                  {unreadCount > 99 ? '۹۹+' : toPersianDigits(unreadCount)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        
        {/* Back button - shown when needed */}
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

