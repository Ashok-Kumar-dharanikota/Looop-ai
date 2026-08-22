import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sparkles, Globe, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { LanguageSelectionModal } from './LanguageSelectionModal';

export const BrandHeader = memo(function BrandHeader() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleOpenLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLangModalVisible(true);
  };

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.headerContainer}>
      <View style={styles.logoRow}>
        <View style={styles.brandLeft}>
          <Text style={styles.logoText}>Looop</Text>
          <View style={styles.sparkleBadge}>
            <Sparkles size={14} color="#FF6B00" />
          </View>
        </View>

        {/* Language Switcher Pill */}
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={handleOpenLanguage}
          style={styles.langPill}
          accessibilityRole="button"
          accessibilityLabel="Change App Language"
        >
          <Globe size={13} color="#EA580C" />
          <Text style={styles.langFlag}>{activeLang.flag}</Text>
          <Text style={styles.langCode}>{activeLang.code.toUpperCase()}</Text>
          <ChevronDown size={12} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <Text style={styles.mainHeading}>
        {t('auth.mainHeading', 'Mindful spending.\nEffortless clarity.')}
      </Text>

      <Text style={styles.subHeading}>
        {t(
          'auth.subHeading',
          'A personal finance companion that transforms your daily cashflow into lasting wealth and mindful habits.'
        )}
      </Text>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 23,
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  sparkleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  langFlag: {
    fontSize: 13,
  },
  langCode: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11.5,
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  mainHeading: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 27,
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subHeading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
