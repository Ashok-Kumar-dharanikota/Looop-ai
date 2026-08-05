import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  Crown,
  Shield,
  CreditCard,
  Bell,
  Download,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const ProfileTab: React.FC = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textPrimary = isDark ? '#FFFFFF' : '#0F0F14';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? '#13131A' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#EAEAEA';
  const iconBtnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F4F4F7';

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>A</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: textPrimary }]}>Alex Johnson</Text>
            <View style={styles.proBadge}>
              <Crown size={10} color="#FFFFFF" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={[styles.userEmail, { color: textSecondary }]}>alex.j@looop.app</Text>
        </View>
      </View>

      {/* Pro Membership Banner */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/paywall')}
        style={[styles.proBanner, { backgroundColor: cardBg, borderColor: '#C084FC' }]}
      >
        <View style={styles.proIconBox}>
          <Crown size={20} color="#C084FC" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.proTitle, { color: textPrimary }]}>Savio Pro Member</Text>
          <Text style={[styles.proSub, { color: textSecondary }]}>
            Unlimited AI insights, voice logging & vaults
          </Text>
        </View>
        <ChevronRight size={18} color="#C084FC" />
      </TouchableOpacity>

      {/* Settings Menu Sections */}
      <View style={styles.menuSection}>
        <Text style={[styles.menuTitle, { color: textSecondary }]}>PREFERENCES</Text>

        <View style={[styles.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <TouchableOpacity style={styles.menuItem}>
            <CreditCard size={18} color={textPrimary} />
            <Text style={[styles.menuItemText, { color: textPrimary }]}>Connected Bank Accounts</Text>
            <ChevronRight size={16} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: iconBtnBg }]} />

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={18} color={textPrimary} />
            <Text style={[styles.menuItemText, { color: textPrimary }]}>Security & Face ID</Text>
            <ChevronRight size={16} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: iconBtnBg }]} />

          <TouchableOpacity style={styles.menuItem}>
            <Bell size={18} color={textPrimary} />
            <Text style={[styles.menuItemText, { color: textPrimary }]}>Notifications & Alerts</Text>
            <ChevronRight size={16} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: iconBtnBg }]} />

          <TouchableOpacity style={styles.menuItem}>
            <Download size={18} color={textPrimary} />
            <Text style={[styles.menuItemText, { color: textPrimary }]}>Export Expense Data (CSV)</Text>
            <ChevronRight size={16} color={textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.menuTitle, { color: textSecondary }]}>SUPPORT</Text>

        <View style={[styles.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={18} color={textPrimary} />
            <Text style={[styles.menuItemText, { color: textPrimary }]}>Help & Support</Text>
            <ChevronRight size={16} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: iconBtnBg }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/')}
          >
            <LogOut size={18} color="#EF4444" />
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C084FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C084FC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
    marginBottom: 24,
  },
  proIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  proSub: {
    fontSize: 12,
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
});
