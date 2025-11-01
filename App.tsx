import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { PasswordScreen } from './screens/PasswordScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fonts } from './fonts.config';
import './global.css';

type AppState = 'welcome' | 'login' | 'password' | 'verification' | 'dashboard';

function AppContent() {
  const { isAuthenticated, technician, isLoading: authLoading, login, sendOtp, verifyOtp, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageModal, setMessageModal] = useState<{ visible: boolean; type: 'success' | 'error'; title: string; message: string }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showMessage = (type: 'success' | 'error', title: string, message: string) => {
    setMessageModal({ visible: true, type, title, message });
  };

  // Automatically navigate to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && technician) {
      setPhoneNumber(technician.phone_number);
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, technician]);

  const handleGetStarted = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen('password');
  };

  const handlePasswordLogin = async (password: string) => {
    try {
      setIsLoading(true);
      const response = await login(phoneNumber, password);
      setIsLoading(false);
      showMessage('success', 'موفقیت', response.message);
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error?.message || 'خطا در ورود به سیستم';
      showMessage('error', 'خطای ورود', errorMsg);
    }
  };

  const handleSwitchToOTP = async () => {
    try {
      setIsLoading(true);
      const response = await sendOtp(phoneNumber);
      setIsLoading(false);
      
      // Show OTP code in development mode in the message
      let message = response.message;
      if (response.otp_code) {
        message = `${response.message}\n\nکد OTP (حالت توسعه): ${response.otp_code}`;
      }
      
      showMessage('success', 'موفقیت', message);
      setCurrentScreen('verification');
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error?.message || 'خطا در ارسال کد تایید';
      showMessage('error', 'خطا', errorMsg);
    }
  };

  const handleVerify = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await verifyOtp(phoneNumber, code);
      setIsLoading(false);
      showMessage('success', 'موفقیت', response.message);
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error?.message || 'کد تایید نامعتبر است';
      showMessage('error', 'خطای تایید', errorMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const response = await sendOtp(phoneNumber);
      setIsLoading(false);
      
      // Show OTP code in development mode in the message
      let message = response.message;
      if (response.otp_code) {
        message = `${response.message}\n\nکد OTP (حالت توسعه): ${response.otp_code}`;
      }
      
      showMessage('success', 'موفقیت', message);
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error?.message || 'خطا در ارسال مجدد کد تایید';
      showMessage('error', 'خطا', errorMsg);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setPhoneNumber('');
      setCurrentScreen('welcome');
    } catch (error: any) {
      showMessage('error', 'خطا', error.message || 'خطا در خروج از سیستم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'login':
        setCurrentScreen('welcome');
        break;
      case 'password':
        setCurrentScreen('login');
        break;
      case 'verification':
        setCurrentScreen('password');
        break;
      default:
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onBack={handleBack}
          />
        );
      case 'password':
        return (
          <PasswordScreen
            phoneNumber={phoneNumber}
            onPasswordLogin={handlePasswordLogin}
            onBack={handleBack}
            onSwitchToOTP={handleSwitchToOTP}
          />
        );
      case 'verification':
        return (
          <VerificationScreen
            phoneNumber={phoneNumber}
            onVerify={handleVerify}
            onBack={handleBack}
            onResend={handleResendCode}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            phoneNumber={phoneNumber}
            onLogout={handleLogout}
          />
        );
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  // Show loading indicator during authentication check
  if (authLoading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#0077B6" />
          <Text className="text-gray-600 text-base font-yekan mt-4">
            در حال بارگذاری...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        {renderCurrentScreen()}
        <StatusBar style="dark" />
        
        {/* Loading Overlay */}
        {isLoading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white rounded-2xl p-6 items-center">
              <ActivityIndicator size="large" color="#0077B6" />
              <Text className="text-gray-700 text-base font-yekan mt-3">
                لطفاً صبر کنید...
              </Text>
            </View>
          </View>
        )}

        {/* Message Modal */}
        <Modal
          visible={messageModal.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMessageModal({ ...messageModal, visible: false })}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMessageModal({ ...messageModal, visible: false })}
            style={{ 
              flex: 1, 
              backgroundColor: 'rgba(0,0,0,0.6)', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 20
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 24, 
                padding: 0,
                width: '100%',
                maxWidth: 380,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 12,
                overflow: 'hidden'
              }}
            >
              {/* Header with colored background */}
              <View style={{
                backgroundColor: messageModal.type === 'success' ? '#10B981' : '#EF4444',
                paddingTop: 32,
                paddingBottom: 24,
                paddingHorizontal: 24,
                alignItems: 'center'
              }}>
                <View style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                    {messageModal.type === 'success' ? '✓' : '✕'}
                  </Text>
                </View>
                
                <Text style={{ 
                  fontSize: 22, 
                  fontFamily: 'YekanBold', 
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  {messageModal.title}
                </Text>
              </View>
              
              {/* Message content */}
              <View style={{ padding: 24 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontFamily: 'Yekan', 
                  color: '#4B5563', 
                  textAlign: 'center',
                  lineHeight: 26,
                  marginBottom: 24
                }}>
                  {messageModal.message}
                </Text>
                
                <TouchableOpacity
                  onPress={() => setMessageModal({ ...messageModal, visible: false })}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: messageModal.type === 'success' ? '#10B981' : '#EF4444',
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: messageModal.type === 'success' ? '#10B981' : '#EF4444',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4
                  }}
                >
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 17, 
                    fontFamily: 'YekanBold',
                    letterSpacing: 0.5
                  }}>
                    متوجه شدم
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fonts);
        setFontsLoaded(true);
      } catch (error) {
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }
    
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}