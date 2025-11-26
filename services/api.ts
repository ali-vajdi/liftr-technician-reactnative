import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

// Loading management
let loadingCallback: ((show: boolean, message?: string) => void) | null = null;
let activeRequests = 0;

// Force update blocking
let isForceUpdateActive = false;
let isUpdateCheckComplete = false;

export const setLoadingCallback = (callback: (show: boolean, message?: string) => void) => {
  loadingCallback = callback;
};

export const setForceUpdateActive = (active: boolean) => {
  isForceUpdateActive = active;
};

export const setUpdateCheckComplete = (complete: boolean) => {
  isUpdateCheckComplete = complete;
};

const showLoading = (message?: string) => {
  if (activeRequests === 0 && loadingCallback) {
    loadingCallback(true, message);
  }
  activeRequests++;
};

const hideLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0 && loadingCallback) {
    loadingCallback(false);
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor to add auth token and show loading
apiClient.interceptors.request.use(
  async (config) => {
    // Allow checkUpdate endpoint to always run (needed for initial update check)
    const isCheckUpdateEndpoint = config.url?.includes('/check-update');
    
    // Wait for update check to complete (with timeout to prevent infinite wait)
    if (!isCheckUpdateEndpoint && !isUpdateCheckComplete) {
      // Wait up to 10 seconds for update check to complete
      const maxWaitTime = 10000; // 10 seconds
      const checkInterval = 100; // Check every 100ms
      const startTime = Date.now();
      
      while (!isUpdateCheckComplete && (Date.now() - startTime) < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
      
      // If still not complete after timeout, allow the request (don't block forever)
      if (!isUpdateCheckComplete) {
        console.warn('Update check taking too long, allowing request to proceed');
      }
    }
    
    // Block all API calls if force update is active (except checkUpdate endpoint)
    if (isForceUpdateActive && !isCheckUpdateEndpoint) {
      return Promise.reject(new Error('App update required. Please update the app to continue.'));
    }

    // Show loading
    showLoading();

    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Silently handle token read errors
    }
    return config;
  },
  (error) => {
    // Hide loading on request error
    hideLoading();
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and hide loading
apiClient.interceptors.response.use(
  async (response) => {
    // Hide loading on success
    
    // Check if this is a profile API response and technician status is false
    const isProfileEndpoint = response.config.url?.includes('/profile');
    if (isProfileEndpoint && response.data?.data?.status === false && response.data?.data?.id) {
      // Technician status is disabled - clear auth data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('technician_data');
      // Throw error to trigger logout in components
      throw new Error('TECHNICIAN_STATUS_DISABLED');
    }
    
    hideLoading();
    return response;
  },
  async (error) => {
    // Hide loading on error
    hideLoading();
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('technician_data');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

