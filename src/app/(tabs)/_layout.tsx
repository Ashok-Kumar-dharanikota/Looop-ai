import { Tabs, useRouter } from 'expo-router';
import { Home, Plus, ReceiptText, Target, User } from 'lucide-react-native';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeColors, AppFonts } from '@/constants/theme';

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeColor = ThemeColors.primary; // '#FF6B00' Sunset Amber
  const inactiveColor = ThemeColors.textMuted; // '#94A3B8'
  const bg = ThemeColors.card; // '#FFFFFF'
  const borderColor = ThemeColors.border; // '#E2E8F0'
  const addBtnBg = ThemeColors.primary;
  const addBtnIconColor = '#FFFFFF';

  // Dynamic bottom padding accounting for native Android buttons & iOS home bar
  const bottomInset = insets.bottom;
  const bottomPadding = bottomInset > 0 ? bottomInset + 6 : (Platform.OS === 'android' ? 16 : 10);
  const tabHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: AppFonts.jakarta.bold,
          fontSize: 10.5,
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <ReceiptText size={size} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="add"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/record-expense');
          },
        })}
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={[styles.addBtn, { backgroundColor: addBtnBg }]}>
              <Plus size={24} color={addBtnIconColor} strokeWidth={2.6} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

