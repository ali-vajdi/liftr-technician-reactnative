import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

// Loading management
let loadingCallback: ((show: boolean, message?: string) => void) | null = null;
let activeRequests = 0;

export const setLoadingCallback = (callback: (show: boolean, message?: string) => void) => {
  loadingCallback = callback;
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
  (response) => {
    // Hide loading on success
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

