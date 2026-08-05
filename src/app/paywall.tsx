import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Sparkles, Check, Crown, Shield } from 'lucide-react-native';

import { SavingsAreaChart } from '@/components/onboarding/SavingsAreaChart';
import { VoiceExpenseLogger } from '@/components/onboarding/VoiceExpenseLogger';
import { EditorialBentoCard } from '@/components/onboarding/EditorialBentoCard';
import { bentoTransitionStyle } from './onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PaywallScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0F0F14';

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#09090B' : '#FAF9F5' },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={textColor} />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Crown size={18} color="#C084FC" />
          <Text style={[styles.headerTitle, { color: textColor }]}>Savio Pro</Text>
        </View>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bento Grid Header Tagline */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: textColor }]}>
            All-in-One AI Wealth Hub
          </Text>
          <Text style={[styles.subTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Everything unlocked. Skia Area Charts, Voice Expense Logger & Curated Wealth Guides.
          </Text>
        </Animated.View>

        {/* BENTO GRID OF SHARING CARDS */}
        <View style={styles.bentoGridContainer}>
          {/* Top Row: 2 Compact Split Bento Items */}
          <View style={styles.bentoRow}>
            {/* Bento Card 1: Savings Chart */}
            <Animated.View
              sharedTransitionTag="onboarding-card-1"
              sharedTransitionStyle={bentoTransitionStyle}
              style={styles.bentoHalfCard}
            >
              <SavingsAreaChart compact />
            </Animated.View>

            {/* Bento Card 2: Voice Logger */}
            <Animated.View
              sharedTransitionTag="onboarding-card-2"
              sharedTransitionStyle={bentoTransitionStyle}
              style={styles.bentoHalfCard}
            >
              <VoiceExpenseLogger compact />
            </Animated.View>
          </View>

          {/* Bottom Row: Wide Editorial Bento Item */}
          <Animated.View
            sharedTransitionTag="onboarding-card-3"
            sharedTransitionStyle={bentoTransitionStyle}
            style={styles.bentoFullCard}
          >
            <EditorialBentoCard compact />
          </Animated.View>
        </View>

        {/* Subscription Plan Tiers */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.plansContainer}>
          {/* Annual Plan */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedPlan('annual')}
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.selectedPlanCard,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                borderColor: selectedPlan === 'annual' ? '#C084FC' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
              },
            ]}
          >
            {selectedPlan === 'annual' && (
              <View style={styles.bestValueBadge}>
                <Sparkles size={10} color="#FFFFFF" />
                <Text style={styles.bestValueText}>SAVE 50%</Text>
              </View>
            )}

            <View style={styles.planCheckRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'annual' && styles.selectedRadioCircle,
                ]}
              >
                {selectedPlan === 'annual' && <Check size={12} color="#FFFFFF" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.planTitle, { color: textColor }]}>
                  Annual Membership
                </Text>
                <Text style={[styles.planSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  7 days free trial, then $59.88/yr ($4.99/mo)
                </Text>
              </View>
              <Text style={[styles.planPrice, { color: textColor }]}>$4.99<Text style={styles.pricePeriod}>/mo</Text></Text>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.selectedPlanCard,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                borderColor: selectedPlan === 'monthly' ? '#C084FC' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
              },
            ]}
          >
            <View style={styles.planCheckRow}>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'monthly' && styles.selectedRadioCircle,
                ]}
              >
                {selectedPlan === 'monthly' && <Check size={12} color="#FFFFFF" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.planTitle, { color: textColor }]}>
                  Monthly Membership
                </Text>
                <Text style={[styles.planSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Flexible monthly billing
                </Text>
              </View>
              <Text style={[styles.planPrice, { color: textColor }]}>$9.99<Text style={styles.pricePeriod}>/mo</Text></Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Primary CTA */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.ctaSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)' as any)}
            style={styles.subscribeBtn}
          >
            <Text style={styles.subscribeBtnText}>Start 7-Day Free Trial</Text>
          </TouchableOpacity>

          <View style={styles.guaranteeRow}>
            <Shield size={14} color="#9CA3AF" />
            <Text style={styles.guaranteeText}>
              No commitment. Cancel anytime in App Store.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  bentoGridContainer: {
    marginVertical: 16,
    gap: 12,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoHalfCard: {
    flex: 1,
  },
  bentoFullCard: {
    width: '100%',
  },
  plansContainer: {
    gap: 12,
    marginVertical: 12,
  },
  planCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    position: 'relative',
  },
  selectedPlanCard: {
    backgroundColor: 'rgba(192, 132, 252, 0.08)',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#C084FC',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bestValueText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioCircle: {
    backgroundColor: '#C084FC',
    borderColor: '#C084FC',
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  planSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  ctaSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  subscribeBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#C084FC',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  guaranteeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
