import React, { memo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, Check, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { SUPPORTED_LANGUAGES, LanguageOption } from '@/i18n';

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelectionModal = memo(function LanguageSelectionModal({
  visible,
  onClose,
}: LanguageSelectionModalProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const handleSelect = (langCode: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLanguage(langCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <View style={styles.globeIconBox}>
                    <Globe size={16} color="#FF6B00" />
                  </View>
                  <Text style={styles.headerTitle}>Select Language</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Languages List */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              >
                {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => {
                  const isSelected = language === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      activeOpacity={0.75}
                      onPress={() => handleSelect(lang.code)}
                      style={[
                        styles.langItem,
                        isSelected && styles.langItemSelected,
                      ]}
                    >
                      <Text style={styles.langFlag}>{lang.flag}</Text>
                      <View style={styles.langTextCol}>
                        <Text
                          style={[
                            styles.langNativeName,
                            isSelected && styles.langNativeNameSelected,
                          ]}
                        >
                          {lang.nativeName}
                        </Text>
                        <Text style={styles.langEnglishName}>{lang.name}</Text>
                      </View>

                      <View
                        style={[
                          styles.checkCircle,
                          isSelected && styles.checkCircleSelected,
                        ]}
                      >
                        {isSelected && (
                          <Check size={13} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '75%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  globeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listContent: {
    paddingTop: 8,
    gap: 8,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  langItemSelected: {
    backgroundColor: '#FFFBF7',
    borderColor: '#FF6B00',
  },
  langFlag: {
    fontSize: 22,
  },
  langTextCol: {
    flex: 1,
    gap: 2,
  },
  langNativeName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14.5,
    color: '#0F172A',
  },
  langNativeNameSelected: {
    color: '#EA580C',
  },
  langEnglishName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
});
