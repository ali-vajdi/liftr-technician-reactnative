import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Header } from '../components/layout/Header';
import { LogoutModal } from '../components/ui/LogoutModal';
import { HomePage } from './HomePage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { ServiceDetailPage } from './ServiceDetailPage';

interface DashboardScreenProps {
  phoneNumber: string;
  onLogout: () => void;
  onNavigate?: (page: 'reports' | 'home' | 'settings') => void;
  activePage?: 'reports' | 'home' | 'settings';
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  phoneNumber, 
  onLogout,
  onNavigate,
  activePage = 'home',
}) => {
  const { technician: contextTechnician } = useAuth();
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [technician, setTechnician] = useState(contextTechnician);
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

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
    setLogoutConfirmVisible(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmVisible(false);
    onLogout();
  };

  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
  };

  const getOrganizationName = () => {
    return technician?.organization_name || technician?.organization?.name || 'لیفتر';
  };

  const handleBuildingPress = (serviceId: number) => {
    setSelectedServiceId(serviceId);
  };

  const handleBackFromDetail = () => {
    setSelectedServiceId(null);
  };

  const renderPage = () => {
    if (selectedServiceId) {
      return (
        <ServiceDetailPage 
          serviceId={selectedServiceId}
          onBack={handleBackFromDetail}
        />
      );
    }

    switch (activePage) {
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return (
          <SettingsPage 
            technician={technician}
            phoneNumber={phoneNumber}
            onLogout={handleLogout}
          />
        );
      case 'home':
      default:
        return <HomePage onBuildingPress={handleBuildingPress} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <Header 
        organizationName={getOrganizationName()} 
        onBackPress={handleBackFromDetail}
        showBack={!!selectedServiceId}
      />

      {/* Page Content */}
      <View className="flex-1">
        {renderPage()}
      </View>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={logoutConfirmVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* Sticky Bottom Navigation - Hide when viewing service detail */}
      {!selectedServiceId && (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 12),
        paddingHorizontal: 16,
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}>
        {/* گزارش - Right Button */}
        <TouchableOpacity
          onPress={() => {
            if (onNavigate) {
              onNavigate('reports');
            }
          }}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: activePage === 'reports' ? '#EFF6FF' : 'transparent',
          }}
        >
          <Ionicons 
            name="document-text-outline" 
            size={24} 
            color={activePage === 'reports' ? '#0077B6' : '#6B7280'} 
          />
          <Text style={{ 
            fontSize: 12, 
            fontFamily: 'Yekan', 
            color: activePage === 'reports' ? '#0077B6' : '#6B7280',
            marginTop: 4
          }}>
            گزارش
          </Text>
        </TouchableOpacity>

        {/* خانه - Middle Button */}
        <TouchableOpacity
          onPress={() => {
            if (onNavigate) {
              onNavigate('home');
            }
          }}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: activePage === 'home' ? '#EFF6FF' : 'transparent',
          }}
        >
          <Ionicons 
            name="home-outline" 
            size={24} 
            color={activePage === 'home' ? '#0077B6' : '#6B7280'} 
          />
          <Text style={{ 
            fontSize: 12, 
            fontFamily: 'Yekan', 
            color: activePage === 'home' ? '#0077B6' : '#6B7280',
            marginTop: 4
          }}>
            خانه
          </Text>
        </TouchableOpacity>

        {/* تنظیمات - Left Button */}
        <TouchableOpacity
          onPress={() => {
            if (onNavigate) {
              onNavigate('settings');
            }
          }}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: activePage === 'settings' ? '#EFF6FF' : 'transparent',
          }}
        >
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={activePage === 'settings' ? '#0077B6' : '#6B7280'} 
          />
          <Text style={{ 
            fontSize: 12, 
            fontFamily: 'Yekan', 
            color: activePage === 'settings' ? '#0077B6' : '#6B7280',
            marginTop: 4
          }}>
            تنظیمات
          </Text>
        </TouchableOpacity>
      </View>
      )}
    </SafeAreaView>
  );
};
