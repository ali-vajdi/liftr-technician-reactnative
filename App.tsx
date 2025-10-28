import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { PasswordScreen } from './screens/PasswordScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { fonts } from './fonts.config';
import './global.css';

type AppState = 'welcome' | 'login' | 'password' | 'verification' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fonts);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }
    
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  const handleGetStarted = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen('password');
  };

  const handlePasswordLogin = (password: string) => {
    // Here you would typically validate the password with your backend
    // For now, we'll accept any password and proceed to dashboard
    console.log('Password login:', password);
    setCurrentScreen('dashboard');
  };

  const handleSwitchToOTP = () => {
    setCurrentScreen('verification');
  };

  const handleVerify = (code: string) => {
    // Here you would typically verify the code with your backend
    // For now, we'll accept any 6-digit code and proceed to dashboard
    console.log('Verification code:', code);
    setCurrentScreen('dashboard');
  };

  const handleResendCode = () => {
    // Here you would typically resend the verification code
    console.log('Resending code to:', phoneNumber);
  };

  const handleLogout = () => {
    setPhoneNumber('');
    setCurrentScreen('welcome');
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

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        {renderCurrentScreen()}
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}