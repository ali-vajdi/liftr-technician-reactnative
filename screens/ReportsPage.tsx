import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getReports } from '../services/buildingService';
import type { ReportsResponse, ReportStats, LastService } from '../types';
import { toPersianDigits, formatPersianNumber } from '../utils/numberUtils';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری گزارش‌ها');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    stats: ReportStats;
    icon: string;
    iconColor: string;
    bgColor: string;
    isDetailed?: boolean;
  }> = ({ title, stats, icon, iconColor, bgColor, isDetailed = false }) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: bgColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}
          >
            <Ionicons name={icon as any} size={20} color={iconColor} />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'YekanBakhFaNum-Bold',
              color: '#1F2937',
              textAlign: 'right',
              flex: 1,
            }}
          >
            {title}
          </Text>
        </View>

        {isDetailed ? (
          <>
            {/* Completion Rate */}
            <View
              style={{
                backgroundColor: '#F0F9FF',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderRightWidth: 3,
                borderRightColor: '#0077B6',
              }}
            >
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', textAlign: 'right' }}>
                  نرخ تکمیل
                </Text>
                <Text style={{ fontSize: 18, fontFamily: 'YekanBakhFaNum-Bold', color: '#0077B6', textAlign: 'left' }}>
                  {toPersianDigits(stats.completion_rate.toFixed(1))}%
                </Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
              <StatItem label="کل" value={stats.total} color="#1F2937" />
              <StatItem label="اختصاص داده" value={stats.assigned} color="#3B82F6" />
              <StatItem label="تکمیل شده" value={stats.completed} color="#10B981" />
            </View>
          </>
        ) : (
          /* Simple View - Only Total and Completed */
          <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontFamily: 'YekanBakhFaNum-Bold', color: '#1F2937', marginBottom: 6 }}>
                {toPersianDigits(stats.total)}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', textAlign: 'center' }}>
                کل
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontFamily: 'YekanBakhFaNum-Bold', color: '#10B981', marginBottom: 6 }}>
                {toPersianDigits(stats.completed)}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', textAlign: 'center' }}>
                تکمیل شده
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const StatItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    return (
      <View
        style={{
          flex: 1,
          minWidth: '30%',
          backgroundColor: '#F9FAFB',
          borderRadius: 10,
          padding: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontFamily: 'YekanBakhFaNum-Bold', color, marginBottom: 4 }}>
          {toPersianDigits(value)}
        </Text>
        <Text style={{ fontSize: 11, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', textAlign: 'center' }}>
          {label}
        </Text>
      </View>
    );
  };

  const ServiceCard: React.FC<{ service: LastService }> = ({ service }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return '#10B981';
        case 'assigned':
          return '#3B82F6';
        case 'pending':
          return '#F59E0B';
        case 'expired':
          return '#EF4444';
        default:
          return '#6B7280';
      }
    };

    const getStatusBgColor = (status: string) => {
      switch (status) {
        case 'completed':
          return '#ECFDF5';
        case 'assigned':
          return '#EFF6FF';
        case 'pending':
          return '#FEF3C7';
        case 'expired':
          return '#FEE2E2';
        default:
          return '#F3F4F6';
      }
    };

    const monthNames = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];

    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Building Name and Status */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: '#1F2937',
                textAlign: 'right',
                marginBottom: 4,
              }}
            >
              {service.building_name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'YekanBakhFaNum-Regular',
                color: '#6B7280',
                textAlign: 'right',
              }}
            >
              {service.building_address}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: getStatusBgColor(service.status),
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: getStatusColor(service.status),
              }}
            >
              {service.status_text}
            </Text>
          </View>
        </View>

        {/* Service Date */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
          <Text style={{ fontSize: 13, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', textAlign: 'right' }}>
            {monthNames[service.service_month - 1]} {toPersianDigits(service.service_year)}
          </Text>
        </View>

        {/* Assigned At */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: service.completed_at ? 8 : 0 }}>
          <Ionicons name="time-outline" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
          <Text style={{ fontSize: 12, fontFamily: 'YekanBakhFaNum-Regular', color: '#9CA3AF', textAlign: 'right' }}>
            اختصاص داده شده: {toPersianDigits(service.assigned_at)}
          </Text>
        </View>

        {/* Completed At */}
        {service.completed_at && (
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" style={{ marginLeft: 6 }} />
            <Text style={{ fontSize: 12, fontFamily: 'YekanBakhFaNum-Regular', color: '#10B981', textAlign: 'right' }}>
              تکمیل شده: {toPersianDigits(service.completed_at)}
            </Text>
          </View>
        )}
      </View>
    );
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
        گزارش
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {renderHeader()}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={{ fontSize: 14, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', marginTop: 12 }}>
            در حال بارگذاری گزارش‌ها...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {renderHeader()}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={{ fontSize: 16, fontFamily: 'YekanBakhFaNum-Bold', color: '#1F2937', marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
            خطا در بارگذاری گزارش‌ها
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'YekanBakhFaNum-Regular', color: '#6B7280', marginBottom: 20, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadReports}
            style={{
              backgroundColor: '#0077B6',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 24,
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: 'YekanBakhFaNum-Bold', color: 'white' }}>
              تلاش مجدد
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!reports) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {renderHeader()}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingBottom: 90 + insets.bottom, 
          paddingHorizontal: 16, 
          paddingTop: 16 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Stats - Detailed */}
      <StatCard
        title="امروز"
        stats={reports.today}
        icon="today-outline"
        iconColor="#0077B6"
        bgColor="#EFF6FF"
        isDetailed={true}
      />

      {/* Current Month Stats - Simple */}
      <StatCard
        title="ماه جاری"
        stats={reports.current_month}
        icon="calendar-outline"
        iconColor="#10B981"
        bgColor="#ECFDF5"
        isDetailed={false}
      />

      {/* Overall Stats - Simple */}
      <StatCard
        title="کل"
        stats={reports.overall}
        icon="stats-chart-outline"
        iconColor="#8B5CF6"
        bgColor="#F3E8FF"
        isDetailed={false}
      />

      {/* Last Services */}
      {reports.last_services && reports.last_services.length > 0 && (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#F3F4F6',
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
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#FEF3C7',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <Ionicons name="list-outline" size={20} color="#F59E0B" />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: '#1F2937',
                textAlign: 'right',
                flex: 1,
              }}
            >
              آخرین سرویس‌ها
            </Text>
          </View>

          {reports.last_services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>
      )}

      {/* Empty State for Last Services */}
      {(!reports.last_services || reports.last_services.length === 0) && (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
          <Text style={{ fontSize: 14, fontFamily: 'YekanBakhFaNum-Regular', color: '#9CA3AF', marginTop: 12, textAlign: 'center' }}>
            هیچ سرویسی یافت نشد
          </Text>
        </View>
      )}
    </ScrollView>
    </View>
  );
};
