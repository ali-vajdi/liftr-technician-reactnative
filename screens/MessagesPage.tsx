import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import messageService from '../services/messageService';
import type { Message } from '../types';
import { toPersianDigits } from '../utils/numberUtils';

interface MessagesPageProps {
  onBack?: () => void;
  onMessagesRead?: () => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ onBack, onMessagesRead }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await messageService.getMessages();
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری پیام‌ها');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await loadMessages(true);
  };

  const handleMarkMessageAsRead = async (messageId: number) => {
    try {
      // Optimistically update the UI
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
        )
      );

      // Call the API
      await messageService.markMessageAsRead(messageId);
      
      // Notify parent to refresh unread count
      if (onMessagesRead) {
        onMessagesRead();
      }
    } catch (error: any) {
      // Revert on error
      await loadMessages(true);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await messageService.markAllAsRead();
      // Reload messages to get updated read status
      await loadMessages(true);
      
      // Notify parent to refresh unread count
      if (onMessagesRead) {
        onMessagesRead();
      }
    } catch (error: any) {
      setError('خطا در علامت‌گذاری همه پیام‌ها به عنوان خوانده شده');
    } finally {
      setMarkingAll(false);
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.is_read).length;
  };

  const renderHeader = () => {
    const unreadCount = getUnreadCount();
    return (
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
          <Text style={{
            fontSize: 22,
            fontFamily: 'YekanBakhFaNum-Bold',
            color: '#1F2937',
            textAlign: 'right',
          }}>
            پیام‌ها
          </Text>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              disabled={markingAll}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: '#0077B6',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 6,
              }}
              activeOpacity={0.7}
            >
              {markingAll ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="checkmark-done-outline" size={16} color="white" />
              )}
              <Text style={{
                fontSize: 13,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: 'white',
              }}>
                خواندن همه
              </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
              <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
            </View>
            <Text className="text-gray-400 text-lg font-yekan text-center">
              در حال بارگذاری...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-gray-700 text-lg font-yekan-bold text-center mt-4 mb-2">
              خطا در بارگذاری
            </Text>
            <Text className="text-gray-400 text-base font-yekan text-center mb-6">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => loadMessages()}
              style={{
                backgroundColor: '#0077B6',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'YekanBakhFaNum-Bold',
              }}>
                تلاش مجدد
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
          <View className="items-center">
            <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
              <Ionicons name="mail-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-700 text-lg font-yekan-bold text-center mb-2">
              پیامی یافت نشد
            </Text>
            <Text className="text-gray-400 text-base font-yekan text-center">
              در حال حاضر پیامی برای شما وجود ندارد
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}

      <ScrollView 
        className="flex-1" 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 90 + insets.bottom, 
          paddingHorizontal: 20, 
          paddingTop: 24 
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0077B6']}
              tintColor="#0077B6"
            />
          ) : undefined
        }
      >
        {/* Messages List */}
        <View style={{ gap: 12 }}>
          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              activeOpacity={0.7}
              onPress={() => {
                if (!message.is_read) {
                  handleMarkMessageAsRead(message.id);
                }
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: message.is_read ? '#F3F4F6' : '#0077B6',
                borderLeftWidth: message.is_read ? 1 : 4,
                borderLeftColor: message.is_read ? '#F3F4F6' : '#0077B6',
              }}
            >
              {/* Header: Subject and Date */}
              <View style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{
                    fontSize: 17,
                    fontFamily: 'YekanBakhFaNum-Bold',
                    color: '#1F2937',
                    textAlign: 'right',
                    marginBottom: 4,
                  }}>
                    {message.subject}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'YekanBakhFaNum-Regular',
                    color: '#9CA3AF',
                    textAlign: 'right',
                  }}>
                    {toPersianDigits(message.created_at_jalali)}
                  </Text>
                </View>
                {!message.is_read && (
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#0077B6',
                  }} />
                )}
              </View>

              {/* Sender Name */}
              <View style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="person-outline" size={16} color="#9CA3AF" style={{ marginLeft: 6 }} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'YekanBakhFaNum-Regular',
                  color: '#6B7280',
                  textAlign: 'right',
                }}>
                  {message.sender_name}
                </Text>
              </View>

              {/* Message Content */}
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Regular',
                color: '#4B5563',
                textAlign: 'right',
                lineHeight: 24,
                marginBottom: 12,
              }}>
                {message.message}
              </Text>

              {/* Service Info (if available) */}
              {message.service && (
                <View style={{
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#F3F4F6',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                }}>
                </View>
              )}

              {/* Read Status */}
              {message.is_read && message.read_at_jalali && (
                <View style={{
                  marginTop: 8,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                }}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'YekanBakhFaNum-Regular',
                    color: '#10B981',
                    textAlign: 'right',
                  }}>
                    خوانده شده در {toPersianDigits(message.read_at_jalali)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

