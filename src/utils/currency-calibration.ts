import { CurrencyCode } from '@/store';
import { MustPaymentItem } from '@/features/onboarding/types';

export interface CurrencyCalibrationConfig {
  code: CurrencyCode;
  symbol: string;
  defaultIncome: number;
  incomePresets: number[];
  defaultSavings: number;
  savingsPresets: number[]; // percentages e.g. [15, 20, 30, 40]
  defaultMustPayments: MustPaymentItem[];
  defaultHabitSavings: number;
  habitPresets: number[];
  defaultTargetVault: number;
  locale: string;
}

export const CALIBRATIONS: Record<CurrencyCode, CurrencyCalibrationConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    defaultIncome: 75000,
    incomePresets: [45000, 75000, 120000, 200000],
    defaultSavings: 15000,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'House Rent & Maintenance', category: 'Housing', amount: 18000, iconName: 'Home' },
      { id: 'loan_emi', name: 'Home / Car / Personal EMI', category: 'Debt & Loans', amount: 15000, iconName: 'Building' },
      { id: 'family_support', name: 'Sending Money to Family / Parents', category: 'Family Care', amount: 10000, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Health & Life Insurance', category: 'Protection', amount: 5000, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'School / Tuition Fees', category: 'Education', amount: 8000, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 800,
    habitPresets: [400, 600, 800, 1200, 2000],
    defaultTargetVault: 50000,
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    defaultIncome: 5500,
    incomePresets: [3500, 5500, 8500, 14000],
    defaultSavings: 1100,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'Rent / Mortgage', category: 'Housing', amount: 1600, iconName: 'Home' },
      { id: 'loan_emi', name: 'Car Loan / Student Debt', category: 'Debt & Loans', amount: 450, iconName: 'Building' },
      { id: 'family_support', name: 'Family & Dependent Care', category: 'Family Care', amount: 300, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Health & Auto Insurance', category: 'Protection', amount: 250, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Tuition / Courses', category: 'Education', amount: 200, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 30,
    habitPresets: [15, 25, 40, 60, 100],
    defaultTargetVault: 5000,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    defaultIncome: 4500,
    incomePresets: [2800, 4500, 7000, 11000],
    defaultSavings: 900,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'Rent / Housing', category: 'Housing', amount: 1300, iconName: 'Home' },
      { id: 'loan_emi', name: 'Loan Repayments', category: 'Debt & Loans', amount: 350, iconName: 'Building' },
      { id: 'family_support', name: 'Family Support', category: 'Family Care', amount: 250, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Insurance & Health', category: 'Protection', amount: 200, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Education & Training', category: 'Education', amount: 150, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 25,
    habitPresets: [15, 25, 35, 50, 80],
    defaultTargetVault: 4500,
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    defaultIncome: 4200,
    incomePresets: [2600, 4200, 6500, 10000],
    defaultSavings: 850,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'Rent / Mortgage', category: 'Housing', amount: 1400, iconName: 'Home' },
      { id: 'loan_emi', name: 'Vehicle Finance / Debt', category: 'Debt & Loans', amount: 300, iconName: 'Building' },
      { id: 'family_support', name: 'Family Care', category: 'Family Care', amount: 250, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Insurance Coverage', category: 'Protection', amount: 180, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Tuition & Childcare', category: 'Education', amount: 200, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 25,
    habitPresets: [10, 20, 35, 50, 75],
    defaultTargetVault: 4000,
    locale: 'en-GB',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    defaultIncome: 5800,
    incomePresets: [3600, 5800, 9000, 14000],
    defaultSavings: 1150,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'Rent / Mortgage', category: 'Housing', amount: 1800, iconName: 'Home' },
      { id: 'loan_emi', name: 'Car Finance / Student Loan', category: 'Debt & Loans', amount: 450, iconName: 'Building' },
      { id: 'family_support', name: 'Family Support', category: 'Family Care', amount: 300, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Auto & Health Insurance', category: 'Protection', amount: 250, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Tuition / Courses', category: 'Education', amount: 200, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 35,
    habitPresets: [15, 25, 45, 70, 100],
    defaultTargetVault: 5500,
    locale: 'en-CA',
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    defaultIncome: 6200,
    incomePresets: [3800, 6200, 9500, 15000],
    defaultSavings: 1250,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'Rent / Mortgage', category: 'Housing', amount: 2000, iconName: 'Home' },
      { id: 'loan_emi', name: 'Personal / Car Loan', category: 'Debt & Loans', amount: 500, iconName: 'Building' },
      { id: 'family_support', name: 'Family Care', category: 'Family Care', amount: 350, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Private Health & Insurance', category: 'Protection', amount: 280, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Education Fees', category: 'Education', amount: 250, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 40,
    habitPresets: [20, 35, 50, 80, 120],
    defaultTargetVault: 6000,
    locale: 'en-AU',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    defaultIncome: 450000,
    incomePresets: [280000, 450000, 700000, 1200000],
    defaultSavings: 90000,
    savingsPresets: [15, 20, 30, 40],
    defaultMustPayments: [
      { id: 'rent_housing', name: 'House Rent (家賃)', category: 'Housing', amount: 110000, iconName: 'Home' },
      { id: 'loan_emi', name: 'Loan EMI (ローン)', category: 'Debt & Loans', amount: 40000, iconName: 'Building' },
      { id: 'family_support', name: 'Family Support (仕送り)', category: 'Family Care', amount: 30000, iconName: 'Heart' },
      { id: 'insurance_premiums', name: 'Insurance (保険料)', category: 'Protection', amount: 20000, iconName: 'ShieldCheck' },
      { id: 'education_tuition', name: 'Education (学費)', category: 'Education', amount: 25000, iconName: 'GraduationCap' },
    ],
    defaultHabitSavings: 3000,
    habitPresets: [1500, 3000, 5000, 8000, 12000],
    defaultTargetVault: 450000,
    locale: 'ja-JP',
  },
};

export function getCurrencyDefaults(currencyCode?: CurrencyCode): CurrencyCalibrationConfig {
  const code = (currencyCode || 'INR') as CurrencyCode;
  return CALIBRATIONS[code] || CALIBRATIONS.INR;
}

export function formatAmount(amount: number, currencyCode?: CurrencyCode): string {
  const config = getCurrencyDefaults(currencyCode);
  try {
    return new Intl.NumberFormat(config.locale, {
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return amount.toLocaleString();
  }
}
