import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignaturePad, SignaturePadRef } from '../components/ui/SignaturePad';
import { convertSignatureToBase64 } from '../utils/signatureUtils';

export interface SignatureData {
  name: string;
  signature: string; // base64 encoded image or SVG string
}

interface SignaturePageProps {
  title: string;
  nameLabel: string;
  defaultName?: string;
  showGenderSelector?: boolean;
  onNext: (signatureData?: SignatureData) => void;
  onBack: () => void;
}

export const SignaturePage: React.FC<SignaturePageProps> = ({
  title,
  nameLabel,
  defaultName = '',
  showGenderSelector = true,
  onNext,
  onBack,
}) => {
  const [name, setName] = useState(defaultName);
  const [titlePrefix, setTitlePrefix] = useState('آقا');
  const [hasSignature, setHasSignature] = useState(false);
  const [isSignatureDisabled, setIsSignatureDisabled] = useState(false);
  const signaturePadRef = useRef<SignaturePadRef>(null);

  // Reset state when defaultName or title changes (for switching between manager/technician)
  useEffect(() => {
    setName(defaultName || '');
    setHasSignature(false);
    setIsSignatureDisabled(false);
    // Use setTimeout to ensure the ref is ready after component mounts/updates
    const timer = setTimeout(() => {
      if (signaturePadRef.current) {
        signaturePadRef.current.clearSignature();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [defaultName, title]);

  const handleSignatureChange = (hasSig: boolean) => {
    setHasSignature(hasSig);
  };

  const handleRegister = () => {
    if (hasSignature && signaturePadRef.current) {
      setIsSignatureDisabled(true);
    }
  };

  const handleNext = () => {
    if (isSignatureDisabled && signaturePadRef.current) {
      const signatureData = signaturePadRef.current.getSignatureData();
      if (signatureData) {
        const trimmedName = name.trim();
        if (!trimmedName) {
          Alert.alert('خطا', 'لطفاً نام را وارد کنید');
          return;
        }
        const signatureBase64 = convertSignatureToBase64(
          signatureData.paths,
          signatureData.width,
          signatureData.height
        );
        onNext({
          name: trimmedName,
          signature: signatureBase64,
        });
      } else {
        Alert.alert('خطا', 'لطفاً امضا را ثبت کنید');
      }
    } else {
      onNext();
    }
  };

  const handleRedo = () => {
    if (signaturePadRef.current && hasSignature) {
      signaturePadRef.current.clearLastPath();
      // Update hasSignature after clearing last path
      setTimeout(() => {
        const stillHasSignature = signaturePadRef.current?.hasSignature() || false;
        setHasSignature(stillHasSignature);
      }, 0);
    }
  };

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clearSignature();
      setIsSignatureDisabled(false);
      setHasSignature(false);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={{
        fontSize: 18,
        fontFamily: 'YekanBakhFaNum-Bold',
        color: '#1F2937',
        textAlign: 'right',
        marginBottom: 16,
      }}>
        {title}
      </Text>

      {/* Name Input Section */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        <Text style={{
          fontSize: 13,
          fontFamily: 'YekanBakhFaNum-Regular',
          color: '#9CA3AF',
          textAlign: 'right',
          marginBottom: 8,
        }}>
          {nameLabel}
        </Text>
        
        {/* Title Prefix Selector - Only show if showGenderSelector is true */}
        {showGenderSelector && (
          <View style={{
            flexDirection: 'row-reverse',
            gap: 8,
            marginBottom: 12,
          }}>
            <TouchableOpacity
              onPress={() => setTitlePrefix('آقا')}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: titlePrefix === 'آقا' ? '#EFF6FF' : '#F3F4F6',
                borderWidth: 1,
                borderColor: titlePrefix === 'آقا' ? '#0077B6' : '#E5E7EB',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: titlePrefix === 'آقا' ? '#0077B6' : '#6B7280',
              }}>
                آقا
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTitlePrefix('خانم')}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: titlePrefix === 'خانم' ? '#EFF6FF' : '#F3F4F6',
                borderWidth: 1,
                borderColor: titlePrefix === 'خانم' ? '#0077B6' : '#E5E7EB',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: titlePrefix === 'خانم' ? '#0077B6' : '#6B7280',
              }}>
                خانم
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Name Input */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="نام را وارد کنید"
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: defaultName ? '#F3F4F6' : '#F9FAFB',
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
            fontFamily: 'YekanBakhFaNum-Regular',
            color: '#1F2937',
            textAlign: 'right',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            opacity: defaultName ? 0.7 : 1,
          }}
          editable={!defaultName}
        />
      </View>

      {/* Signature Section */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
        overflow: 'hidden',
      }}>
        <View style={{ width: '100%' }}>
          <SignaturePad
            ref={signaturePadRef}
            onSignatureChange={handleSignatureChange}
            disabled={isSignatureDisabled}
            height={280}
          />
        </View>
        
        {/* Action Buttons - Sticky at bottom of signature section */}
        {!isSignatureDisabled && (
          <View style={{
            flexDirection: 'row-reverse',
            gap: 8,
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            backgroundColor: '#FAFAFA',
            width: '100%',
          }}>
            <TouchableOpacity
              onPress={handleRedo}
              activeOpacity={0.7}
              disabled={!hasSignature}
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                opacity: hasSignature ? 1 : 0.5,
              }}
            >
              <Ionicons name="arrow-undo" size={18} color="#6B7280" style={{ marginLeft: 6 }} />
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: '#6B7280',
              }}>
                امضای مجدد
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleClear}
              activeOpacity={0.7}
              disabled={!hasSignature}
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                opacity: hasSignature ? 1 : 0.5,
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#6B7280" style={{ marginLeft: 6 }} />
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: '#6B7280',
              }}>
                پاک کردن
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={!hasSignature}
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: hasSignature ? '#0077B6' : '#D1D5DB',
                borderRadius: 12,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" style={{ marginLeft: 6 }} />
              <Text style={{
                fontSize: 14,
                fontFamily: 'YekanBakhFaNum-Bold',
                color: 'white',
              }}>
                ثبت
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Next Button - Only enabled after signature is registered */}
      {isSignatureDisabled && (
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={!name.trim()}
          style={{
            backgroundColor: name.trim() ? '#0077B6' : '#D1D5DB',
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
          <Ionicons name="arrow-back" size={20} color="white" style={{ marginLeft: 8 }} />
          <Text style={{
            fontSize: 15,
            fontFamily: 'YekanBakhFaNum-Bold',
            color: 'white',
          }}>
            مرحله بعد
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

