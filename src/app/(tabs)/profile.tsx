import { ProfileTab } from '@/components/tabs/ProfileTab';
import { ScrollView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ProfileTab />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
});
