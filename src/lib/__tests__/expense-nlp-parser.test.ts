import { parseExpenseText, CategoryItem } from '../expense-nlp-parser';

const TEST_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Food & Dining', iconName: 'Utensils', color: '#EF4444', bg: '#FEE2E2' },
  { id: '2', name: 'Transport', iconName: 'Car', color: '#0284C7', bg: '#E0F2FE' },
  { id: '3', name: 'Shopping', iconName: 'ShoppingBag', color: '#D97706', bg: '#FEF3C7' },
  { id: '4', name: 'Bills & Utilities', iconName: 'CreditCard', color: '#9333EA', bg: '#F3E8FF' },
  { id: '5', name: 'Entertainment', iconName: 'Film', color: '#EC4899', bg: '#FCE7F3' },
  { id: '6', name: 'Groceries & Cafe', iconName: 'Coffee', color: '#16A34A', bg: '#DCFCE7' },
  { id: '7', name: 'Travel & Trips', iconName: 'Plane', color: '#4F46E5', bg: '#E0E7FF' },
  { id: '8', name: 'Health & Care', iconName: 'HeartPulse', color: '#059669', bg: '#D1FAE5' },
];

const testCases = [
  {
    input: 'Paid ₹450 for lunch at Subway via UPI',
    expectedAmount: 450,
    expectedCategory: 'Food & Dining',
    expectedPayment: 'UPI (GPay / PhonePe)',
  },
  {
    input: '1200 groceries yesterday with credit card',
    expectedAmount: 1200,
    expectedCategory: 'Groceries & Cafe',
    expectedPayment: 'Credit Card',
    expectedTime: 'Yesterday',
  },
  {
    input: '350 uber cab cash',
    expectedAmount: 350,
    expectedCategory: 'Transport',
    expectedPayment: 'Cash',
  },
  {
    input: 'Starbucks coffee 220',
    expectedAmount: 220,
    expectedCategory: 'Groceries & Cafe',
  },
  {
    input: 'Electricity bill 2.4k net banking',
    expectedAmount: 2400,
    expectedCategory: 'Bills & Utilities',
    expectedPayment: 'Net Banking',
  },
  {
    input: 'Bought zara clothes for 3500 on cc',
    expectedAmount: 3500,
    expectedCategory: 'Shopping',
    expectedPayment: 'Credit Card',
  },
];

console.log('--- Running NLP Expense Parser Tests ---');
let allPassed = true;

for (const tc of testCases) {
  const result = parseExpenseText(tc.input, TEST_CATEGORIES);
  console.log(`\nInput: "${tc.input}"`);
  console.log(` -> Amount: ₹${result.amount}, Category: ${result.category?.name}, Merchant: "${result.merchant}", Payment: "${result.paymentMethod}", Time: "${result.timeLabel}"`);

  if (tc.expectedAmount !== undefined && result.amount !== tc.expectedAmount) {
    console.error(`❌ Amount mismatch: Expected ${tc.expectedAmount}, got ${result.amount}`);
    allPassed = false;
  }
  if (tc.expectedCategory !== undefined && result.category?.name !== tc.expectedCategory) {
    console.error(`❌ Category mismatch: Expected ${tc.expectedCategory}, got ${result.category?.name}`);
    allPassed = false;
  }
  if (tc.expectedPayment !== undefined && result.paymentMethod !== tc.expectedPayment) {
    console.error(`❌ Payment mismatch: Expected ${tc.expectedPayment}, got ${result.paymentMethod}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n✅ All NLP Parser test cases passed successfully!');
} else {
  console.error('\n❌ Some test cases failed.');
  process.exit(1);
}
