import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAssignedBuildings } from '../services/buildingService';
import type { AssignedBuilding, DateGroup } from '../types';

interface HomePageProps {
  onBuildingPress?: (serviceId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onBuildingPress }) => {
  const [buildingsData, setBuildingsData] = useState<{ [dateTitle: string]: DateGroup }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await getAssignedBuildings();
      if (response.success && response.data) {
        setBuildingsData(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری ساختمان‌ها');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await loadBuildings(true);
  };

  const renderHeader = () => (
    <View style={{
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Text style={{
        fontSize: 22,
        fontFamily: 'Vazirmatn-Bold',
        color: '#1F2937',
        textAlign: 'right',
        flex: 1,
      }}>
        خانه
      </Text>
      {Platform.OS === 'web' && (
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          style={{
            padding: 8,
            marginLeft: 12,
            borderRadius: 8,
            backgroundColor: refreshing ? '#F3F4F6' : 'transparent',
            minWidth: 40,
            minHeight: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#0077B6" />
          ) : (
            <Ionicons 
              name="refresh-outline" 
              size={24} 
              color="#0077B6"
            />
          )}
        </TouchableOpacity>
      )}
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

  // Check if there are any buildings
  const hasBuildings = Object.keys(buildingsData).length > 0 && 
    Object.values(buildingsData).some(dateGroup => {
      return Object.keys(dateGroup).some(key => {
        if (key === 'is_passed') return false;
        const buildings = dateGroup[key] as AssignedBuilding[];
        return Array.isArray(buildings) && buildings.length > 0;
      });
    });

  if (!hasBuildings) {
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
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 90 + insets.bottom, 
          paddingHorizontal: 20, 
          paddingTop: 24 
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0077B6']}
              tintColor="#0077B6"
            />
          ) : undefined
        }
      >
      {/* Creative Timeline-Style Buildings List */}
      <View style={{ gap: 32 }}>
        {Object.entries(buildingsData).map(([dateTitle, dateGroup], dateIndex) => {
          // Get time ranges (exclude is_passed)
          const timeRanges = Object.keys(dateGroup).filter(key => key !== 'is_passed');
          
          // Skip if no time ranges
          if (timeRanges.length === 0) return null;

          const isPassed = dateGroup.is_passed;
          const isLastDate = dateIndex === Object.keys(buildingsData).length - 1;

          return (
            <View key={dateTitle} style={{ position: 'relative' }}>
              {/* Timeline Line */}
              {!isLastDate && (
                <View style={{
                  position: 'absolute',
                  right: 15,
                  top: 0,
                  bottom: -32,
                  width: 2,
                  backgroundColor: '#E5E7EB',
                }} />
              )}

              {/* Date Card */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}>
                {/* Date Header */}
                <View style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 22,
                      fontFamily: 'Vazirmatn-Bold',
                      color: '#1F2937',
                      textAlign: 'right',
                      marginBottom: 4,
                    }}>
                      {dateTitle}
                    </Text>
                    {isPassed && (
                      <View style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 4,
                      }}>
                        <Ionicons name="alert-circle" size={14} color="#DC2626" />
                        <Text style={{
                          fontSize: 12,
                          fontFamily: 'Vazirmatn-Bold',
                          color: '#DC2626',
                        }}>
                          تاریخ مجاز مراجعه به اتمام رسیده است
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Time Ranges and Buildings */}
                <View style={{ gap: 20 }}>
                  {timeRanges.map((timeRange, timeIndex) => {
                    const buildings = dateGroup[timeRange] as AssignedBuilding[];
                    if (!Array.isArray(buildings) || buildings.length === 0) return null;

                    // Reverse the time range text
                    const reverseTimeRange = (range: string): string => {
                      // Try splitting by common delimiters
                      const delimiters = [' تا ', ' - ', '-', ' تا'];
                      for (const delimiter of delimiters) {
                        if (range.includes(delimiter)) {
                          const parts = range.split(delimiter).map(p => p.trim());
                          return parts.reverse().join(delimiter.trim());
                        }
                      }
                      // If no delimiter found, reverse the entire string
                      return range.split('').reverse().join('');
                    };

                    const reversedTimeRange = reverseTimeRange(timeRange);

                    return (
                      <View key={timeRange} style={{ gap: 12 }}>
                        {/* Time Range Badge */}
                        <View style={{
                          flexDirection: 'row-reverse',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 8,
                        }}>
                          <View style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            gap: 6,
                          }}>
                            <Ionicons 
                              name="time" 
                              size={16} 
                              color="#6B7280" 
                            />
                            <Text style={{
                              fontSize: 18,
                              fontFamily: 'Vazirmatn-Bold',
                              color: '#1F2937',
                            }}>
                              {reversedTimeRange}
                            </Text>
                          </View>
                          <View style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: '#E5E7EB',
                          }} />
                          <Text style={{
                            fontSize: 12,
                            fontFamily: 'Vazirmatn-Regular',
                            color: '#6B7280',
                          }}>
                            {buildings.length} ساختمان
                          </Text>
                        </View>

                        {/* Buildings Grid */}
                        <View style={{ gap: 12 }}>
                          {buildings.map((building, buildingIndex) => (
                            <TouchableOpacity
                              key={building.id}
                              activeOpacity={0.8}
                              onPress={() => {
                                if (onBuildingPress) {
                                  onBuildingPress(building.id);
                                }
                              }}
                              style={{
                                backgroundColor: 'white',
                                borderRadius: 16,
                                padding: 18,
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                opacity: isPassed ? 0.85 : 1,
                              }}
                            >
                              {/* Building Header */}
                              <View style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 12,
                              }}>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                  <Text style={{
                                    fontSize: 18,
                                    fontFamily: 'Vazirmatn-Bold',
                                    color: '#1F2937',
                                    textAlign: 'right',
                                    marginBottom: 6,
                                  }}>
                                    {building.building_name}
                                  </Text>
                                  <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    gap: 6,
                                  }}>
                                    <Ionicons name="location" size={14} color="#EF4444" />
                                    <Text style={{
                                      flex: 1,
                                      fontSize: 13,
                                      fontFamily: 'Vazirmatn-Regular',
                                      color: '#6B7280',
                                      textAlign: 'right',
                                    }}>
                                      {building.building_address}
                                    </Text>
                                  </View>
                                </View>
                                <View style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                  backgroundColor: '#F3F4F6',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <Ionicons 
                                    name="business" 
                                    size={20} 
                                    color="#6B7280" 
                                  />
                                </View>
                              </View>

                              {/* Building Info Footer */}
                              <View style={{
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 14,
                                borderTopWidth: 1,
                                borderTopColor: '#F3F4F6',
                                marginTop: 8,
                              }}>
                                <View style={{
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  gap: 6,
                                }}>
                                  <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                  <Text style={{
                                    fontSize: 11,
                                    fontFamily: 'Vazirmatn-Regular',
                                    color: '#9CA3AF',
                                  }}>
                                    {building.assigned_at_jalali}
                                  </Text>
                                </View>
                                <View style={{
                                  backgroundColor: '#EFF6FF',
                                  paddingHorizontal: 10,
                                  paddingVertical: 6,
                                  borderRadius: 8,
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  gap: 6,
                                }}>
                                  <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'Vazirmatn-Bold',
                                    color: '#0077B6',
                                  }}>
                                    تعداد آسانسور: {building.elevators_count}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
    </View>
  );
};

