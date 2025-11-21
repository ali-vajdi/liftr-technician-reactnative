import React from 'react';
import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native';

interface UpdateDialogProps {
  visible: boolean;
  forceUpdate: boolean;
  description: string;
  latestVersion: string;
  currentVersion: string;
  onClose?: () => void;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  visible,
  forceUpdate,
  description,
  latestVersion,
  currentVersion,
  onClose,
}) => {
  const handleUpdate = () => {
    // Open Play Store for Android
    Linking.openURL('market://details?id=com.liftrir.technicianapp').catch(() => {
      // Fallback to web Play Store
      Linking.openURL('https://play.google.com/store/apps/details?id=com.liftrir.technicianapp');
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={forceUpdate ? undefined : onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
          {/* Header with colored background */}
          <View style={{
            backgroundColor: forceUpdate ? '#EF4444' : '#F59E0B',
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
                {forceUpdate ? '⚠' : 'ℹ'}
              </Text>
            </View>
            
            <Text style={{ 
              fontSize: 22, 
              fontFamily: 'YekanBakhFaNum-Bold', 
              color: 'white',
              textAlign: 'center',
              marginBottom: 8
            }}>
              {forceUpdate ? 'به‌روزرسانی اجباری' : 'به‌روزرسانی موجود است'}
            </Text>

            <Text style={{ 
              fontSize: 14, 
              fontFamily: 'YekanBakhFaNum-Regular', 
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center'
            }}>
              نسخه فعلی: {currentVersion} → نسخه جدید: {latestVersion}
            </Text>
          </View>
          
          {/* Message content */}
          <View style={{ padding: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontFamily: 'YekanBakhFaNum-Regular', 
              color: '#4B5563', 
              textAlign: 'center',
              lineHeight: 26,
              marginBottom: 24
            }}>
              {description || 'نسخه جدیدی از برنامه در دسترس است. لطفاً برنامه را به‌روزرسانی کنید.'}
            </Text>
            
            <TouchableOpacity
              onPress={handleUpdate}
              activeOpacity={0.8}
              style={{
                backgroundColor: forceUpdate ? '#EF4444' : '#F59E0B',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: forceUpdate ? '#EF4444' : '#F59E0B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
                marginBottom: forceUpdate ? 0 : 12
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: 17, 
                fontFamily: 'YekanBakhFaNum-Bold',
                letterSpacing: 0.5
              }}>
                به‌روزرسانی
              </Text>
            </TouchableOpacity>

            {!forceUpdate && onClose && (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 12
                }}
              >
                <Text style={{ 
                  color: '#6B7280', 
                  fontSize: 17, 
                  fontFamily: 'YekanBakhFaNum-Bold',
                  letterSpacing: 0.5
                }}>
                  بعداً
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

