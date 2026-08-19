import {
  Utensils,
  Car,
  ShoppingBag,
  CreditCard,
  Film,
  Coffee,
  Plane,
  HeartPulse,
  Smartphone,
  Wallet,
  Banknote,
  Building2,
} from 'lucide-react-native';
import type { CategoryItem } from '@/lib/expense-nlp-parser';

export const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Food & Dining', icon: Utensils, iconName: 'Utensils', color: '#EF4444', bg: '#FEE2E2' },
  { id: '2', name: 'Transport', icon: Car, iconName: 'Car', color: '#0284C7', bg: '#E0F2FE' },
  { id: '3', name: 'Shopping', icon: ShoppingBag, iconName: 'ShoppingBag', color: '#D97706', bg: '#FEF3C7' },
  { id: '4', name: 'Bills & Utilities', icon: CreditCard, iconName: 'CreditCard', color: '#9333EA', bg: '#F3E8FF' },
  { id: '5', name: 'Entertainment', icon: Film, iconName: 'Film', color: '#EC4899', bg: '#FCE7F3' },
  { id: '6', name: 'Groceries & Cafe', icon: Coffee, iconName: 'Coffee', color: '#16A34A', bg: '#DCFCE7' },
  { id: '7', name: 'Travel & Trips', icon: Plane, iconName: 'Plane', color: '#4F46E5', bg: '#E0E7FF' },
  { id: '8', name: 'Health & Care', icon: HeartPulse, iconName: 'HeartPulse', color: '#059669', bg: '#D1FAE5' },
];

export const AMOUNT_PRESETS = ['50', '100', '200', '500', '1000', '2000'];
export const AMOUNT_INCREMENTS = [50, 100, 500, 1000];

export const TIME_PRESETS = [
  'Just now',
  '1 hour ago',
  'Morning • 9:00 AM',
  'Afternoon • 1:30 PM',
  'Evening • 7:00 PM',
  'Yesterday',
];

export const REASON_SUGGESTIONS = [
  'Lunch / Dinner',
  'Groceries',
  'Uber / Cab',
  'Coffee & Snacks',
  'Movie & Drinks',
  'Monthly Subscription',
  'Online Shopping',
  'Pharmacy',
];

export const CATEGORY_REASON_SUGGESTIONS: Record<string, string[]> = {
  'Food & Dining': ['Theobroma', 'Swiggy', 'Zomato', 'Local Bakery', 'Subway', 'McDonalds', 'Restaurant', 'Cafe'],
  'Transport': ['Uber', 'Ola', 'Rapido', 'Auto Fare', 'Metro', 'Petrol / Fuel', 'Parking'],
  'Shopping': ['Amazon', 'Flipkart', 'Myntra', 'Zara', 'Clothing Store', 'Mall', 'Electronics'],
  'Bills & Utilities': ['Electricity Bill', 'WiFi / Broadband', 'Mobile Recharge', 'House Rent', 'Water Bill'],
  'Entertainment': ['Netflix', 'PVR Cinemas', 'Spotify', 'Prime Video', 'BookMyShow', 'Gaming'],
  'Groceries & Cafe': ['Blinkit', 'Zepto', 'Instamart', 'Starbucks', 'Local Kirana', 'Dairy & Milk', 'Bakery'],
  'Travel & Trips': ['Hotel Booking', 'Flight Ticket', 'Train Fare', 'Cab', 'Sightseeing'],
  'Health & Care': ['Pharmacy / Meds', 'Doctor Consultation', 'Apollo Pharmacy', 'Lab Test', 'Gym'],
};

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: Smartphone },
  { id: 'cc', label: 'Credit Card', icon: CreditCard },
  { id: 'dc', label: 'Debit Card', icon: Wallet },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
];

export type StepType = 'amount' | 'category' | 'time' | 'reason' | 'summary';

export const STEP_QUESTIONS: Record<StepType, { title: string; subtitle: string; stepNumber: number }> = {
  amount: {
    title: 'How much did you spend?',
    subtitle: 'Enter the exact amount, speak, or type naturally below',
    stepNumber: 1,
  },
  category: {
    title: 'What was this expense for?',
    subtitle: 'Select the matching category to track your budget',
    stepNumber: 2,
  },
  time: {
    title: 'When did this happen?',
    subtitle: 'Timestamp your expense for accurate insights',
    stepNumber: 3,
  },
  reason: {
    title: 'Add a quick note or tag?',
    subtitle: 'Optional description to remember this purchase',
    stepNumber: 4,
  },
  summary: {
    title: 'Payment Receipt',
    subtitle: 'Review the AI-verified transaction receipt and confirm',
    stepNumber: 5,
  },
};

export const SPEECH_CONTEXTUAL_STRINGS = [
  'Rupees', '₹', 'INR', 'GPay', 'PhonePe', 'Paytm', 'UPI', 'Cash',
  'Credit Card', 'Debit Card', 'Net Banking', 'Swiggy', 'Zomato',
  'Uber', 'Ola', 'Rapido', 'Blinkit', 'Zepto', 'Instamart', 'Starbucks',
  'Subway', 'McDonalds', 'Amazon', 'Myntra', 'Zara', 'Flipkart',
  'Food & Dining', 'Transport', 'Shopping', 'Bills & Utilities',
  'Entertainment', 'Groceries & Cafe', 'Travel & Trips', 'Health & Care',
  'Electricity', 'Wifi', 'Petrol', 'Fuel', 'Dinner', 'Lunch', 'Breakfast',
  'Coffee', 'Grocery', 'Doctor', 'Pharmacy', 'Netflix', 'Movie', 'PVR'
];
