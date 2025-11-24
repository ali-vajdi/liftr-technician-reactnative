import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import type { Technician } from '../../types';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  technician: Technician | null;
  phoneNumber: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  onLogout,
  technician,
  phoneNumber,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClose = () => {
    // Animate out to the right before closing
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      // Immediately set to off-screen position (right side)
      slideAnim.setValue(300);
      // Small delay to ensure the value is applied before animating
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 10);
    } else if (!visible && isAnimating) {
      // Reset position when closing
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim, isAnimating]);

  if (!visible && !isAnimating) {
    return null;
  }

  return (
    <Modal
      visible={visible || isAnimating}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Overlay */}
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        {/* Sidebar - Opens from right to left */}
        <Animated.View 
          style={{ 
            width: 300, 
            backgroundColor: 'white', 
            height: '100%',
            transform: [{ translateX: slideAnim }],
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView 
              style={{ flex: 1 }} 
              showsVerticalScrollIndicator={false}
            >
              {/* Header Section - Minimal */}
              <View style={{ 
                backgroundColor: '#0077B6', 
                paddingHorizontal: 20, 
                paddingTop: 24,
                paddingBottom: 20,
                borderBottomLeftRadius: 20
              }}>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <View style={{ 
                    backgroundColor: 'rgba(255,255,255,0.25)', 
                    borderRadius: 30, 
                    width: 60, 
                    height: 60, 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: 'white'
                      }} />
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={handleClose}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.25)', 
                      borderRadius: 18, 
                      width: 36, 
                      height: 36, 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={{ 
                  color: 'white', 
                  fontSize: 20, 
                  fontFamily: 'YekanBakhFaNum-Bold', 
                  marginBottom: 4, 
                  textAlign: 'right' 
                }}>
                  {technician?.full_name || technician?.name || 'تکنیسین'}
                </Text>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: 14, 
                  fontFamily: 'YekanBakhFaNum-Regular', 
                  textAlign: 'right'
                }}>
                  {phoneNumber}
                </Text>
              </View>

              {/* User Info - Minimal Layout */}
              <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                {/* Status Badge - Compact */}
                <View style={{ 
                  backgroundColor: technician?.has_credentials ? '#ECFDF5' : '#F3F4F6',
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                  borderRightWidth: 3,
                  borderRightColor: technician?.has_credentials ? '#10B981' : '#9CA3AF'
                }}>
                  <Text style={{ 
                    color: technician?.has_credentials ? '#065F46' : '#4B5563',
                    fontSize: 12,
                    fontFamily: 'YekanBakhFaNum-Bold',
                    textAlign: 'right'
                  }}>
                    {technician?.has_credentials ? '✓ تایید شده' : 'در انتظار تایید'}
                  </Text>
                </View>

                {/* Info Items - Minimal List */}
                <View style={{ gap: 12 }}>
                  {(technician?.first_name || technician?.last_name) && (
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                      <Text style={{ 
                        color: '#1F2937',
                        fontSize: 15,
                        fontFamily: 'YekanBakhFaNum-Bold',
                        textAlign: 'right'
                      }}>
                        {technician.first_name} {technician.last_name}
                      </Text>
                      <Text style={{ 
                        color: '#9CA3AF',
                        fontSize: 12,
                        fontFamily: 'YekanBakhFaNum-Regular',
                        textAlign: 'left'
                      }}>
                        نام
                      </Text>
                    </View>
                  )}

                  {technician?.national_id && (
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                      <Text style={{ 
                        color: '#1F2937',
                        fontSize: 15,
                        fontFamily: 'YekanBakhFaNum-Bold',
                        textAlign: 'right'
                      }}>
                        {technician.national_id}
                      </Text>
                      <Text style={{ 
                        color: '#9CA3AF',
                        fontSize: 12,
                        fontFamily: 'YekanBakhFaNum-Regular',
                        textAlign: 'left'
                      }}>
                        کد ملی
                      </Text>
                    </View>
                  )}

                  {(technician?.organization_name || technician?.organization) && (
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                      <Text style={{ 
                        color: '#1F2937',
                        fontSize: 15,
                        fontFamily: 'YekanBakhFaNum-Bold',
                        textAlign: 'right',
                        flex: 1
                      }}>
                        {technician.organization_name || technician.organization?.name || 'نامشخص'}
                      </Text>
                      <Text style={{ 
                        color: '#9CA3AF',
                        fontSize: 12,
                        fontFamily: 'YekanBakhFaNum-Regular',
                        textAlign: 'left',
                        marginLeft: 8
                      }}>
                        شرکت
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                    <Text style={{ 
                      color: '#1F2937',
                      fontSize: 15,
                      fontFamily: 'YekanBakhFaNum-Bold',
                      textAlign: 'right'
                    }}>
                      #{technician?.id ? technician.id : '---'}
                    </Text>
                    <Text style={{ 
                      color: '#9CA3AF',
                      fontSize: 12,
                      fontFamily: 'YekanBakhFaNum-Regular',
                      textAlign: 'left'
                    }}>
                      شناسه
                    </Text>
                  </View>
                </View>
              </View>

              {/* Logout Button - Minimal */}
              <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}>
                <TouchableOpacity
                  onPress={onLogout}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderRadius: 12,
                    paddingVertical: 14,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#FEE2E2'
                  }}
                >
                  <Ionicons 
                    name="log-out-outline" 
                    size={20} 
                    color="#DC2626" 
                    style={{ marginLeft: 8 }} 
                  />
                  <Text style={{ color: '#DC2626', fontSize: 15, fontFamily: 'YekanBakhFaNum-Bold' }}>
                    خروج
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

