import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, InteractionManager, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getServiceDetail, submitChecklist, type SubmitChecklistPayload } from '../services/buildingService';
import type { ServiceDetail, ChecklistItem } from '../types';
import { ChecklistPage } from './ChecklistPage';
import { SignaturePage, type SignatureData } from './SignaturePage';

interface SavedDescription {
  checklistId: number;
  title: string;
  description: string;
}

type ChecklistFlowState = 
  | 'detail'
  | 'checklist'
  | 'manager-signature'
  | 'technician-signature';

interface ServiceDetailPageProps {
  serviceId: number;
  onBack: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, onBack }) => {
  const { technician } = useAuth();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [descriptionChecklists, setDescriptionChecklists] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<ChecklistFlowState>('detail');
  const [currentElevatorIndex, setCurrentElevatorIndex] = useState(0);
  // Store descriptions per elevator ID
  const [elevatorDescriptions, setElevatorDescriptions] = useState<Record<number, SavedDescription[]>>({});
  // Store verification state per elevator ID
  const [elevatorVerified, setElevatorVerified] = useState<Record<number, boolean>>({});
  // Store signature data
  const [managerSignature, setManagerSignature] = useState<SignatureData | null>(null);
  const [technicianSignature, setTechnicianSignature] = useState<SignatureData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadServiceDetail();
  }, [serviceId]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServiceDetail(serviceId);
      if (response.success && response.data) {
        setServiceDetail(response.data);
        // Store checklists if available
        if (response.checklists && Array.isArray(response.checklists)) {
          // Sort by order to ensure correct sequence
          const sortedChecklists = [...response.checklists].sort((a, b) => a.order - b.order);
          setChecklists(sortedChecklists);
        }
        // Store description checklists if available
        if (response.description_checklists && Array.isArray(response.description_checklists)) {
          // Sort by order to ensure correct sequence
          const sortedDescriptionChecklists = [...response.description_checklists].sort((a, b) => a.order - b.order);
          setDescriptionChecklists(sortedDescriptionChecklists);
        }
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری جزئیات سرویس');
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    if (!serviceDetail?.building?.selected_latitude || !serviceDetail?.building?.selected_longitude) {
      return;
    }
    const lat = serviceDetail.building.selected_latitude;
    const lng = serviceDetail.building.selected_longitude;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      // Handle error silently
    });
  };

  const makePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => {
      // Handle error silently
    });
  };

  const handleStartChecklist = () => {
    if (!serviceDetail?.building?.elevators || serviceDetail.building.elevators.length === 0) {
      return;
    }
    setCurrentElevatorIndex(0);
    setFlowState('checklist');
  };

  const handleChecklistNext = () => {
    const elevators = serviceDetail?.building?.elevators || [];
    if (currentElevatorIndex < elevators.length - 1) {
      // Move to next elevator checklist
      setCurrentElevatorIndex(currentElevatorIndex + 1);
      setFlowState('checklist');
    } else {
      // All elevators completed, go to manager signature
      setFlowState('manager-signature');
    }
  };

  const handleManagerSignatureNext = (signatureData?: SignatureData) => {
    if (!signatureData) {
      Alert.alert('خطا', 'لطفاً امضای نماینده/مدیر ساختمان را تکمیل کنید');
      return;
    }

    if (!signatureData.name || !signatureData.name.trim()) {
      Alert.alert('خطا', 'لطفاً نام نماینده/مدیر ساختمان را وارد کنید');
      return;
    }

    setManagerSignature(signatureData);
    setFlowState('technician-signature');
  };

  const handleTechnicianSignatureNext = async (signatureData?: SignatureData) => {
    if (!signatureData) {
      Alert.alert('خطا', 'لطفاً امضای سرویس کار را تکمیل کنید');
      return;
    }

    setTechnicianSignature(signatureData);

    // Submit checklist when technician signature is completed
    // Use the signatureData directly and managerSignature from state
    if (managerSignature) {
      await handleSubmitChecklist(managerSignature, signatureData);
    } else {
      Alert.alert('خطا', 'امضای نماینده/مدیر ساختمان یافت نشد. لطفاً دوباره تلاش کنید.');
      setFlowState('manager-signature');
    }
  };

  const handleSubmitChecklist = async (managerSig: SignatureData, technicianSig: SignatureData) => {
    if (!serviceDetail?.building?.elevators) {
      return;
    }

    // Validate that both signatures have names
    if (!managerSig.name || !managerSig.name.trim()) {
      Alert.alert('خطا', 'نام نماینده/مدیر ساختمان الزامی است');
      return;
    }

    if (!technicianSig.name || !technicianSig.name.trim()) {
      Alert.alert('خطا', 'نام سرویس کار الزامی است');
      return;
    }

    try {
      setIsSubmitting(true);

      // Build elevators payload
      const elevators = serviceDetail.building.elevators.map((elevator) => ({
        elevator_id: elevator.id,
        verified: elevatorVerified[elevator.id] || false,
        descriptions: (elevatorDescriptions[elevator.id] || []).map((desc) => ({
          checklist_id: desc.checklistId,
          title: desc.title,
          description: desc.description,
        })),
      }));

      const payload: SubmitChecklistPayload = {
        elevators,
        manager_signature: {
          name: managerSig.name.trim(),
          signature: managerSig.signature,
        },
        technician_signature: {
          name: technicianSig.name.trim(),
          signature: technicianSig.signature,
        },
      };

      const response = await submitChecklist(serviceId, payload);

      // Log response for debugging
      console.log('Checklist submission response:', JSON.stringify(response, null, 2));
      console.log('Response success:', response?.success);
      console.log('Response success type:', typeof response?.success);

      // Ensure we have a valid response
      if (!response) {
        throw new Error('پاسخ از سرور دریافت نشد');
      }

      // Check if response is successful - the API returns { success: true, data: {...} }
      const isSuccess = response.success === true;
      
      console.log('Is success check:', isSuccess);
      
      if (isSuccess) {
        // Reset submitting state first
        setIsSubmitting(false);
        
        console.log('Showing success alert...');
        
        // Function to handle success - reset state and close page
        const handleSuccess = () => {
          console.log('Alert button pressed, closing page...');
          // Reset all state
          setFlowState('detail');
          setCurrentElevatorIndex(0);
          setManagerSignature(null);
          setTechnicianSignature(null);
          setElevatorDescriptions({});
          setElevatorVerified({});
          // Close the service detail page and go back
          onBack();
        };

        // On web platform, use browser confirm as Alert.alert may not work properly
        if (Platform.OS === 'web') {
          setTimeout(() => {
            const confirmed = window.confirm('چک لیست با موفقیت ثبت شد و سرویس تکمیل گردید');
            if (confirmed) {
              handleSuccess();
            } else {
              // Even if user cancels, we should still close (successful submission)
              handleSuccess();
            }
          }, 100);
        } else {
          // Use a small delay to ensure React Native is ready to show the alert
          // This is especially important after async operations
          setTimeout(() => {
            try {
              Alert.alert(
                'تکمیل شد',
                'چک لیست با موفقیت ثبت شد و سرویس تکمیل گردید',
                [
                  {
                    text: 'باشه',
                    onPress: handleSuccess,
                  },
                ],
                { cancelable: false }
              );
              console.log('Alert.alert called');
            } catch (error) {
              console.error('Error showing alert:', error);
              // Fallback: directly close the page if alert fails
              handleSuccess();
            }
          }, 300);
        }
      } else {
        setIsSubmitting(false);
        const errorMsg = (response as any)?.message || 'خطا در ثبت چک لیست';
        console.log('Submission failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      Alert.alert('خطا', err.message || 'خطا در ثبت چک لیست. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlowBack = () => {
    switch (flowState) {
      case 'checklist':
        if (currentElevatorIndex > 0) {
          // Go back to previous elevator checklist
          setCurrentElevatorIndex(currentElevatorIndex - 1);
          setFlowState('checklist');
        } else {
          // On first elevator, go back to detail
          setFlowState('detail');
        }
        break;
      case 'manager-signature':
        // Go back to last elevator checklist
        const elevators = serviceDetail?.building?.elevators || [];
        setCurrentElevatorIndex(elevators.length - 1);
        setFlowState('checklist');
        break;
      case 'technician-signature':
        setFlowState('manager-signature');
        break;
      default:
        onBack();
    }
  };

  const getCurrentElevator = () => {
    const elevators = serviceDetail?.building?.elevators || [];
    return elevators[currentElevatorIndex];
  };

  const handleAddDescription = (elevatorId: number, description: SavedDescription) => {
    setElevatorDescriptions(prev => ({
      ...prev,
      [elevatorId]: [...(prev[elevatorId] || []), description],
    }));
  };

  const handleDeleteDescription = (elevatorId: number, index: number) => {
    setElevatorDescriptions(prev => ({
      ...prev,
      [elevatorId]: (prev[elevatorId] || []).filter((_, i) => i !== index),
    }));
  };

  const handleToggleVerification = (elevatorId: number, verified: boolean) => {
    setElevatorVerified(prev => ({
      ...prev,
      [elevatorId]: verified,
    }));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center" style={{ paddingBottom: 100 }}>
        <View className="items-center">
          <View className="bg-gray-100 rounded-3xl w-24 h-24 items-center justify-center mb-6">
            <View className="w-12 h-12 bg-gray-300 rounded-xl"></View>
          </View>
          <Text className="text-gray-400 text-lg font-yekan text-center">
            در حال بارگذاری...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !serviceDetail) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6" style={{ paddingBottom: 100 }}>
        <View className="items-center">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-gray-700 text-lg font-yekan-bold text-center mt-4 mb-2">
            خطا در بارگذاری
          </Text>
          <Text className="text-gray-400 text-base font-yekan text-center mb-6">
            {error || 'اطلاعاتی یافت نشد'}
          </Text>
        </View>
      </View>
    );
  }

  const building = serviceDetail.building;

  // Render flow states
  if (flowState === 'checklist') {
    const elevator = getCurrentElevator();
    if (!elevator) {
      setFlowState('detail');
      return null;
    }
    const elevators = serviceDetail?.building?.elevators || [];
    const elevatorNumber = currentElevatorIndex + 1;
    const totalElevators = elevators.length;
    const headerTitle = totalElevators > 1 
      ? `چک لیست - آسانسور ${elevatorNumber} از ${totalElevators}`
      : 'چک لیست';
    
    return (
      <>
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={handleFlowBack}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}
          >
            <Ionicons name="arrow-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'YekanBold',
            color: '#1F2937',
            textAlign: 'right',
            flex: 1,
          }}>
            {headerTitle}
          </Text>
        </View>
        <ChecklistPage
          key={`elevator-${elevator.id}-${currentElevatorIndex}`}
          buildingName={building.name}
          elevatorName={elevator.name}
          checklistItems={checklists}
          descriptionChecklists={descriptionChecklists}
          savedDescriptions={elevatorDescriptions[elevator.id] || []}
          isVerified={elevatorVerified[elevator.id] || false}
          onAddDescription={(description) => handleAddDescription(elevator.id, description)}
          onDeleteDescription={(index) => handleDeleteDescription(elevator.id, index)}
          onToggleVerification={(verified) => handleToggleVerification(elevator.id, verified)}
          onNext={handleChecklistNext}
        />
      </>
    );
  }

  if (flowState === 'manager-signature') {
    return (
      <>
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={handleFlowBack}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}
          >
            <Ionicons name="arrow-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'YekanBold',
            color: '#1F2937',
            textAlign: 'right',
            flex: 1,
          }}>
            امضای نماینده/مدیر ساختمان
          </Text>
        </View>
        <SignaturePage
          key="manager-signature"
          title="محل امضا نماینده/مدیر ساختمان"
          nameLabel="نام نماینده/مدیر ساختمان"
          showGenderSelector={false}
          onNext={handleManagerSignatureNext}
          onBack={handleFlowBack}
        />
      </>
    );
  }

  if (flowState === 'technician-signature') {
    return (
      <>
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={handleFlowBack}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}
          >
            <Ionicons name="arrow-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'YekanBold',
            color: '#1F2937',
            textAlign: 'right',
            flex: 1,
          }}>
            امضای سرویس کار
          </Text>
        </View>
        <SignaturePage
          key="technician-signature"
          title="محل امضا سرویس کار"
          nameLabel="نام سرویس کار"
          defaultName={technician?.full_name || `${technician?.first_name || ''} ${technician?.last_name || ''}`.trim() || technician?.name || ''}
          showGenderSelector={false}
          onNext={handleTechnicianSignatureNext}
          onBack={handleFlowBack}
        />
      </>
    );
  }

  // Default detail view
  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Main Info Card - Combined Building, Address, Manager */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        {/* Building Name & Status */}
        <View style={{ 
          flexDirection: 'row-reverse', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
              marginBottom: 6,
            }}>
              {building.name}
            </Text>
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
            }}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
              <Text style={{
                fontSize: 13,
                fontFamily: 'Yekan',
                color: '#6B7280',
                textAlign: 'right',
              }}>
                {serviceDetail.service_date_text}
              </Text>
            </View>
          </View>
          <View style={{
            backgroundColor: '#EFF6FF',
            borderRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 12,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: 'YekanBold',
              color: '#0077B6',
            }}>
              {serviceDetail.status_text}
            </Text>
          </View>
        </View>

        {/* Address Section */}
        <TouchableOpacity
          onPress={openMap}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'flex-start',
            paddingTop: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#F3F4F6',
            marginBottom: 16,
          }}
        >
          <View style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}>
            <Ionicons name="location" size={20} color="#0077B6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 15,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
              marginBottom: 4,
            }}>
              {building.address}
            </Text>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Yekan',
              color: '#6B7280',
              textAlign: 'right',
            }}>
              {building.city.name}، {building.province.name}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Manager Section */}
        <View style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ECFDF5',
            borderRadius: 12,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}>
            <Ionicons name="person" size={22} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Yekan',
              color: '#9CA3AF',
              textAlign: 'right',
              marginBottom: 4,
            }}>
              مدیر ساختمان
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: 'YekanBold',
              color: '#1F2937',
              textAlign: 'right',
            }}>
              {building.manager_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => makePhoneCall(building.manager_phone)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              backgroundColor: '#F0FDF4',
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: '#D1FAE5',
            }}
          >
            <Ionicons name="call" size={18} color="#10B981" style={{ marginLeft: 6 }} />
            <Text style={{
              fontSize: 14,
              fontFamily: 'YekanBold',
              color: '#065F46',
              textAlign: 'right',
            }}>
              {building.manager_phone}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Elevators Section */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: 'YekanBold',
          color: '#1F2937',
          textAlign: 'right',
          marginBottom: 10,
          marginHorizontal: 4,
        }}>
          آسانسورها
        </Text>
        <View style={{ gap: 10 }}>
          {building.elevators.map((elevator) => (
            <View
              key={elevator.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: '#F3F4F6',
              }}
            >
              <View style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'YekanBold',
                  color: '#1F2937',
                  textAlign: 'right',
                }}>
                  آسانسور {elevator.name}
                </Text>
                <View style={{
                  backgroundColor: elevator.status ? '#ECFDF5' : '#FEF2F2',
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'YekanBold',
                    color: elevator.status ? '#065F46' : '#991B1B',
                  }}>
                    {elevator.status ? 'فعال' : 'غیرفعال'}
                  </Text>
                </View>
              </View>

              <View style={{
                flexDirection: 'row-reverse',
                gap: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Yekan',
                    color: '#9CA3AF',
                    textAlign: 'right',
                    marginBottom: 4,
                  }}>
                    تعداد توقف
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'YekanBold',
                    color: '#1F2937',
                    textAlign: 'right',
                  }}>
                    {elevator.stops_count}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Yekan',
                    color: '#9CA3AF',
                    textAlign: 'right',
                    marginBottom: 4,
                  }}>
                    ظرفیت
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'YekanBold',
                    color: '#1F2937',
                    textAlign: 'right',
                  }}>
                    {elevator.capacity} نفر
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Register Checklist Button */}
      <TouchableOpacity
        onPress={handleStartChecklist}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#0077B6',
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row-reverse',
          shadowColor: '#0077B6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginLeft: 8 }} />
        <Text style={{
          fontSize: 15,
          fontFamily: 'YekanBold',
          color: 'white',
        }}>
          ثبت چک لیست
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

