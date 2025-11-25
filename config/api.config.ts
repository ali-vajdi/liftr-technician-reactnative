/**
 * API Configuration
 * 
 * Update the BASE_URL when deploying to production or using a different environment
 */

export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: 'http://127.0.0.1:8000/api',
  // BASE_URL: 'https://app.liftr.ir/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Enable debug mode to show OTP codes
  DEBUG: __DEV__, // true in development, false in production
};

// API Endpoints
export const API_ENDPOINTS = {
  TECHNICIAN: {
    LOGIN: '/technician/login',
    SEND_OTP: '/technician/send-otp',
    VERIFY_OTP: '/technician/verify-otp',
    LOGOUT: '/technician/logout',
    CHECK_AUTH: '/technician/check-auth',
    PROFILE: '/technician/profile',
    REPORTS: '/technician/reports',
    CHECK_UPDATE: '/technician/check-update',
    MESSAGES: '/technician/messages',
    MESSAGES_UNREAD_COUNT: '/technician/messages/unread-count',
    MESSAGE_MARK_READ: (messageId: number) => `/technician/messages/${messageId}/mark-read`,
    MESSAGES_MARK_ALL_READ: '/technician/messages/mark-all-read',
  },
  ASSIGNED_BUILDINGS: '/technician/services/assigned-buildings',
  SERVICE_DETAIL: (serviceId: number) => `/technician/services/${serviceId}`,
  SUBMIT_CHECKLIST: (serviceId: number) => `/technician/services/${serviceId}/submit-checklist`,
};

