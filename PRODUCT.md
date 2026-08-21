# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users
- Mindful spenders, young professionals, students, and individuals striving for financial clarity and independence.
- People who find manual spreadsheets tedious and traditional banking apps cold, seeking an intuitive, habit-building, and respectful way to track expenses and fund life milestones.

## Product Purpose
- Help people master their daily cash flow, identify unconscious spending habits, and fund milestone savings goals.
- Provides a fast, tactile expense logging experience (keypad and 1-second natural voice logging), real-time budget pacing, milestone vaults, and personalized weekly financial stories with actionable habit challenges.

## Positioning
- A private, local-first personal finance companion that blends frictionless logging with behavioral psychology and editorial storytelling—without sharing financial data or requiring intrusive bank account logins.

## Operating Context
- On-the-go logging immediately following transactions (coffee, dining, groceries, rides).
- Daily glance checks (monitoring safe spend limits and category budgets).
- Weekly reflective reviews (reading personalized behavioral essays, tracking milestone progress).
- High expectations for physical responsiveness, haptic feedback, fluid animations, offline reliability, and biometric privacy.

## Capabilities and Constraints
- **Core Capabilities**:
  - 5-step rapid expense logging (Amount, Category, Date/Time, Note/Merchant, Receipt Summary) with offline SQLite persistence.
  - Natural speech voice logging with real-time audio visualization and intelligent parameter extraction.
  - Real-time spending analysis, daily safe spend pacing, 7-day interactive area chart, and category budget breakdown.
  - Milestone Vaults with percentage progress, target dates, and weekly milestone tasks.
  - Weekly editorial financial stories with structured behavioral diagnoses, key takeaways, and action tasks.
  - Biometric authentication (Fingerprint / Face ID lock) and RevenueCat subscription management for Looop Pro.
- **Technical Constraints**:
  - React Native / Expo (SDK 56), TypeScript, TanStack Query, Drizzle ORM + expo-sqlite, MMKV storage, Skia & Reanimated for animations.
  - Local-first architecture: core data remains on-device; cloud sync and AI inference are private with zero data retention for training.

## Brand Commitments
- **Name**: Looop
- **Tone & Voice**: Calm, encouraging, intelligent, respectful, and human. Avoids robotic tech jargon, cold banking formality, or superficial gamification.
- **Design Philosophy**: Polished, tactile, fluid motion, warm dark/light palettes with elegant purple and emerald accents, crisp typography, and generous spacing.

## Evidence on Hand
- Full existing React Native codebase with SQLite schema (`src/db/schema.ts`), UI components (`src/components/`), and custom design tokens (`src/constants/playful-tokens.ts`).
- Working voice recognition pipeline, biometric security layer, and subscription integration.

## Product Principles
1. **Frictionless in the Moment**: Logging an expense must take seconds and feel effortless, whether using the keypad or speaking naturally.
2. **Local-First & Private by Design**: The user's numbers belong on their device. Privacy is guaranteed through biometric security and encrypted local storage.
3. **Behavioral Insight over Raw Numbers**: Data is translated into meaningful context, safe daily pacing, and actionable habit coaching rather than intimidating spreadsheets.
4. **Tactile Craft & Visual Delight**: Every interaction—from haptics on keypad taps to fluid receipt generation and smooth chart animations—should feel intentional and premium.
