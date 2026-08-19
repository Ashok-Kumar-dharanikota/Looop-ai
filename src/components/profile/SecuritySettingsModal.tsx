import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import {
  X,
  Shield,
  ScanFace,
  Fingerprint,
  Lock,
  Crown,
  Clock,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/use-app-store';
import { useUserStore } from '@/store/use-user-store';
import {
  checkBiometricsSupport,
  authenticateWithBiometrics,
  type BiometricCheckResult,
} from '@/services/biometrics';

interface SecuritySettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TIMEOUT_OPTIONS = [
  { label: 'Immediately', seconds: 0 },
  { label: 'After 1 minute', seconds: 60 },
  { label: 'After 5 minutes', seconds: 300 },
];

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPremium = useUserStore((state) => state.isPremium);

  const {
    biometricsEnabled,
    biometricType,
    lockTimeoutSeconds,
    setBiometricsEnabled,
    setBiometricType,
    setLockTimeoutSeconds,
  } = useAppStore();

  const [bioInfo, setBioInfo] = useState<BiometricCheckResult>({
    hasHardware: false,
    isEnrolled: false,
    biometricType: 'fingerprint',
    biometricName: 'Fingerprint Lock',
  });

  useEffect(() => {
    if (visible) {
      checkBiometricsSupport().then((res) => {
        setBioInfo(res);
        setBiometricType('fingerprint');
      });
    }
  }, [visible]);

  const handleToggleBiometrics = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Looop Pro Feature',
        'Fingerprint Lock is an exclusive Looop Pro feature to keep your financial records confidential.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View Pro Plans',
            style: 'default',
            onPress: () => {
              onClose();
              router.push('/paywall' as any);
            },
          },
        ]
      );
      return;
    }

    if (value) {
      // Test biometric verification before enabling
      const res = await authenticateWithBiometrics(
        'Confirm your fingerprint to enable App Lock'
      );
      if (res.success) {
        setBiometricsEnabled(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      setBiometricsEnabled(false);
    }
  };

  const handleSelectTimeout = (seconds: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLockTimeoutSeconds(seconds);
  };

  const BiometricIcon = Fingerprint;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Shield size={20} color="#7C3AED" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Security & Fingerprint</Text>
              <Text style={styles.headerSubtitle}>
                Fingerprint App Lock Shield
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Pro Banner if Not Premium */}
          {!isPremium ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onClose();
                router.push('/paywall' as any);
              }}
              style={styles.proUpgradeBanner}
            >
              <LinearGradient
                colors={['#7C3AED', '#9333EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.proBannerGradient}
              >
                <View style={styles.proBannerIconBox}>
                  <Crown size={22} color="#FBBF24" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.proPillRow}>
                    <Text style={styles.proBannerTitle}>LOOOP PRO EXCLUSIVE</Text>
                  </View>
                  <Text style={styles.proBannerSub}>
                    Unlock Fingerprint App Lock & protect your transaction history
                  </Text>
                </View>
                <ChevronRight size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.proActiveBadge}>
              <Crown size={14} color="#D97706" />
              <Text style={styles.proActiveText}>LOOOP PRO ACTIVE • FINGERPRINT SECURITY</Text>
            </View>
          )}

          {/* Main Toggle Card */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleIconCircle}>
                <BiometricIcon size={24} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  Fingerprint Lock
                </Text>
                <Text style={styles.toggleSub}>
                  Require fingerprint verification when opening or resuming Looop
                </Text>
              </View>

              <Switch
                value={isPremium && biometricsEnabled}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: '#E2E8F0', true: '#C084FC' }}
                thumbColor={isPremium && biometricsEnabled ? '#7C3AED' : '#F8FAFC'}
              />
            </View>
          </View>

          {/* Lock Delay Timeout Card (When Enabled) */}
          {isPremium && biometricsEnabled && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>REQUIRE AUTHENTICATION</Text>
              <View style={styles.card}>
                {TIMEOUT_OPTIONS.map((opt, idx) => {
                  const isSelected = lockTimeoutSeconds === opt.seconds;
                  return (
                    <React.Fragment key={opt.seconds}>
                      {idx > 0 && <View style={styles.divider} />}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelectTimeout(opt.seconds)}
                        style={styles.timeoutRow}
                      >
                        <View style={styles.timeoutLeft}>
                          <Clock
                            size={16}
                            color={isSelected ? '#7C3AED' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.timeoutLabel,
                              isSelected && styles.timeoutLabelSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          )}

          {/* Hardware & Privacy Notice */}
          <View style={styles.privacyNoteBox}>
            <Sparkles size={16} color="#7C3AED" />
            <Text style={styles.privacyNoteText}>
              Your fingerprint data is processed entirely on-device by your device Secure Enclave. Looop never stores or transmits biometric records.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  proUpgradeBanner: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  proBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  proBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proPillRow: {
    marginBottom: 2,
  },
  proBannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.8,
  },
  proBannerSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  proActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  proActiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  sectionBox: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  timeoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  timeoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeoutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  timeoutLabelSelected: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  privacyNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B21A8',
    lineHeight: 18,
  },
});
