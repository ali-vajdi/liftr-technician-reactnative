import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 20
      }}>
        <View style={{ 
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
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: '#EF4444',
            paddingTop: 32,
            paddingBottom: 24,
            paddingHorizontal: 24,
            alignItems: 'center'
          }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(255,255,255,0.25)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                backgroundColor: 'white',
                transform: [{ rotate: '45deg' }]
              }} />
            </View>
            
            <Text style={{ 
              fontSize: 22, 
              fontFamily: 'YekanBakhFaNum-Bold', 
              color: 'white',
              textAlign: 'center',
              marginBottom: 8
            }}>
              خروج از سیستم
            </Text>
          </View>
          
          {/* Content */}
          <View style={{ padding: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontFamily: 'YekanBakhFaNum-Regular', 
              color: '#4B5563', 
              textAlign: 'center',
              lineHeight: 26,
              marginBottom: 24
            }}>
              آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟
            </Text>
            
            <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#EF4444',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: 'white', fontSize: 17, fontFamily: 'YekanBakhFaNum-Bold' }}>
                  خروج
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={onCancel}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: '#4B5563', fontSize: 17, fontFamily: 'YekanBakhFaNum-Bold' }}>
                  انصراف
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

