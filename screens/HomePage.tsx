import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAssignedBuildings } from '../services/buildingService';
import type { AssignedBuilding } from '../types';
import { toPersianDigits } from '../utils/numberUtils';

interface HomePageProps {
  onBuildingPress?: (serviceId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onBuildingPress }) => {
  const [buildings, setBuildings] = useState<AssignedBuilding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssignedBuildings();
      if (response.success && response.data) {
        setBuildings(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری ساختمان‌ها');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
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
        خانه
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
              <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
            </View>
            <Text className="text-gray-400 text-lg font-yekan text-center">
              در حال بارگذاری...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-gray-700 text-lg font-yekan-bold text-center mt-4 mb-2">
              خطا در بارگذاری
            </Text>
            <Text className="text-gray-400 text-base font-yekan text-center mb-6">
              {error}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (buildings.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
              <Ionicons name="business-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-700 text-lg font-yekan-bold text-center mb-2">
              ساختمانی یافت نشد
            </Text>
            <Text className="text-gray-400 text-base font-yekan text-center">
              در حال حاضر ساختمانی به شما اختصاص داده نشده است
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >

      {/* Buildings List */}
      <View style={{ gap: 12 }}>
        {buildings.map((building) => (
          <TouchableOpacity
            key={building.id}
            activeOpacity={0.7}
            onPress={() => {
              if (onBuildingPress) {
                onBuildingPress(building.id);
              }
            }}
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            {/* Building Name */}
            <Text style={{
              fontSize: 17,
              fontFamily: 'YekanBakhFaNum-Bold',
              color: '#1F2937',
              textAlign: 'right',
              marginBottom: 8,
            }}>
              {building.building_name}
            </Text>

            {/* Address */}
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Ionicons name="location-outline" size={16} color="#9CA3AF" style={{ marginLeft: 6 }} />
              <Text style={{
                flex: 1,
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Regular',
                color: '#6B7280',
                textAlign: 'right',
              }}>
                {building.building_address}
              </Text>
            </View>

            {/* Footer Info */}
            <View style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
            }}>
              <Text style={{
                fontSize: 12,
                fontFamily: 'YekanBakhFaNum-Regular',
                color: '#9CA3AF',
                textAlign: 'right',
              }}>
                {toPersianDigits(building.assigned_at_jalali)}
              </Text>
              <View style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
              }}>
                <Ionicons name="arrow-up-outline" size={16} color="#0077B6" style={{ marginLeft: 4 }} />
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'YekanBakhFaNum-Bold',
                  color: '#0077B6',
                }}>
                  {toPersianDigits(building.elevators_count)} آسانسور
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </View>
  );
};

