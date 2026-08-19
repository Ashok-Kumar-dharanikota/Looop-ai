import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Share,
  ActivityIndicator,
} from 'react-native';
import {
  Shield,
  Bell,
  Download,
  FileText,
  ShieldCheck,
  ChevronRight,
  UserPlus,
  Settings,
  LogOut,
  Target,
  Crown,
  Lock,
  Sparkles,
  Trash2,
  RotateCcw,
  Star,
  CreditCard,
  Fingerprint,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { useAuth } from '@/hooks/use-auth';
import { useUserStore, useAppStore } from '@/store';
import { clearAllUserData } from '@/db';
import { useTransactions } from '@/hooks/use-database';
import { queryClient } from '@/lib/query-client';
import { restorePurchases, presentCustomerCenterModal } from '@/services/purchases';
import { FinancialProfileModal } from '@/components/profile/FinancialProfileModal';
import { SecuritySettingsModal } from '@/components/profile/SecuritySettingsModal';
import { NotificationsSettingsModal } from '@/components/profile/NotificationsSettingsModal';

export const ProfileTab: React.FC = () => {
  const router = useRouter();
  const { user: fbUser, isAuthenticated: isFbAuth, signOut, deleteAccount, signInWithGoogle, isSigningIn } = useAuth();
  const { user: storeUser, isAuthenticated: isStoreAuth, isGuest, isPremium, clearUser } = useUserStore();
  const { transactions } = useTransactions();
  const {
    currencySymbol,
    biometricsEnabled,
    biometricType,
    notificationsEnabled,
    dailyReminderTime,
    setHasCompletedOnboarding,
  } = useAppStore();

  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const isAuthenticated = isFbAuth || isStoreAuth;
  const isGuestUser = isGuest || (!isAuthenticated && !fbUser);

  const handleUpgradeGuestAccount = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        useUserStore.getState().setUser({
          uid: result.firebaseUser.uid,
          email: result.firebaseUser.email || result.googleUser?.email || null,
          displayName: result.firebaseUser.displayName || result.googleUser?.name || null,
          photoURL: result.firebaseUser.photoURL || result.googleUser?.photo || null,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Account Linked! 🎉',
          `Welcome, ${result.firebaseUser.displayName || 'User'}! Your expenses and insights are now linked to your Google Account with cloud sync.`
        );
      } else if (!result.cancelled && result.error) {
        Alert.alert('Sign-In Notice', result.error);
      }
    } catch (err: any) {
      Alert.alert('Sign-In Error', err?.message || 'Unable to connect Google account. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clearUser();
          await signOut();
          router.replace('/' as any);
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account & Data',
      'This will permanently delete your account, all recorded transactions, AI financial reports, and custom goals. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            try {
              if (fbUser) {
                await deleteAccount();
              }
              await clearAllUserData();
              queryClient.clear();
              clearUser();
              setHasCompletedOnboarding(false);
              router.replace('/' as any);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const res = await restorePurchases();
      if (res.success && res.isPro) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Purchases Restored', '🎉 Your Looop Pro subscription is active.');
      } else {
        Alert.alert('No Subscription Found', 'No active Pro subscription found for this Google Play account.');
      }
    } catch (err: any) {
      Alert.alert('Restore Failed', err?.message || 'Unable to restore purchases.');
    }
  };

  const handleExportCSV = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const txList = transactions || [];

    if (txList.length === 0) {
      Alert.alert('No Transactions Found', 'You do not have any recorded transactions to export yet.');
      return;
    }

    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount', 'Type', 'Time', 'Created At'];
    const rows = txList.map((t) => [
      `"${t.id}"`,
      `"${t.date || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${t.type}"`,
      `"${(t.timestamp || '').replace(/"/g, '""')}"`,
      `"${t.createdAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    try {
      await Share.share({
        title: 'Looop_Transactions.csv',
        message: csvContent,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.warn('Share error:', err);
    }
  };

  const handleRateApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      } else {
        Alert.alert('Thank You!', 'We appreciate your support using Looop.');
      }
    } catch (err) {
      console.warn('Store review notice:', err);
    }
  };

  const displayName =
    fbUser?.displayName || storeUser?.displayName || (isGuestUser ? 'Guest Account' : 'Looop User');
  const userSubtext =
    fbUser?.email || storeUser?.email || (isGuestUser ? 'Guest Mode • Data saved locally' : 'Google Account');
  const photoURL = fbUser?.photoURL || storeUser?.photoURL || null;
  const avatarLetter = (displayName ? displayName.charAt(0) : 'G').toUpperCase();

  const biometricBadgeText =
    isPremium && biometricsEnabled
      ? 'Active'
      : isPremium
      ? 'Off'
      : 'Pro';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Financial Profile Modal */}
      <FinancialProfileModal
        visible={showFinancialModal}
        onClose={() => setShowFinancialModal(false)}
      />

      {/* Security & Fingerprint Settings Modal */}
      <SecuritySettingsModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />

      {/* Notifications Settings Modal */}
      <NotificationsSettingsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      {/* User Header */}
      <View style={styles.userHeader}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatarImageLarge} />
        ) : (
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        )}

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{displayName}</Text>
            {isPremium && (
              <View style={styles.proCrownBadge}>
                <Crown size={12} color="#D97706" />
                <Text style={styles.proCrownText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.userSubtext}>{userSubtext}</Text>
        </View>
      </View>

      {/* Guest Sign In Banner (Only when in Guest Mode) */}
      {isGuestUser && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUpgradeGuestAccount}
          disabled={isSigningIn}
        >
          <LinearGradient
            colors={['#38BDF8', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signInBanner}
          >
            <View style={styles.signInIconBox}>
              {isSigningIn ? (
                <ActivityIndicator size="small" color="#0EA5E9" />
              ) : (
                <UserPlus size={20} color="#0EA5E9" />
              )}
            </View>
            <View style={styles.signInContent}>
              <Text style={styles.signInTitle}>
                {isSigningIn ? 'Signing in with Google...' : 'Create an Account'}
              </Text>
              <Text style={styles.signInSub}>
                {isSigningIn ? 'Connecting your account...' : 'Tap to sign in with Google & sync data'}
              </Text>
            </View>
            {!isSigningIn && <ChevronRight size={18} color="#FFFFFF" />}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Pro Membership Banner (If Not Premium) */}
      {!isPremium && !isGuestUser && (
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/paywall' as any)}>
          <LinearGradient
            colors={['#7C3AED', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proBanner}
          >
            <View style={styles.proIconBox}>
              <Crown size={20} color="#FBBF24" />
            </View>
            <View style={styles.signInContent}>
              <Text style={styles.proBannerTitle}>Upgrade to Looop Pro</Text>
              <Text style={styles.proBannerSub}>Fingerprint lock, voice logging & smart insights</Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Settings Menu Sections */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>PREFERENCES</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowFinancialModal(true);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
              <Target size={20} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Financial Profile & Goals</Text>
              <Text style={styles.menuItemSubtext}>Income, savings target & currency ({currencySymbol})</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Security & Fingerprint Lock */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSecurityModal(true);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EDE9FE' }]}>
              <Fingerprint size={20} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Security & Fingerprint</Text>
              <Text style={styles.menuItemSubtext}>App lock & fingerprint security</Text>
            </View>
            <View style={[styles.badgePill, isPremium && biometricsEnabled ? styles.badgePillActive : styles.badgePillMuted]}>
              <Text style={[styles.badgePillText, isPremium && biometricsEnabled ? styles.badgePillTextActive : styles.badgePillTextMuted]}>
                {biometricBadgeText}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Notifications & Alerts */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowNotificationsModal(true);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Bell size={20} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Notifications & Alerts</Text>
              <Text style={styles.menuItemSubtext}>Daily check-ins, budget limits & milestones</Text>
            </View>
            <View style={[styles.badgePill, notificationsEnabled ? styles.badgePillBlue : styles.badgePillMuted]}>
              <Text style={[styles.badgePillText, notificationsEnabled ? styles.badgePillTextBlue : styles.badgePillTextMuted]}>
                {notificationsEnabled ? dailyReminderTime : 'Off'}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>DATA & SUPPORT</Text>

        <View style={styles.menuCard}>
          {/* RevenueCat Customer Center (if Pro) or Upgrade option */}
          {isPremium ? (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  presentCustomerCenterModal();
                }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Crown size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemText}>Manage Subscription</Text>
                  <Text style={styles.menuItemSubtext}>Customer Center, plan details & billing</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.divider} />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleRestorePurchases}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <RotateCcw size={20} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemText}>Restore Purchases</Text>
                  <Text style={styles.menuItemSubtext}>Restore previous Google Play purchases</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.divider} />
            </>
          )}

          {/* Real CSV Export */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleExportCSV}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Download size={20} color="#0F172A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Export Expense Data (CSV)</Text>
              <Text style={styles.menuItemSubtext}>Share or backup your records</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Rate Looop App */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleRateApp}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Star size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Rate Looop</Text>
              <Text style={styles.menuItemSubtext}>Support us with a review</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/privacy-policy' as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
              <ShieldCheck size={20} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Privacy Policy</Text>
              <Text style={styles.menuItemSubtext}>Local-first data commitment</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Terms of Use */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/terms-of-use' as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
              <FileText size={20} color="#475569" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Terms of Use</Text>
              <Text style={styles.menuItemSubtext}>User agreement & conditions</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>ACCOUNT</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleSignOut}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
              <LogOut size={20} color="#475569" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>
                {isGuestUser ? 'Exit Guest Mode' : 'Sign Out'}
              </Text>
              <Text style={styles.menuItemSubtext}>
                {isGuestUser ? 'Switch account or sign in' : 'Log out of this device'}
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={20} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
                {isGuestUser ? 'Clear All Data & Reset' : 'Delete Account & Data'}
              </Text>
              <Text style={styles.menuItemSubtext}>
                Permanently wipe all records & profile
              </Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Looop • Version 1.0.0</Text>
        <Text style={styles.versionSubtext}>Private • Encrypted • Local-First Security</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  proCrownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  proCrownText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  userSubtext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  signInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  signInIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  proIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  signInContent: {
    flex: 1,
  },
  signInTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signInSub: {
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 2,
  },
  proBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  proBannerSub: {
    fontSize: 12,
    color: '#EDE9FE',
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuItemSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  badgePillActive: {
    backgroundColor: '#F3E8FF',
  },
  badgePillBlue: {
    backgroundColor: '#E0F2FE',
  },
  badgePillMuted: {
    backgroundColor: '#F1F5F9',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgePillTextActive: {
    color: '#7C3AED',
  },
  badgePillTextBlue: {
    color: '#0284C7',
  },
  badgePillTextMuted: {
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
});
