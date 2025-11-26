import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal, BackHandler, Platform, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { PasswordScreen } from './screens/PasswordScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { LoadingModal } from './components/ui/LoadingModal';
import { UpdateDialog } from './components/ui/UpdateDialog';
import { SplashScreen as CustomSplashScreen } from './components/SplashScreen';
import { setLoadingCallback, setForceUpdateActive, setUpdateCheckComplete } from './services/api';
import authService, { type CheckUpdateResponse } from './services/authService';
import { fonts } from './fonts.config';
import './global.css';

// Prevent the default splash screen from auto-hiding
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

type ScreenState = 'welcome' | 'login' | 'password' | 'verification' | 'dashboard';

function AppContent() {
  const { isAuthenticated, technician, isLoading: authLoading, login, sendOtp, verifyOtp, logout } = useAuth();
  const { isLoading: apiLoading, showLoading, hideLoading, loadingMessage } = useLoading();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState<'reports' | 'home' | 'settings'>('home');
  const [isOnDetailPage, setIsOnDetailPage] = useState(false);
  const onDetailPageBackRef = useRef<(() => void) | null>(null);
  const shouldExitAppRef = useRef(false);
  const appState = useRef(AppState.currentState);
  const [messageModal, setMessageModal] = useState<{ visible: boolean; type: 'success' | 'error'; title: string; message: string }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [updateInfo, setUpdateInfo] = useState<{
    visible: boolean;
    forceUpdate: boolean;
    description: string;
    latestVersion: string;
    currentVersion: string;
  } | null>(null);
  const [isUpdateCheckComplete, setIsUpdateCheckComplete] = useState(false);

  // Connect axios loading callback
  useEffect(() => {
    setLoadingCallback((show: boolean, message?: string) => {
      if (show) {
        showLoading(message);
      } else {
        hideLoading();
      }
    });
  }, [showLoading, hideLoading]);

  // Check for app updates on Android app start
  useEffect(() => {
    const checkForUpdates = async () => {
      // Only check updates for Android
      if (Platform.OS !== 'android') {
        setIsUpdateCheckComplete(true);
        setUpdateCheckComplete(true);
        return;
      }

      try {
        // Get app version from app.json (via Constants)
        const appVersion = Constants.expoConfig?.version || '1.0.1';
        
        const response: CheckUpdateResponse = await authService.checkUpdate('android', appVersion);
        
        if (response.success && response.has_update) {
          const isForceUpdate = response.force_update;
          setUpdateInfo({
            visible: true,
            forceUpdate: isForceUpdate,
            description: response.description,
            latestVersion: response.latest_version,
            currentVersion: response.current_version,
          });
          // Block all API calls if force update is required
          setForceUpdateActive(isForceUpdate);
        }
      } catch (error) {
        // Silently handle update check errors - don't block app if check fails
        console.error('Failed to check for updates:', error);
      } finally {
        // Mark update check as complete regardless of success/failure
        setIsUpdateCheckComplete(true);
        setUpdateCheckComplete(true);
      }
    };

    checkForUpdates();
  }, []);

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

  // Handle app state changes (background/foreground) for Android
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      // When app comes back to foreground from background
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Don't reset navigation if force update is active
        if (updateInfo?.visible && updateInfo.forceUpdate) {
          // Ensure force update blocking is still active
          setForceUpdateActive(true);
          appState.current = nextAppState;
          return;
        }

        // Reset navigation state when app comes back from background
        // If authenticated, go to dashboard home (not detail pages)
        if (isAuthenticated && technician) {
          setCurrentScreen('dashboard');
          setActivePage('home');
          setIsOnDetailPage(false);
        } else {
          // If not authenticated, go to welcome screen
          setCurrentScreen('welcome');
          setPhoneNumber('');
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, technician, updateInfo]);

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

  // Handle Android hardware back button
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If we're in the process of exiting, allow default behavior
      if (shouldExitAppRef.current) {
        return false;
      }
      
      // Hide loading modal if visible to prevent blocking Alert
      if (apiLoading) {
        hideLoading();
      }
      
      // Handle back navigation for login flow screens
      if (currentScreen === 'login') {
        // On login screen, show exit confirmation
        // Use setTimeout to ensure any modals are dismissed first
        setTimeout(() => {
          Alert.alert(
            'خروج از برنامه',
            'آیا می‌خواهید برنامه را ببندید؟',
            [
              {
                text: 'خیر',
                style: 'cancel',
                onPress: () => {}, // Do nothing, stay in app
              },
              {
                text: 'بله',
                style: 'destructive',
                onPress: () => {
                  // Set flag to allow exit
                  shouldExitAppRef.current = true;
                  // Dismiss alert and exit app
                  setTimeout(() => {
                    BackHandler.exitApp();
                  }, 100);
                },
              },
            ],
            { cancelable: true }
          );
        }, 150);
        return true; // Prevent default back behavior
      }
      if (currentScreen === 'password' || currentScreen === 'verification') {
        handleBack();
        return true; // Prevent default back behavior
      }
      // On dashboard detail pages (messages, service detail), navigate back
      if (currentScreen === 'dashboard' && isOnDetailPage && onDetailPageBackRef.current) {
        onDetailPageBackRef.current();
        return true; // Prevent default back behavior
      }
      // On dashboard main pages (home, reports, settings), show confirmation dialog
      if (currentScreen === 'dashboard' && !isOnDetailPage) {
        // Use setTimeout to ensure any modals are dismissed first
        setTimeout(() => {
          Alert.alert(
            'خروج از برنامه',
            'آیا می‌خواهید برنامه را ببندید؟',
            [
              {
                text: 'خیر',
                style: 'cancel',
                onPress: () => {}, // Do nothing, stay in app
              },
              {
                text: 'بله',
                style: 'destructive',
                onPress: () => {
                  // Set flag to allow exit
                  shouldExitAppRef.current = true;
                  // Dismiss alert and exit app
                  setTimeout(() => {
                    BackHandler.exitApp();
                  }, 100);
                },
              },
            ],
            { cancelable: true }
          );
        }, 150);
        return true; // Prevent default back behavior
      }
      // On welcome screen, show confirmation dialog before exiting
      if (currentScreen === 'welcome') {
        // Use setTimeout to ensure any modals are dismissed first
        setTimeout(() => {
          Alert.alert(
            'خروج از برنامه',
            'آیا می‌خواهید برنامه را ببندید؟',
            [
              {
                text: 'خیر',
                style: 'cancel',
                onPress: () => {}, // Do nothing, stay in app
              },
              {
                text: 'بله',
                style: 'destructive',
                onPress: () => {
                  // Set flag to allow exit
                  shouldExitAppRef.current = true;
                  // Dismiss alert and exit app
                  setTimeout(() => {
                    BackHandler.exitApp();
                  }, 100);
                },
              },
            ],
            { cancelable: true }
          );
        }, 150);
        return true; // Prevent default back behavior
      }
      return false;
    });

    return () => backHandler.remove();
  }, [currentScreen, handleBack, isOnDetailPage]);

  const handleNavigate = (page: 'reports' | 'home' | 'settings') => {
    setActivePage(page);
    // TODO: Implement page navigation logic
    // This can be extended to show different content based on the selected page
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
            onNavigate={handleNavigate}
            activePage={activePage}
            onDetailPageChange={setIsOnDetailPage}
            onDetailPageBackChange={(handler) => { onDetailPageBackRef.current = handler; }}
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

  // Block app if force update is required
  if (updateInfo?.visible && updateInfo.forceUpdate) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-white">
          <UpdateDialog
            visible={true}
            forceUpdate={true}
            description={updateInfo.description}
            latestVersion={updateInfo.latestVersion}
            currentVersion={updateInfo.currentVersion}
          />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        {renderCurrentScreen()}
        <StatusBar style="dark" />
        
        {/* Loading Modal for API requests */}
        <LoadingModal 
          visible={apiLoading} 
          message={loadingMessage}
        />

        {/* Update Dialog */}
        {updateInfo && (
          <UpdateDialog
            visible={updateInfo.visible}
            forceUpdate={updateInfo.forceUpdate}
            description={updateInfo.description}
            latestVersion={updateInfo.latestVersion}
            currentVersion={updateInfo.currentVersion}
            onClose={() => {
              // Only allow closing if it's not a force update
              if (!updateInfo.forceUpdate) {
                setUpdateInfo({ ...updateInfo, visible: false });
                setForceUpdateActive(false);
              }
            }}
          />
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
                  fontFamily: 'Vazirmatn-Bold', 
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
                  fontFamily: 'Vazirmatn-Regular', 
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
                    fontFamily: 'Vazirmatn-Bold',
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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      const startTime = Date.now();
      const MIN_SPLASH_DURATION = 2000; // Minimum 2 seconds
      
      try {
        // Small delay to ensure React Native is fully initialized
        // This allows our custom splash screen to render first
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Wait a bit more for custom splash to fully render
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Hide the default native splash screen on Android/iOS
        // This reveals our custom splash screen component underneath
        if (Platform.OS !== 'web') {
          try {
            await SplashScreen.hideAsync();
          } catch (error) {
            console.warn('Error hiding splash screen:', error);
          }
        }
        
        // Load fonts
        await Font.loadAsync(fonts);
        
        // Calculate elapsed time and ensure minimum 2 seconds
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_SPLASH_DURATION - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        setAppIsReady(true);
      } catch (error) {
        console.warn('Error during app initialization:', error);
        
        // Ensure minimum 2 seconds even on error
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_SPLASH_DURATION - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Continue even if initialization fails
        if (Platform.OS !== 'web') {
          try {
            await SplashScreen.hideAsync();
          } catch (error) {
            console.warn('Error hiding splash screen:', error);
          }
        }
        setAppIsReady(true);
      }
    }
    
    prepare();
  }, []);

  // Show custom splash screen while app is loading
  if (!appIsReady) {
    return (
      <SafeAreaProvider>
        <CustomSplashScreen visible={true} />
      </SafeAreaProvider>
    );
  }

  return (
    <AuthProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}