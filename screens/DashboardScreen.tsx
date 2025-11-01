import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

interface DashboardScreenProps {
  phoneNumber: string;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ phoneNumber, onLogout }) => {
  const { technician: contextTechnician } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [technician, setTechnician] = useState(contextTechnician);
  const [loading, setLoading] = useState(false);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setTechnician(profile);
    } catch (error: any) {
      // Silently handle profile load errors
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    setTimeout(() => {
      setLogoutConfirmVisible(true);
    }, 100);
  };

  const confirmLogout = () => {
    setLogoutConfirmVisible(false);
    onLogout();
  };

  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
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
      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center justify-between" style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
      }}>
        <View className="w-10"></View>
        
        <View className="items-center">
          <Text className="text-honolulu-blue text-xl font-yekan-bold">
            داشبورد لیفتر
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setSidebarVisible(true)}
          className="w-10 h-10 bg-honolulu-blue rounded-xl items-center justify-center"
          activeOpacity={0.7}
        >
          <View style={{ gap: 4 }}>
            <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
            <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
            <View style={{ width: 20, height: 2, backgroundColor: 'white' }}></View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1">

        {/* Welcome Section */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-gray-600 text-base font-yekan">
            خوش آمدید{technician?.name ? `، ${technician.name}` : ''}
          </Text>
          <Text className="text-gray-800 text-2xl font-yekan-bold mt-1">
            {phoneNumber}
          </Text>
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

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Overlay */}
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
          
          {/* Sidebar - slides from right */}
          <View style={{ width: 320, backgroundColor: 'white', height: '100%' }}>
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Sidebar Header */}
                <View style={{ backgroundColor: '#0077B6', paddingHorizontal: 24, paddingVertical: 32 }}>
                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 32, width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 32 }}>👤</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setSidebarVisible(false)}
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: 'white', fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={{ color: 'white', fontSize: 20, fontFamily: 'YekanBold', marginBottom: 4, textAlign: 'right' }}>
                    {technician?.full_name || technician?.name || 'تکنیسین'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Yekan', textAlign: 'right' }}>
                    {phoneNumber}
                  </Text>
                </View>

              {/* Technician Info */}
              <View style={{ paddingHorizontal: 24, paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Yekan', marginBottom: 12, textAlign: 'right' }}>
                  اطلاعات حساب
                </Text>
                
                {/* Name */}
                {(technician?.first_name || technician?.last_name) && (
                  <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Yekan', marginBottom: 4, textAlign: 'right' }}>
                      نام و نام خانوادگی
                    </Text>
                    <Text style={{ color: '#1F2937', fontSize: 16, fontFamily: 'YekanBold', textAlign: 'right' }}>
                      {technician.first_name} {technician.last_name}
                    </Text>
                  </View>
                )}

                {/* National ID */}
                {technician?.national_id && (
                  <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Yekan', marginBottom: 4, textAlign: 'right' }}>
                      کد ملی
                    </Text>
                    <Text style={{ color: '#1F2937', fontSize: 16, fontFamily: 'YekanBold', textAlign: 'right' }}>
                      {technician.national_id}
                    </Text>
                  </View>
                )}

                {/* Organization */}
                {(technician?.organization_name || technician?.organization) && (
                  <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Yekan', marginBottom: 4, textAlign: 'right' }}>
                      سازمان
                    </Text>
                    <Text style={{ color: '#1F2937', fontSize: 16, fontFamily: 'YekanBold', textAlign: 'right' }}>
                      {technician.organization_name || technician.organization?.name || 'نامشخص'}
                    </Text>
                  </View>
                )}

                {/* Technician ID */}
                <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 }}>
                  <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Yekan', marginBottom: 4, textAlign: 'right' }}>
                    شناسه کاربری
                  </Text>
                  <Text style={{ color: '#1F2937', fontSize: 16, fontFamily: 'YekanBold', textAlign: 'right' }}>
                    #{technician?.id}
                  </Text>
                </View>
              </View>

                {/* Menu Items */}
                <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => {
                      setSidebarVisible(false);
                      Alert.alert('پروفایل', 'این بخش به زودی اضافه خواهد شد');
                    }}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6'
                    }}
                  >
                    <Text style={{ fontSize: 24, marginLeft: 16 }}>👤</Text>
                    <Text style={{ flex: 1, fontSize: 16, color: '#1F2937', fontFamily: 'Yekan', textAlign: 'right' }}>
                      پروفایل من
                    </Text>
                    <Text style={{ fontSize: 20, color: '#9CA3AF' }}>←</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => {
                      setSidebarVisible(false);
                      Alert.alert('تنظیمات', 'این بخش به زودی اضافه خواهد شد');
                    }}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6'
                    }}
                  >
                    <Text style={{ fontSize: 24, marginLeft: 16 }}>⚙️</Text>
                    <Text style={{ flex: 1, fontSize: 16, color: '#1F2937', fontFamily: 'Yekan', textAlign: 'right' }}>
                      تنظیمات
                    </Text>
                    <Text style={{ fontSize: 20, color: '#9CA3AF' }}>←</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => {
                      setSidebarVisible(false);
                      Alert.alert('پشتیبانی', 'این بخش به زودی اضافه خواهد شد');
                    }}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6'
                    }}
                  >
                    <Text style={{ fontSize: 24, marginLeft: 16 }}>💬</Text>
                    <Text style={{ flex: 1, fontSize: 16, color: '#1F2937', fontFamily: 'Yekan', textAlign: 'right' }}>
                      پشتیبانی
                    </Text>
                    <Text style={{ fontSize: 20, color: '#9CA3AF' }}>←</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => {
                      setSidebarVisible(false);
                      Alert.alert('درباره ما', 'این بخش به زودی اضافه خواهد شد');
                    }}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingVertical: 16
                    }}
                  >
                    <Text style={{ fontSize: 24, marginLeft: 16 }}>ℹ️</Text>
                    <Text style={{ flex: 1, fontSize: 16, color: '#1F2937', fontFamily: 'Yekan', textAlign: 'right' }}>
                      درباره ما
                    </Text>
                    <Text style={{ fontSize: 20, color: '#9CA3AF' }}>←</Text>
                  </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
                  <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: '#EF4444',
                      borderRadius: 16,
                      paddingVertical: 16,
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#EF4444',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>🚪</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontFamily: 'YekanBold' }}>
                      خروج از حساب کاربری
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.3)',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0077B6" />
            <Text style={{ color: '#4B5563', fontSize: 16, fontFamily: 'Yekan', marginTop: 12 }}>
              در حال بارگذاری...
            </Text>
          </View>
        </View>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutConfirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 20
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 24, 
            width: '100%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8
          }}>
            <Text style={{ 
              fontSize: 20, 
              fontFamily: 'YekanBold', 
              color: '#1F2937', 
              marginBottom: 12,
              textAlign: 'right'
            }}>
              خروج از سیستم
            </Text>
            
            <Text style={{ 
              fontSize: 16, 
              fontFamily: 'Yekan', 
              color: '#6B7280', 
              marginBottom: 24,
              textAlign: 'right',
              lineHeight: 24
            }}>
              آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟
            </Text>
            
            <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
              <TouchableOpacity
                onPress={confirmLogout}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#EF4444',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'YekanBold' }}>
                  خروج
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={cancelLogout}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: '#4B5563', fontSize: 16, fontFamily: 'YekanBold' }}>
                  انصراف
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
