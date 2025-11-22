import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';
import type { MessagesResponse, UnreadCountResponse, MarkReadResponse } from '../types';

const messageService = {
  /**
   * Get all messages for the authenticated technician
   */
  async getMessages(): Promise<MessagesResponse> {
    const response = await apiClient.get<MessagesResponse>(
      API_ENDPOINTS.TECHNICIAN.MESSAGES
    );
    return response.data;
  },

  /**
   * Get unread messages count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>(
      API_ENDPOINTS.TECHNICIAN.MESSAGES_UNREAD_COUNT
    );
    return response.data;
  },

  /**
   * Mark a specific message as read
   */
  async markMessageAsRead(messageId: number): Promise<MarkReadResponse> {
    const response = await apiClient.post<MarkReadResponse>(
      API_ENDPOINTS.TECHNICIAN.MESSAGE_MARK_READ(messageId)
    );
    return response.data;
  },

  /**
   * Mark all messages as read
   */
  async markAllAsRead(): Promise<MarkReadResponse> {
    const response = await apiClient.post<MarkReadResponse>(
      API_ENDPOINTS.TECHNICIAN.MESSAGES_MARK_ALL_READ
    );
    return response.data;
  },
};

export default messageService;

