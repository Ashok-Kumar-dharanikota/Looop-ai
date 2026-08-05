import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  ReceiptText,
  Plus,
  Target,
  User,
} from 'lucide-react-native';

export type TabType = 'home' | 'transactions' | 'add' | 'goals' | 'profile';

interface BottomTabBarProps {
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onAddPress?: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = 'home',
  onTabPress,
  onAddPress,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const bg = isDark ? '#09090B' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#EAEAEA';
  const activeColor = isDark ? '#FFFFFF' : '#0F0F14';
  const inactiveColor = isDark ? '#71717A' : '#A1A1AA';
  const addBtnBg = isDark ? '#FFFFFF' : '#0F0F14';
  const addBtnIconColor = isDark ? '#0F0F14' : '#FFFFFF';

  const handlePress = (tab: TabType) => {
    if (tab === 'add') {
      if (onAddPress) {
        onAddPress();
      } else if (onTabPress) {
        onTabPress('add');
      }
    } else if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabRow}>
        {/* 1. Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress('home')}
          style={styles.tabItem}
        >
          <Home
            size={22}
            color={activeTab === 'home' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'home' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'home' ? activeColor : inactiveColor },
              activeTab === 'home' && styles.activeTabLabel,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* 2. Transactions */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress('transactions')}
          style={styles.tabItem}
        >
          <ReceiptText
            size={22}
            color={activeTab === 'transactions' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'transactions' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'transactions' ? activeColor : inactiveColor },
              activeTab === 'transactions' && styles.activeTabLabel,
            ]}
          >
            Transactions
          </Text>
        </TouchableOpacity>

        {/* 3. Add Expense Center Button (+ ) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handlePress('add')}
          style={styles.addTabItem}
        >
          <View style={[styles.addSquare, { backgroundColor: addBtnBg }]}>
            <Plus size={24} color={addBtnIconColor} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* 4. Goals */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress('goals')}
          style={styles.tabItem}
        >
          <Target
            size={22}
            color={activeTab === 'goals' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'goals' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'goals' ? activeColor : inactiveColor },
              activeTab === 'goals' && styles.activeTabLabel,
            ]}
          >
            Goals
          </Text>
        </TouchableOpacity>

        {/* 5. Profile */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress('profile')}
          style={styles.tabItem}
        >
          <User
            size={22}
            color={activeTab === 'profile' ? activeColor : inactiveColor}
            strokeWidth={activeTab === 'profile' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'profile' ? activeColor : inactiveColor },
              activeTab === 'profile' && styles.activeTabLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 100,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  addTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginTop: -8,
  },
  addSquare: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
