import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChecklistPageProps {
  buildingName: string;
  elevatorName: string;
  onNext: () => void;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({ 
  buildingName, 
  elevatorName, 
  onNext 
}) => {
  const [itemsChecked, setItemsChecked] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false]);
  const [isVerified, setIsVerified] = useState(false);

  const toggleItem = (index: number) => {
    const newChecked = [...itemsChecked];
    newChecked[index] = !newChecked[index];
    setItemsChecked(newChecked);
  };

  const toggleVerification = () => {
    setIsVerified(!isVerified);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Building Info */}
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
          fontFamily: 'Yekan',
          color: '#9CA3AF',
          textAlign: 'right',
          marginBottom: 6,
        }}>
          مشخصات ساختمان
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: 'YekanBold',
          color: '#1F2937',
          textAlign: 'right',
          marginBottom: 16,
        }}>
          {buildingName}
        </Text>
        <View style={{
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }}>
          <Text style={{
            fontSize: 13,
            fontFamily: 'Yekan',
            color: '#9CA3AF',
            textAlign: 'right',
            marginBottom: 6,
          }}>
            نام آسانسور
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'YekanBold',
            color: '#1F2937',
            textAlign: 'right',
          }}>
            {elevatorName}
          </Text>
        </View>
      </View>

      {/* Checklist Items */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        <ScrollView 
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={true}
        >
          {itemsChecked.map((checked, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleItem(index)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: index < itemsChecked.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <Text style={{
                flex: 1,
                fontSize: 15,
                fontFamily: 'Yekan',
                color: '#1F2937',
                textAlign: 'right',
                marginRight: 12,
              }}>
                {index + 1}
              </Text>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: checked ? '#0077B6' : '#D1D5DB',
                backgroundColor: checked ? '#0077B6' : 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {checked && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Description Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="document-text-outline" size={20} color="#0077B6" style={{ marginLeft: 8 }} />
        <Text style={{
          fontSize: 15,
          fontFamily: 'YekanBold',
          color: '#0077B6',
        }}>
          توضیحات
        </Text>
      </TouchableOpacity>

      {/* Verification Checkbox */}
      <TouchableOpacity
        onPress={toggleVerification}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: isVerified ? '#0077B6' : '#D1D5DB',
          backgroundColor: isVerified ? '#0077B6' : 'white',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 12,
        }}>
          {isVerified && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
        <Text style={{
          fontSize: 15,
          fontFamily: 'Yekan',
          color: '#1F2937',
          textAlign: 'right',
          flex: 1,
        }}>
          موارد فوق بررسی گردید
        </Text>
      </TouchableOpacity>

      {/* Next Button - Only show when verified */}
      {isVerified && (
        <TouchableOpacity
          onPress={onNext}
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
          <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
          <Text style={{
            fontSize: 15,
            fontFamily: 'YekanBold',
            color: 'white',
          }}>
            مرحله بعد
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

