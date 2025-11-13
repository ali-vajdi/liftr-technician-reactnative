import React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message = 'در حال بارگذاری...',
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
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
          borderRadius: 20,
          padding: 32,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 200,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 12,
        }}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            fontFamily: 'YekanBakhFaNum-Regular',
            color: '#4B5563',
            textAlign: 'center'
          }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

