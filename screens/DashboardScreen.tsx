import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { LogoutModal } from '../components/ui/LogoutModal';

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


  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <Header 
        title="داشبورد لیفتر" 
        onMenuPress={() => setSidebarVisible(true)} 
      />

      {/* Empty Dashboard - Ready for content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
            <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
          </View>
          <Text className="text-gray-400 text-lg font-yekan text-center">
            داشبورد آماده است
          </Text>
        </View>
      </View>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onLogout={handleLogout}
        technician={technician}
        phoneNumber={phoneNumber}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={logoutConfirmVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </SafeAreaView>
  );
};
