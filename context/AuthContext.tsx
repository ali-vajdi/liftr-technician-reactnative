import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { Technician } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  technician: Technician | null;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<{ message: string }>;
  sendOtp: (phoneNumber: string) => Promise<{ message: string; otp_code?: string }>;
  verifyOtp: (phoneNumber: string, otpCode: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await authService.getToken();
      if (token) {
        const storedTechnician = await authService.getTechnician();
        if (storedTechnician) {
          setIsAuthenticated(true);
          setTechnician(storedTechnician);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setTechnician(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    const response = await authService.login(phoneNumber, password);
    setIsAuthenticated(true);
    setTechnician(response.technician);
    return { message: response.message };
  };

  const sendOtp = async (phoneNumber: string) => {
    return await authService.sendOtp(phoneNumber);
  };

  const verifyOtp = async (phoneNumber: string, otpCode: string) => {
    const response = await authService.verifyOtp(phoneNumber, otpCode);
    setIsAuthenticated(true);
    setTechnician(response.technician);
    return { message: response.message };
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setTechnician(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        technician,
        isLoading,
        login,
        sendOtp,
        verifyOtp,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

