import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DashboardScreenProps {
  phoneNumber: string;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ phoneNumber, onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'خروج از سیستم',
      'آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'خروج', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const dashboardItems = [
    {
      id: 1,
      title: 'درخواست‌های جدید',
      count: 5,
      color: 'bg-pacific-cyan',
      icon: '📋'
    },
    {
      id: 2,
      title: 'در حال انجام',
      count: 12,
      color: 'bg-honolulu-blue',
      icon: '⚙️'
    },
    {
      id: 3,
      title: 'تکمیل شده',
      count: 28,
      color: 'bg-non-photo-blue',
      icon: '✅'
    },
    {
      id: 4,
      title: 'مشتریان',
      count: 45,
      color: 'bg-light-cyan',
      icon: '👥'
    }
  ];

  const quickActions = [
    { title: 'درخواست جدید', icon: '➕', action: () => Alert.alert('درخواست جدید', 'این قابلیت به زودی اضافه خواهد شد') },
    { title: 'گزارش‌ها', icon: '📊', action: () => Alert.alert('گزارش‌ها', 'این قابلیت به زودی اضافه خواهد شد') },
    { title: 'تنظیمات', icon: '⚙️', action: () => Alert.alert('تنظیمات', 'این قابلیت به زودی اضافه خواهد شد') },
    { title: 'پشتیبانی', icon: '💬', action: () => Alert.alert('پشتیبانی', 'این قابلیت به زودی اضافه خواهد شد') }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-honolulu-blue text-3xl font-yekan-bold">
                داشبورد
              </Text>
              <Text className="text-gray-600 text-sm font-yekan">
                خوش آمدید، تکنیسین گرامی
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-gray-100 rounded-full p-3"
            >
              <Text className="text-honolulu-blue text-lg">🚪</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-gray-50 rounded-2xl p-4">
            <Text className="text-gray-600 text-sm font-yekan mb-1">
              شماره تلفن
            </Text>
            <Text className="text-honolulu-blue text-lg font-yekan-bold">
              {phoneNumber}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <Text className="text-honolulu-blue text-xl font-yekan-bold mb-4">
            آمار کلی
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {dashboardItems.map((item) => (
              <View key={item.id} className="w-[48%] mb-4">
                <View className="bg-gray-50 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-2xl">{item.icon}</Text>
                    <Text className="text-honolulu-blue text-2xl font-yekan-bold">
                      {item.count}
                    </Text>
                  </View>
                  <Text className="text-gray-800 text-sm font-yekan">
                    {item.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-honolulu-blue text-xl font-yekan-bold mb-4">
            دسترسی سریع
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.action}
                  className="w-[48%] mb-4"
                  activeOpacity={0.7}
                >
                  <View className="bg-white rounded-xl p-4 items-center border border-gray-200">
                    <Text className="text-3xl mb-2">{action.icon}</Text>
                    <Text className="text-gray-800 text-sm font-yekan text-center">
                      {action.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-6">
          <Text className="text-honolulu-blue text-xl font-yekan-bold mb-4">
            فعالیت‌های اخیر
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center py-3 border-b border-gray-200">
              <View className="w-3 h-3 bg-honolulu-blue rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="text-gray-800 font-yekan">
                  درخواست تعمیر کولر گازی
                </Text>
                <Text className="text-gray-500 text-sm font-yekan">
                  آقای احمدی - ۲ ساعت پیش
                </Text>
              </View>
              <Text className="text-honolulu-blue text-sm font-yekan-bold">
                جدید
              </Text>
            </View>
            
            <View className="flex-row items-center py-3 border-b border-gray-200">
              <View className="w-3 h-3 bg-gray-400 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="text-gray-800 font-yekan">
                  تعمیر یخچال
                </Text>
                <Text className="text-gray-500 text-sm font-yekan">
                  خانم رضایی - ۴ ساعت پیش
                </Text>
              </View>
              <Text className="text-gray-600 text-sm font-yekan">
                در حال انجام
              </Text>
            </View>
            
            <View className="flex-row items-center py-3">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="text-gray-800 font-yekan">
                  سرویس ماشین لباسشویی
                </Text>
                <Text className="text-gray-500 text-sm font-yekan">
                  آقای محمدی - دیروز
                </Text>
              </View>
              <Text className="text-green-600 text-sm font-yekan">
                تکمیل شده
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8"></View>
      </ScrollView>
    </SafeAreaView>
  );
};
