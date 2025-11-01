import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Technician } from '../types';

interface SettingsPageProps {
  technician: Technician | null;
  phoneNumber: string;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  technician,
  phoneNumber,
  onLogout,
}) => {
  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* User Info Section */}
      <View className="bg-white rounded-3xl w-full p-6 mb-4" style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <Text className="text-gray-700 text-lg font-yekan-bold mb-4" style={{ textAlign: 'right' }}>
          اطلاعات کاربری
        </Text>

        {/* Status Badge */}
        <View style={{ 
          backgroundColor: technician?.has_credentials ? '#ECFDF5' : '#F3F4F6',
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginBottom: 16,
          borderRightWidth: 3,
          borderRightColor: technician?.has_credentials ? '#10B981' : '#9CA3AF'
        }}>
          <Text style={{ 
            color: technician?.has_credentials ? '#065F46' : '#4B5563',
            fontSize: 12,
            fontFamily: 'YekanBold',
            textAlign: 'right'
          }}>
            {technician?.has_credentials ? '✓ تایید شده' : 'در انتظار تایید'}
          </Text>
        </View>

        {/* User Info Items */}
        <View style={{ gap: 12 }}>
          {(technician?.first_name || technician?.last_name) && (
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
              <Text style={{ 
                color: '#1F2937',
                fontSize: 15,
                fontFamily: 'YekanBold',
                textAlign: 'right'
              }}>
                {technician.first_name} {technician.last_name}
              </Text>
              <Text style={{ 
                color: '#9CA3AF',
                fontSize: 12,
                fontFamily: 'Yekan',
                textAlign: 'left'
              }}>
                نام
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            <Text style={{ 
              color: '#1F2937',
              fontSize: 15,
              fontFamily: 'YekanBold',
              textAlign: 'right'
            }}>
              {phoneNumber}
            </Text>
            <Text style={{ 
              color: '#9CA3AF',
              fontSize: 12,
              fontFamily: 'Yekan',
              textAlign: 'left'
            }}>
              شماره تماس
            </Text>
          </View>

          {technician?.national_id && (
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
              <Text style={{ 
                color: '#1F2937',
                fontSize: 15,
                fontFamily: 'YekanBold',
                textAlign: 'right'
              }}>
                {technician.national_id}
              </Text>
              <Text style={{ 
                color: '#9CA3AF',
                fontSize: 12,
                fontFamily: 'Yekan',
                textAlign: 'left'
              }}>
                کد ملی
              </Text>
            </View>
          )}

          {(technician?.organization_name || technician?.organization) && (
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
              <Text style={{ 
                color: '#1F2937',
                fontSize: 15,
                fontFamily: 'YekanBold',
                textAlign: 'right',
                flex: 1
              }}>
                {technician.organization_name || technician.organization?.name || 'نامشخص'}
              </Text>
              <Text style={{ 
                color: '#9CA3AF',
                fontSize: 12,
                fontFamily: 'Yekan',
                textAlign: 'left',
                marginLeft: 8
              }}>
                سازمان
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            <Text style={{ 
              color: '#1F2937',
              fontSize: 15,
              fontFamily: 'YekanBold',
              textAlign: 'right'
            }}>
              #{technician?.id || '---'}
            </Text>
            <Text style={{ 
              color: '#9CA3AF',
              fontSize: 12,
              fontFamily: 'Yekan',
              textAlign: 'left'
            }}>
              شناسه
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View className="bg-white rounded-3xl w-full p-6" style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 12,
            paddingVertical: 14,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#FEE2E2'
          }}
        >
          <Ionicons 
            name="log-out-outline" 
            size={20} 
            color="#DC2626" 
            style={{ marginLeft: 8 }} 
          />
          <Text style={{ color: '#DC2626', fontSize: 15, fontFamily: 'YekanBold' }}>
            خروج از سیستم
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

