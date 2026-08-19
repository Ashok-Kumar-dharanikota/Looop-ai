import { Tabs, useRouter } from 'expo-router';
import { Home, Plus, ReceiptText, Target, User } from 'lucide-react-native';
import { StyleSheet, useColorScheme, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = false; // Forced light theme

  const activeColor = '#7C3AED';
  const inactiveColor = '#94A3B8';
  const bg = '#FFFFFF';
  const borderColor = '#E2E8F0';
  const addBtnBg = '#7C3AED';
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
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <ReceiptText size={size} color={color} strokeWidth={2} />,
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
              <Plus size={24} color={addBtnIconColor} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
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
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
