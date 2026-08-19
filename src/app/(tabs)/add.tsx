import { ChatExpenseTab } from '@/components/tabs/ChatExpenseTab';
import { StyleSheet, View } from 'react-native';

export default function AddExpenseScreen() {
  return (
    <View style={styles.container}>
      <ChatExpenseTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
