import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { MessagesPage } from './MessagesPage';
import messageService from '../services/messageService';

interface DashboardScreenProps {
  phoneNumber: string;
  onLogout: () => void;
  onNavigate?: (page: 'reports' | 'home' | 'settings') => void;
  activePage?: 'reports' | 'home' | 'settings';
  onDetailPageChange?: (isOnDetailPage: boolean) => void;
  onDetailPageBackChange?: (backHandler: (() => void) | null) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  phoneNumber, 
  onLogout,
  onNavigate,
  activePage = 'home',
  onDetailPageChange,
  onDetailPageBackChange,
}) => {
  const { technician: contextTechnician } = useAuth();
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [technician, setTechnician] = useState(contextTechnician);
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const insets = useSafeAreaInsets();
  const backHandlerRef = useRef<(() => void) | null>(null);
  const isInitialMount = useRef(true);
  const prevShowMessages = useRef(showMessages);
  const prevActivePage = useRef(activePage);
  const prevSelectedServiceId = useRef(selectedServiceId);

  // Define back handlers with useCallback
  const handleBackFromDetail = useCallback(() => {
    setSelectedServiceId(null);
  }, []);

  const handleBackFromMessages = useCallback(() => {
    setShowMessages(false);
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadProfile();
    loadMessagesCount();
    isInitialMount.current = false;
  }, []);

  // Refresh unread count when returning from messages page (only when showMessages changes from true to false)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      prevShowMessages.current = showMessages;
      return;
    }
    
    // Only reload if we're returning from messages page (was true, now false)
    if (prevShowMessages.current === true && showMessages === false) {
      loadMessagesCount();
    }
    prevShowMessages.current = showMessages;
  }, [showMessages]);

  // Reload unread count whenever any dashboard page loads (only when activePage or selectedServiceId actually changes)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      prevActivePage.current = activePage;
      prevSelectedServiceId.current = selectedServiceId;
      return;
    }
    
    // Only reload if we're not on a detail page or messages page and something actually changed
    if (!selectedServiceId && !showMessages) {
      const activePageChanged = prevActivePage.current !== activePage;
      const selectedServiceIdChanged = prevSelectedServiceId.current !== selectedServiceId;
      
      if (activePageChanged || selectedServiceIdChanged) {
        loadMessagesCount();
      }
    }
    
    prevActivePage.current = activePage;
    prevSelectedServiceId.current = selectedServiceId;
  }, [activePage, selectedServiceId, showMessages]);

  // Notify parent when detail page state changes
  useEffect(() => {
    if (onDetailPageChange) {
      onDetailPageChange(!!selectedServiceId || showMessages);
    }
  }, [selectedServiceId, showMessages, onDetailPageChange]);

  // Provide back handler callback to parent (separate effect to avoid render issues)
  useEffect(() => {
    if (!onDetailPageBackChange) return;

    let newBackHandler: (() => void) | null = null;
    if (showMessages) {
      newBackHandler = handleBackFromMessages;
    } else if (selectedServiceId) {
      newBackHandler = handleBackFromDetail;
    }

    // Only update if the handler actually changed
    if (backHandlerRef.current !== newBackHandler) {
      backHandlerRef.current = newBackHandler;
      onDetailPageBackChange(newBackHandler);
    }
  }, [selectedServiceId, showMessages, onDetailPageBackChange, handleBackFromMessages, handleBackFromDetail]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setTechnician(profile);
    } catch (error: any) {
      // If technician status is disabled, logout automatically
      if (error.message === 'TECHNICIAN_STATUS_DISABLED') {
        onLogout();
        return;
      }
      // Silently handle other profile load errors
    } finally {
      setLoading(false);
    }
  };

  const loadMessagesCount = async () => {
    try {
      const response = await messageService.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (error: any) {
      // Silently handle messages load errors
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

  const handleMessagesPress = () => {
    setShowMessages(true);
  };

  const renderPage = () => {
    if (showMessages) {
      return <MessagesPage onBack={handleBackFromMessages} onMessagesRead={loadMessagesCount} />;
    }

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
        onBackPress={showMessages ? handleBackFromMessages : handleBackFromDetail}
        showBack={!!selectedServiceId || showMessages}
        onMessagesPress={handleMessagesPress}
        unreadCount={unreadCount}
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

      {/* Sticky Bottom Navigation - Hide when viewing service detail or messages */}
      {!selectedServiceId && !showMessages && (
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
            fontFamily: 'Vazirmatn-Regular', 
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
            fontFamily: 'Vazirmatn-Regular', 
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
            fontFamily: 'Vazirmatn-Regular', 
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
