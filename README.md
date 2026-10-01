# Looop — Private, Local-First Personal Finance Companion

[![Expo SDK 56](https://img.shields.io/badge/Expo-SDK_56-000020?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.85-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Reanimated 4](https://img.shields.io/badge/Reanimated-4.3-8B5CF6?style=for-the-badge)](https://docs.swmansion.com/react-native-reanimated/)
[![Shopify Skia](https://img.shields.io/badge/Shopify-Skia_2.6-FF6A00?style=for-the-badge)](https://shopify.github.io/react-native-skia/)
[![Firebase AI](https://img.shields.io/badge/Gemini_AI-Firebase-FFA000?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🚀 1. Project Title & Hook

**Looop** is a tactile, local-first personal finance companion engineered to transform unconscious cash outflow into intentional wealth and milestone savings via sub-second voice logging, on-device NLP, behavioral storytelling, and biometric privacy.

---

## 💡 2. The Problem & Solution

### The Problem
* **High Logging Friction:** Most expense trackers burden users with complex dropdowns, multi-step categorization, and tedious forms, leading to logging fatigue within weeks.
* **Intrusive Privacy Trade-offs:** Mainstream fintech apps require direct bank credentials, storing and aggregating personal financial histories on external cloud servers.
* **Numbers Without Context:** Traditional banking apps display sterile transaction feeds without diagnosing underlying spending psychology or helping users cultivate mindful daily habits.

### The Solution
* **Zero-Latency Natural Logging:** Log expenses in under 2 seconds—either through natural speech (*"Paid $42 for groceries at Trader Joe's"*) or an ultra-responsive 5-step tactile keypad.
* **Local-First Data Sovereignty:** Core transactions, milestone vaults, and budget metrics stay 100% on-device in an encrypted SQLite database. Zero mandatory account creation; full offline capability.
* **Editorial Behavioral Stories & Milestone Vaults:** Converts raw transaction rows into actionable weekly narrative essays, behavioral leak diagnoses, safe daily spend pacing, and milestone savings vaults.

---

## 🛠️ 3. Tech Stack

* **Core & Runtime:**
  * [React Native 0.85](https://reactnative.dev/) / [React 19](https://react.dev/)
  * [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) with [Expo Router v56](https://docs.expo.dev/router/introduction/) (typed routes & static web rendering)
  * [TypeScript 6](https://www.typescriptlang.org/)
* **Database & Persistence:**
  * [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
  * [Drizzle ORM](https://orm.drizzle.team/) (full type-safe schema and query builder)
  * [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) (C++ synchronous key-value storage)
* **State & Query Orchestration:**
  * [Zustand v5](https://zustand.docs.pmnd.rs/) (lightweight atomic UI state)
  * [TanStack React Query v5](https://tanstack.com/query/latest) (declarative query caching & reactive mutations)
* **Voice & Intelligence:**
  * `expo-speech-recognition` (native real-time voice streaming)
  * `@react-native-firebase/ai` (Gemini 3.5 Flash-Lite / 3.6 Flash structured JSON extraction)
  * `@react-native-firebase/app-check` (Play Integrity & DeviceCheck attestation)
* **UI, Animation & Graphics:**
  * [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) (spring physics & keyboard-aware transitions)
  * [Shopify React Native Skia](https://shopify.github.io/react-native-skia/) (hardware-accelerated 2D canvas rendering)
  * [Shopify FlashList 2.0](https://shopify.github.io/flash-list/) (high-performance list virtualization)
  * `expo-mesh-gradient`, `expo-glass-effect`, `expo-haptics`
  * `react-native-gifted-charts` (interactive 7-day spending curves)
  * `lucide-react-native`
* **Security & Authentication:**
  * `expo-local-authentication` (Biometric Face ID / Fingerprint hardware lock)
  * `@react-native-firebase/auth` + `react-native-nitro-google-signin`
* **Monetization & Localization:**
  * `react-native-purchases` (RevenueCat SDK 10 for Pro tier subscriptions)
  * `i18next` & `react-i18next` (7 locales: English, German, Spanish, French, Hindi, Japanese, Portuguese)

---

## ✨ 4. Key Features & Engineering Depth

### 🧠 Dual-Engine Natural Language Expense Parser
* **Architected** a sub-millisecond on-device deterministic regex/keyword parser (`src/lib/expense-nlp-parser.ts`) that extracts amount, merchant, category, date/time offsets, and payment modes with zero network overhead.
* **Integrated** a Gemini AI fallback pipeline (`src/services/firebase-ai.ts`) backed by candidate flash models (`gemini-3.5-flash-lite`, `gemini-3.6-flash`) with strict JSON schema constraints for complex or ambiguous natural speech.
* **Secured** cloud inference via Firebase App Check using native platform attestation (Play Integrity / DeviceCheck).

### ⚡ Local-First Reactive Data Architecture
* **Engineered** an embedded SQLite persistence layer with [Drizzle ORM](https://orm.drizzle.team/) (`src/db/schema.ts`) managing transactions, weekly goals, milestone vaults, behavioral reports, and user configuration.
* **Synchronized** database mutations with TanStack Query and MMKV, eliminating UI stutter and ensuring instant offline CRUD operations.

### 📊 Behavioral Finance Engine & Milestone Vaults
* **Engineered** an algorithmic budget pacer calculating daily safe-to-spend limits based on dynamic monthly income, fixed recurring bills, and savings commitments.
* **Synthesized** automated weekly financial narratives (`src/services/ai-reports.ts`) that diagnose unconscious spending leaks across lifestyle domains and generate actionable habit tasks.
* **Implemented** goal-driven Milestone Savings Vaults featuring target completion tracking, auto-contribution calculators, and visual progress meters.

### 🎨 60+ FPS Tactile UI & Physics-Based Motion
* **Crafted** fluid mesh gradients and glassmorphism cards using Shopify Skia and Reanimated 4 spring animations.
* **Optimized** transaction history feeds with Shopify FlashList 2.0, maintaining consistent 60 FPS scrolling through cell recycling and minimal layout overhead.
* **Incorporated** multi-stage haptic feedback (`expo-haptics`) across keypad taps, voice recording locks, and receipt confirmations.

### 🔒 Defense-in-Depth Privacy & Biometrics
* **Engineered** a hardware-backed biometric lock (`expo-local-authentication`) safeguarding access on app resume.
* **Designed** an offline-first Guest Mode ensuring complete functionality without mandatory cloud accounts or external data sync.

---

## 📂 5. Architecture & Directory Overview

```
src/
├── app/                     # Expo Router file-based route hierarchy
│   ├── (tabs)/              # Core tab navigators (Dashboard, Transactions, Goals, Profile)
│   ├── index.tsx            # Biometric lock & authentication gate
│   ├── paywall.tsx          # RevenueCat Pro subscription modal
│   └── _layout.tsx          # Root provider tree (QueryClient, DB, Themes)
├── components/              # Feature UI molecules & organisms
│   ├── expense/             # KeypadGrid, VoiceRecordingOverlay, ReceiptSummaryCard
│   ├── tabs/                # Dashboard, DailySummary, GoalsTab, ProfileTab
│   └── ui/                  # AnimatedMeshGradient, tactile native components
├── constants/               # Playful tokens, typography, and color systems
├── db/                      # SQLite connection, client migrations, and Drizzle schema
├── features/auth/           # Biometric authentication flow and onboarding questionnaire
├── hooks/                   # useDatabase, useSpeechRecognition, useAuth, useQueries
├── i18n/                    # Multi-language translation schemas (en, de, es, fr, hi, ja, pt)
├── lib/                     # Regex/keyword expense NLP extraction engine
├── services/                # Firebase Gemini AI, Firebase Auth, RevenueCat services
├── shared/ui/               # Reusable primitives (NativeCard, RollingCounter)
└── store/                   # Zustand stores with MMKV state hydration
```

---

## 📦 6. Quick Start

### Prerequisites
* **Node.js** >= 18.0.0
* **npm** or **bun**
* **Android Studio** (Android SDK 36) or **Xcode** (iOS 17+)

### Installation & Run

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Database Migrations:**
   ```bash
   npm run db:generate
   ```

3. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

4. **Launch on Specific Platforms:**
   * **Android:** Press `a` in terminal or run `npm run android`
   * **iOS (macOS):** Press `i` in terminal or run `npm run ios`
   * **Web:** Press `w` in terminal or run `npm run web`

5. **Linting & Code Quality:**
   ```bash
   npm run lint
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
