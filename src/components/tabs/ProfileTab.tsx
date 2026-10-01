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
import {
  restorePurchases,
  presentCustomerCenterModal,
  logOutRevenueCat,
} from '@/services/purchases';
import { FinancialProfileModal } from '@/components/profile/FinancialProfileModal';
import { SecuritySettingsModal } from '@/components/profile/SecuritySettingsModal';
import { NotificationsSettingsModal } from '@/components/profile/NotificationsSettingsModal';
import { EmailAuthModal } from '@/components/profile/EmailAuthModal';
import { ThemeColors, AppFonts } from '@/constants/theme';

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
  const [showEmailAuthModal, setShowEmailAuthModal] = useState(false);

  const isAuthenticated = isFbAuth || isStoreAuth;
  const isGuestUser = isGuest || (!isAuthenticated && !fbUser);

  const handleUpgradeGuestAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowEmailAuthModal(true);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            clearUser();
            queryClient.clear();
            await Promise.allSettled([signOut(), logOutRevenueCat()]);
          } catch (err) {
            console.warn('Sign out warning:', err);
          } finally {
            router.replace('/' as any);
          }
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
    try {
      const txs = transactions || [];
      if (txs.length === 0) {
        Alert.alert('No Transactions', 'There are no transactions to export.');
        return;
      }

      const headers = 'ID,Date,Timestamp,Category,Amount,Description,CreatedAt,UpdatedAt\n';
      const rows = txs
        .map((t) =>
          `"${t.id}","${t.date}","${t.timestamp}","${t.category}",${t.amount},"${(t.description || '').replace(/"/g, '""')}","${t.createdAt}","${t.updatedAt}"`
        )
        .join('\n');

      const csvContent = headers + rows;
      await Share.share({
        message: csvContent,
        title: `Looop_Transactions_${new Date().toISOString().slice(0, 10)}.csv`,
      });
    } catch (err: any) {
      Alert.alert('Export Notice', err?.message || 'Unable to export CSV file.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Local Data',
      'This will erase all recorded transactions, goals, and local settings from this device. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All Data',
          style: 'destructive',
          onPress: async () => {
            await clearAllUserData();
            queryClient.clear();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Data Reset', 'All local expense and goal data has been cleared.');
          },
        },
      ]
    );
  };

  const handleRateApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        Alert.alert('Thank You! ⭐', 'We love having you as a mindful spender with Looop!');
      }
    } catch {
      Alert.alert('Thank You! ⭐', 'We love having you as a mindful spender with Looop!');
    }
  };

  const activeUser = fbUser || storeUser;
  const displayName = activeUser?.displayName || (isGuestUser ? 'Guest Explorer' : 'Mindful Spender');
  const email = activeUser?.email || (isGuestUser ? 'Guest Mode (Local Only)' : null);
  const avatarLetter = (displayName ? displayName.charAt(0) : 'U').toUpperCase();
  const photoURL = activeUser?.photoURL || null;

  const biometricBadgeText = !isPremium
    ? 'Pro Only'
    : biometricsEnabled
    ? biometricType === 'face'
      ? 'Face ID'
      : 'Active'
    : 'Off';

  const userSubtext = isGuestUser
    ? 'Guest Explorer • Stored securely on device'
    : email || 'Connected with Google • Cloud Sync Active';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        >
          <LinearGradient
            colors={['#38BDF8', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signInBanner}
          >
            <View style={styles.signInIconBox}>
              <UserPlus size={20} color="#0EA5E9" />
            </View>
            <View style={styles.signInContent}>
              <Text style={styles.signInTitle}>Create an Account</Text>
              <Text style={styles.signInSub}>
                Tap to sign in with email & sync your data
              </Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Pro Membership Banner (If Not Premium) */}
      {!isPremium && !isGuestUser && (
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/paywall' as any)}>
          <LinearGradient
            colors={['#FF6B00', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proBanner}
          >
            <View style={styles.proIconBox}>
              <Crown size={20} color="#FFFFFF" />
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
            <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
              <Target size={20} color={ThemeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Financial Profile & Goals</Text>
              <Text style={styles.menuItemSubtext}>Income, savings target & currency ({currencySymbol})</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
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
            <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
              <Fingerprint size={20} color={ThemeColors.emerald} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Security & Fingerprint</Text>
              <Text style={styles.menuItemSubtext}>App lock & biometric protection</Text>
            </View>
            <View style={[styles.badgePill, isPremium && biometricsEnabled ? styles.badgePillActive : styles.badgePillMuted]}>
              <Text style={[styles.badgePillText, isPremium && biometricsEnabled ? styles.badgePillTextActive : styles.badgePillTextMuted]}>
                {biometricBadgeText}
              </Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
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
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>DATA & SUPPORT</Text>

        <View style={styles.menuCard}>
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
                <ChevronRight size={16} color={ThemeColors.textMuted} />
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
                <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                  <RotateCcw size={20} color={ThemeColors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemText}>Restore Purchases</Text>
                  <Text style={styles.menuItemSubtext}>Restore previous Google Play purchases</Text>
                </View>
                <ChevronRight size={16} color={ThemeColors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />
            </>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleExportCSV}
          >
            <View style={[styles.iconContainer, { backgroundColor: ThemeColors.surface }]}>
              <Download size={20} color={ThemeColors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Export Expense Data (CSV)</Text>
              <Text style={styles.menuItemSubtext}>Share or backup your records</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleRateApp}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Star size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Rate Looop on App Store</Text>
              <Text style={styles.menuItemSubtext}>Support mindful financial building</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/privacy-policy' as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: ThemeColors.surface }]}>
              <ShieldCheck size={20} color={ThemeColors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Privacy Policy & Terms</Text>
              <Text style={styles.menuItemSubtext}>Local-first data guarantee & terms</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>ACCOUNT ACTIONS</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleResetData}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
              <RotateCcw size={20} color={ThemeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>Reset Local Expense Data</Text>
              <Text style={styles.menuItemSubtext}>Clear local transactions & goals</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {isAuthenticated && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleSignOut}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
                  <LogOut size={20} color={ThemeColors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemText}>Sign Out</Text>
                  <Text style={styles.menuItemSubtext}>Disconnect account from this device</Text>
                </View>
                <ChevronRight size={16} color={ThemeColors.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />
            </>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={20} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Account & Data</Text>
              <Text style={styles.menuItemSubtext}>Permanently delete account and all cloud data</Text>
            </View>
            <ChevronRight size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <FinancialProfileModal
        visible={showFinancialModal}
        onClose={() => setShowFinancialModal(false)}
      />

      <SecuritySettingsModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />

      <NotificationsSettingsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      <EmailAuthModal
        visible={showEmailAuthModal}
        onClose={() => setShowEmailAuthModal(false)}
      />

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
    backgroundColor: ThemeColors.canvas,
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
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
  },
  avatarText: {
    fontFamily: AppFonts.outfit.bold,
    fontSize: 24,
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
    fontFamily: AppFonts.outfit.bold,
    fontSize: 20,
    color: ThemeColors.textPrimary,
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
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10,
    color: '#D97706',
  },
  userSubtext: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12.5,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  signInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
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
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  signInSub: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 2,
  },
  proBannerTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  proBannerSub: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 12,
    color: '#FFF7ED',
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
    color: ThemeColors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: ThemeColors.card,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: ThemeColors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: AppFonts.jakarta.semiBold,
    fontSize: 14.5,
    color: ThemeColors.textPrimary,
  },
  menuItemSubtext: {
    fontFamily: AppFonts.inter.regular,
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  badgePillActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgePillBlue: {
    backgroundColor: '#E0F2FE',
  },
  badgePillMuted: {
    backgroundColor: ThemeColors.surface,
  },
  badgePillText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 10.5,
  },
  badgePillTextActive: {
    color: ThemeColors.emerald,
  },
  badgePillTextBlue: {
    color: '#0284C7',
  },
  badgePillTextMuted: {
    color: ThemeColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginLeft: 64,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontFamily: AppFonts.jakarta.bold,
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  versionSubtext: {
    fontFamily: AppFonts.inter.medium,
    fontSize: 11,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
});
