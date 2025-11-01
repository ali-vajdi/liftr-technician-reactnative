import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';
import type { AssignedBuildingsResponse, ServiceDetailResponse } from '../types';

/**
 * Fetch assigned buildings for the authenticated technician
 */
export const getAssignedBuildings = async (): Promise<AssignedBuildingsResponse> => {
  try {
    const response = await apiClient.get<AssignedBuildingsResponse>(
      API_ENDPOINTS.ASSIGNED_BUILDINGS
    );
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

/**
 * Fetch service detail by service ID
 */
export const getServiceDetail = async (serviceId: number): Promise<ServiceDetailResponse> => {
  try {
    const response = await apiClient.get<ServiceDetailResponse>(
      API_ENDPOINTS.SERVICE_DETAIL(serviceId)
    );
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

/**
 * Handle API errors and extract meaningful error messages
 */
const handleError = (error: any): Error => {
  if (error.response) {
    let errorMessage = 'خطای سرور';
    
    if (error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors[0] || errorMessage;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    }
    return new Error(errorMessage);
  } else if (error.request) {
    return new Error('خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
  } else {
    return new Error(error.message || 'خطای نامشخص');
  }
};

