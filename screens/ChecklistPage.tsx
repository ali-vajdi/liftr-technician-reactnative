import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ChecklistItem } from '../types';

export interface SavedDescription {
  checklistId: number;
  title: string;
  description: string;
}

interface ChecklistPageProps {
  buildingName: string;
  elevatorName: string;
  checklistItems: ChecklistItem[];
  descriptionChecklists: ChecklistItem[];
  savedDescriptions: SavedDescription[];
  isVerified: boolean;
  onAddDescription: (description: SavedDescription) => void;
  onDeleteDescription: (index: number) => void;
  onToggleVerification: (verified: boolean) => void;
  onNext: () => void;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({ 
  buildingName, 
  elevatorName,
  checklistItems,
  descriptionChecklists,
  savedDescriptions,
  isVerified,
  onAddDescription,
  onDeleteDescription,
  onToggleVerification,
  onNext 
}) => {
  const [showDescriptionListModal, setShowDescriptionListModal] = useState(false);
  const [showCustomDescriptionModal, setShowCustomDescriptionModal] = useState(false);
  const [customDescription, setCustomDescription] = useState('');

  const toggleVerification = () => {
    onToggleVerification(!isVerified);
  };

  const handleAddDescriptionClick = () => {
    setShowDescriptionListModal(true);
  };

  const handleSelectDescriptionChecklist = (item: ChecklistItem) => {
    const newDescription: SavedDescription = {
      checklistId: item.id,
      title: item.title,
      description: '', // Empty description, only title is shown
    };
    onAddDescription(newDescription);
    setShowDescriptionListModal(false);
  };

  const handleSelectOther = () => {
    setShowDescriptionListModal(false);
    setShowCustomDescriptionModal(true);
    setCustomDescription('');
  };

  const handleSaveCustomDescription = () => {
    if (!customDescription.trim()) {
      Alert.alert('خطا', 'لطفاً توضیحات را وارد کنید');
      return;
    }
``
    const newDescription: SavedDescription = {
      checklistId: 0, // Custom descriptions have no checklist ID
      title: customDescription.trim(), // User's custom text as title
      description: '', // Empty description for custom entries
    };
    onAddDescription(newDescription);
    setShowCustomDescriptionModal(false);
    setCustomDescription('');
  };

  const handleDeleteDescription = (index: number) => {
    onDeleteDescription(index);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
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
          fontFamily: 'Vazirmatn-Regular',
          color: '#9CA3AF',
          textAlign: 'right',
          marginBottom: 6,
        }}>
          مشخصات ساختمان
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: 'Vazirmatn-Bold',
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
            fontFamily: 'Vazirmatn-Regular',
            color: '#9CA3AF',
            textAlign: 'right',
            marginBottom: 6,
          }}>
            نام آسانسور
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Vazirmatn-Bold',
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
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {checklistItems.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'flex-start',
                paddingVertical: 14,
                borderBottomWidth: index < checklistItems.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#EFF6FF',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
                flexShrink: 0,
              }}>
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'Vazirmatn-Bold',
                  color: '#0077B6',
                }}>
                  {item.order}
                </Text>
              </View>
              <Text style={{
                flex: 1,
                fontSize: 15,
                fontFamily: 'Vazirmatn-Regular',
                color: '#1F2937',
                textAlign: 'right',
                lineHeight: 24,
              }}>
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Saved Descriptions List */}
      {savedDescriptions.length > 0 && (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Vazirmatn-Bold',
            color: '#1F2937',
            textAlign: 'right',
            marginBottom: 12,
          }}>
            توضیحات ثبت شده
          </Text>
          {savedDescriptions.map((desc, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'flex-start',
                paddingVertical: 12,
                borderBottomWidth: index < savedDescriptions.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <TouchableOpacity
                onPress={() => handleDeleteDescription(index)}
                activeOpacity={0.7}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#FEF2F2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Vazirmatn-Bold',
                  color: '#0077B6',
                  textAlign: 'right',
                  marginBottom: desc.description ? 4 : 0,
                }}>
                  {desc.title}
                </Text>
                {desc.description && (
                  <Text style={{
                    fontSize: 13,
                    fontFamily: 'Vazirmatn-Regular',
                    color: '#6B7280',
                    textAlign: 'right',
                    lineHeight: 20,
                  }}>
                    {desc.description}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add Description Button */}
      <TouchableOpacity
        onPress={handleAddDescriptionClick}
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
        <Ionicons name="add-circle-outline" size={20} color="#0077B6" style={{ marginLeft: 8 }} />
        <Text style={{
          fontSize: 15,
          fontFamily: 'Vazirmatn-Bold',
          color: '#0077B6',
        }}>
          افزودن توضیحات
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
          fontFamily: 'Vazirmatn-Regular',
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
          <Ionicons name="arrow-back" size={20} color="white" style={{ marginLeft: 8 }} />
          <Text style={{
            fontSize: 15,
            fontFamily: 'Vazirmatn-Bold',
            color: 'white',
          }}>
            مرحله بعد
          </Text>
        </TouchableOpacity>
      )}

      {/* Description List Modal */}
      <Modal
        visible={showDescriptionListModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDescriptionListModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowDescriptionListModal(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '100%',
              maxWidth: 400,
              maxHeight: '80%',
            }}
          >
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Vazirmatn-Bold',
                color: '#1F2937',
                textAlign: 'right',
              }}>
                انتخاب مورد توضیحات
              </Text>
              <TouchableOpacity
                onPress={() => setShowDescriptionListModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
              {descriptionChecklists.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectDescriptionChecklist(item)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                >
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                    flexShrink: 0,
                  }}>
                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'Vazirmatn-Bold',
                      color: '#0077B6',
                    }}>
                      {item.order}
                    </Text>
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: 15,
                    fontFamily: 'Vazirmatn-Regular',
                    color: '#1F2937',
                    textAlign: 'right',
                  }}>
                    {item.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                </TouchableOpacity>
              ))}
              {/* سایر (Other) Option */}
              <TouchableOpacity
                onPress={handleSelectOther}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#E5E7EB',
                  backgroundColor: '#F9FAFB',
                }}
              >
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                  flexShrink: 0,
                }}>
                  <Ionicons name="create-outline" size={16} color="#6B7280" />
                </View>
                <Text style={{
                  flex: 1,
                  fontSize: 15,
                  fontFamily: 'Vazirmatn-Bold',
                  color: '#0077B6',
                  textAlign: 'right',
                }}>
                  سایر
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Custom Description Modal */}
      <Modal
        visible={showCustomDescriptionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCustomDescriptionModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowCustomDescriptionModal(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Vazirmatn-Bold',
                color: '#1F2937',
                textAlign: 'right',
              }}>
                افزودن سایر توضیحات
              </Text>
              <TouchableOpacity
                onPress={() => setShowCustomDescriptionModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{
              fontSize: 14,
              fontFamily: 'Vazirmatn-Regular',
              color: '#6B7280',
              textAlign: 'right',
              marginBottom: 8,
            }}>
              توضیحات خود را وارد کنید:
            </Text>

            <TextInput
              value={customDescription}
              onChangeText={setCustomDescription}
              placeholder="توضیحات را اینجا بنویسید..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 14,
                fontSize: 15,
                fontFamily: 'Vazirmatn-Regular',
                color: '#1F2937',
                textAlign: 'right',
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                minHeight: 100,
                marginBottom: 16,
              }}
            />

            <View style={{
              flexDirection: 'row-reverse',
              gap: 12,
            }}>
              <TouchableOpacity
                onPress={() => setShowCustomDescriptionModal(false)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontFamily: 'Vazirmatn-Bold',
                  color: '#6B7280',
                }}>
                  انصراف
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveCustomDescription}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: '#0077B6',
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontFamily: 'Vazirmatn-Bold',
                  color: 'white',
                }}>
                  ثبت
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

