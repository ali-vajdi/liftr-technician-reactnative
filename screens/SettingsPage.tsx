import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Technician } from '../types';
import { formatPersianPhoneNumber, toPersianDigits } from '../utils/numberUtils';

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

  const InfoRow: React.FC<{ label: string; value?: string; icon: any }> = ({ label, value = 'نامشخص', icon }) => {
    return (
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          gap: 12,
        }}
      >
        {/* Right: Label and icon */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', minWidth: 110 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons name={icon} size={16} color="#6B7280" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'YekanBakhFaNum-Regular', textAlign: 'right' }}>
            {label}
          </Text>
        </View>
        {/* Left: Value */}
        <Text
          style={{
            color: '#1F2937',
            fontSize: 15,
            fontFamily: 'YekanBakhFaNum-Bold',
            textAlign: 'left',
            flex: 1,
          }}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Page Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}>
        <Text style={{
          fontSize: 22,
          fontFamily: 'YekanBakhFaNum-Bold',
          color: '#1F2937',
          textAlign: 'right',
        }}>
          تنظیمات
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
      <View
        className="bg-white rounded-3xl w-full p-6 mb-4"
        style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Ionicons name="person" size={28} color="#0077B6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#1F2937',
                fontSize: 18,
                fontFamily: 'YekanBakhFaNum-Bold',
                textAlign: 'right',
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {(technician?.first_name || technician?.last_name)
                ? `${technician?.first_name || ''} ${technician?.last_name || ''}`.trim()
                : 'کاربر لیفتر'}
            </Text>
            <Text style={{ color: '#6B7280', fontSize: 13, fontFamily: 'YekanBakhFaNum-Regular', textAlign: 'right' }}>
              {formatPersianPhoneNumber(phoneNumber)}
            </Text>
          </View>
        </View>

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
            fontFamily: 'YekanBakhFaNum-Bold',
            textAlign: 'right'
          }}>
            {technician?.has_credentials ? '✓ تایید شده' : 'در انتظار تایید'}
          </Text>
        </View>

        {/* User Info Items */}
        <View style={{ gap: 4 }}>
          {(technician?.first_name || technician?.last_name) && (
            <InfoRow
              label="نام و نام خانوادگی"
              value={`${technician?.first_name || ''} ${technician?.last_name || ''}`.trim()}
              icon="person-outline"
            />
          )}
          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 }} />
          <InfoRow label="شماره تماس" value={formatPersianPhoneNumber(phoneNumber)} icon="call-outline" />
          {technician?.national_id && (
            <>
              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 }} />
              <InfoRow label="کد ملی" value={toPersianDigits(technician.national_id)} icon="id-card-outline" />
            </>
          )}
          {(technician?.organization_name || technician?.organization) && (
            <>
              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 }} />
              <InfoRow
                label="شرکت"
                value={technician?.organization_name || technician?.organization?.name || 'نامشخص'}
                icon="business-outline"
              />
            </>
          )}
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
          <Text style={{ color: '#DC2626', fontSize: 15, fontFamily: 'YekanBakhFaNum-Bold' }}>
            خروج از سیستم
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
};

