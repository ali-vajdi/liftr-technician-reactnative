import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getServiceDetail } from '../services/buildingService';
import type { ServiceDetail } from '../types';

interface ServiceDetailPageProps {
  serviceId: number;
  onBack: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, onBack }) => {
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServiceDetail();
  }, [serviceId]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServiceDetail(serviceId);
      if (response.success && response.data) {
        setServiceDetail(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری جزئیات سرویس');
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    if (!serviceDetail?.building?.selected_latitude || !serviceDetail?.building?.selected_longitude) {
      return;
    }
    const lat = serviceDetail.building.selected_latitude;
    const lng = serviceDetail.building.selected_longitude;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      // Handle error silently
    });
  };

  const makePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => {
      // Handle error silently
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center" style={{ paddingBottom: 100 }}>
        <View className="items-center">
          <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
            <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
          </View>
          <Text className="text-gray-400 text-lg font-yekan text-center">
            در حال بارگذاری...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !serviceDetail) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
        <View className="items-center">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-gray-700 text-lg font-yekan-bold text-center mt-4 mb-2">
            خطا در بارگذاری
          </Text>
          <Text className="text-gray-400 text-base font-yekan text-center mb-6">
            {error || 'اطلاعاتی یافت نشد'}
          </Text>
        </View>
      </View>
    );
  }

  const building = serviceDetail.building;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Main Info Card - Combined Building, Address, Manager */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        {/* Building Name & Status */}
        <View style={{ 
          flexDirection: 'row-reverse', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
              marginBottom: 6,
            }}>
              {building.name}
            </Text>
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
            }}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
              <Text style={{
                fontSize: 13,
                fontFamily: 'Yekan',
                color: '#6B7280',
                textAlign: 'right',
              }}>
                {serviceDetail.service_date_text}
              </Text>
            </View>
          </View>
          <View style={{
            backgroundColor: '#EFF6FF',
            borderRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 12,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: 'YekanBold',
              color: '#0077B6',
            }}>
              {serviceDetail.status_text}
            </Text>
          </View>
        </View>

        {/* Address Section */}
        <TouchableOpacity
          onPress={openMap}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'flex-start',
            paddingTop: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#F3F4F6',
            marginBottom: 16,
          }}
        >
          <View style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}>
            <Ionicons name="location" size={20} color="#0077B6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 15,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
              marginBottom: 4,
            }}>
              {building.address}
            </Text>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Yekan',
              color: '#6B7280',
              textAlign: 'right',
            }}>
              {building.city.name}، {building.province.name}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Manager Section */}
        <View style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ECFDF5',
            borderRadius: 12,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}>
            <Ionicons name="person" size={22} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Yekan',
              color: '#9CA3AF',
              textAlign: 'right',
              marginBottom: 4,
            }}>
              مدیر ساختمان
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
            }}>
              {building.manager_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => makePhoneCall(building.manager_phone)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              backgroundColor: '#F0FDF4',
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: '#D1FAE5',
            }}
          >
            <Ionicons name="call" size={18} color="#10B981" style={{ marginLeft: 6 }} />
            <Text style={{
              fontSize: 14,
              fontFamily: 'YekanBold',
              color: '#065F46',
              textAlign: 'right',
            }}>
              {building.manager_phone}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Elevators Section */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: 'YekanBold',
          color: '#1F2937',
          textAlign: 'right',
          marginBottom: 10,
          marginHorizontal: 4,
        }}>
          آسانسورها
        </Text>
        <View style={{ gap: 10 }}>
          {building.elevators.map((elevator) => (
            <View
              key={elevator.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: '#F3F4F6',
              }}
            >
              <View style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'YekanBold',
                  color: '#1F2937',
                  textAlign: 'right',
                }}>
                  آسانسور {elevator.name}
                </Text>
                <View style={{
                  backgroundColor: elevator.status ? '#ECFDF5' : '#FEF2F2',
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'YekanBold',
                    color: elevator.status ? '#065F46' : '#991B1B',
                  }}>
                    {elevator.status ? 'فعال' : 'غیرفعال'}
                  </Text>
                </View>
              </View>

              <View style={{
                flexDirection: 'row-reverse',
                gap: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Yekan',
                    color: '#9CA3AF',
                    textAlign: 'right',
                    marginBottom: 4,
                  }}>
                    تعداد توقف
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'YekanBold',
                    color: '#1F2937',
                    textAlign: 'right',
                  }}>
                    {elevator.stops_count}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Yekan',
                    color: '#9CA3AF',
                    textAlign: 'right',
                    marginBottom: 4,
                  }}>
                    ظرفیت
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'YekanBold',
                    color: '#1F2937',
                    textAlign: 'right',
                  }}>
                    {elevator.capacity} نفر
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Register Checklist Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: '#0077B6',
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row-reverse',
          shadowColor: '#0077B6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginLeft: 8 }} />
        <Text style={{
          fontSize: 15,
          fontFamily: 'YekanBold',
          color: 'white',
        }}>
          ثبت چک لیست
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

