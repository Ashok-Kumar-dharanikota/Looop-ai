export interface MustPaymentItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  iconName?: string;
  isCustom?: boolean;
}

export interface UserAssessmentData {
  leakCategory: string;
  leakCategoryName: string;
  leakEstimatedCost: number;
  frustration: string;
  primaryGoal: string;
  monthlyIncome: string;
  monthlySavingsTarget: string;
  mustPayments: MustPaymentItem[];
  totalMustPayments: number;
}

export interface UserOnboardingAnswers {
  role: string;
  monthlyIncome: string;
  monthlySavingsTarget: string;
  mustPayments: MustPaymentItem[];
  totalMustPayments: number;
  primaryGoal: string;
  timeline: string;
  frustration: string;
  buyingReflex: string;
  regretFrequency: string;
  overspendingCategory: string;
  trackingFrequency: string;
  currentManagementTool: string;
  balanceCheckFrequency: string;
  importantCategories: string[];
  insightFrequency: string;
  coachingTone: string;
}

export interface QuestionOption {
  label: string;
  emoji: string;
  desc?: string;
}

export type StepType = 'choice' | 'earnings' | 'must_payments';

export interface OnboardingStep {
  id: string;
  chapterIndex: number;
  type: StepType;
  title: string;
  subtitle: string;
  fieldKey?: keyof UserOnboardingAnswers;
  options?: QuestionOption[];
}

export interface FirstHabitResult {
  isCompleted: boolean;
  savingsAmount: number;
  taskTitle: string;
  taskCategory: string;
}

export type OnboardingStage = 'questionnaire' | 'diagnosis' | 'first_habit' | 'notifications';
