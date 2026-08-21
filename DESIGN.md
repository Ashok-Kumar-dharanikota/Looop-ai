---
name: Looop
description: A tactile, mindful personal finance companion with calm depth, fluid motion, and editorial clarity.
colors:
  primary: "#7c3aed"
  primary-hover: "#6d28d9"
  primary-vibrant: "#9333ea"
  primary-soft: "#f3e8ff"
  accent-emerald: "#059669"
  accent-emerald-soft: "#ecfdf5"
  accent-amber: "#d97706"
  accent-amber-soft: "#fef3c7"
  accent-rose: "#ef4444"
  accent-rose-soft: "#fee2e2"
  accent-sky: "#0284c7"
  accent-sky-soft: "#e0f2fe"
  neutral-bg: "#f8fafc"
  neutral-card: "#ffffff"
  neutral-surface: "#f1f5f9"
  neutral-border: "#e2e8f0"
  neutral-divider: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-tertiary: "#64748b"
  text-muted: "#94a3b8"
  canvas-warm: "#f6f2ee"
  chromatic-magenta: "#ff2e95"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.6px"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.4px"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.2px"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-0.1px"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.8px"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-elevated:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "20px"
  pill-badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: Looop

## Overview

**Creative North Star: "The Mindful Vault"**

Looop is a private, tactile personal finance sanctuary designed to give users effortless mastery over daily money habits. The design rejects both the sterile, intimidating spreadsheets of legacy banking and the cheap, frantic gamification of typical consumer trackers. In their place, Looop offers a calm, reassuring, and deeply satisfying tactile environment where numbers feel tangible, progress feels rewarding, and reflection feels natural.

The interface is structured around clean, rounded cards, subtle bordered layering, confident slate typography, and intentional moments of vivid chromatic energy (regal royal violet, crisp emerald wealth markers, and warm honey accents). Micro-interactions are celebrated with authentic physical responses: crisp haptics on keypad clicks, animated receipts with perforated cutouts, and flowing area graphs that celebrate savings momentum.

**Key Characteristics:**
- **Calm & Dignified**: Light, breathable surfaces (`#F8FAFC`, `#FFFFFF`) grounded by deep slate ink (`#0F172A`).
- **Tactile & Responsive**: Every tap yields instant haptic feedback and fluid spring motion; interactive elements feel like sculpted physical controls.
- **Visual Clarity**: Information hierarchy is strictly enforced through size, weight, and tint—never visual clutter.
- **Editorial Warmth**: Reports and habit diagnoses are typeset with magazine-grade pacing and thoughtful human language.

---

## Colors

The Looop palette balances clinical precision with emotional reassurance. Pure violet anchors intentional actions, while category tints communicate spend distribution at a glance.

### Primary
- **Royal Violet** (`#7C3AED` / `#9333EA`): The core chromatic voice of Looop. Used for primary CTAs, active selection rings, chart fills, and milestone milestones.
- **Violet Mist** (`#F3E8FF`): Low-contrast background tint for badges, selected list tiles, and active category icons.

### Accents (Category & Status Spectrum)
- **Emerald Green** (`#059669`, soft `#ECFDF5`): Financial health, positive cashflow, savings surplus, and goal completion.
- **Amber Gold** (`#D97706`, soft `#FEF3C7`): Pro membership badges, high-priority milestones, and caution warnings.
- **Coral Rose** (`#EF4444`, soft `#FEE2E2`): Expense alerts, category dining tags, and destructive account actions.
- **Azure Sky** (`#0284C7`, soft `#E0F2FE`): Transport categories, notifications toggles, and neutral utility indicators.

### Neutral Surfaces
- **Canvas Base** (`#F8FAFC`): The ambient app background creating subtle contrast behind white cards.
- **Paper Card** (`#FFFFFF`): Primary container surface for cards, sheets, keypad, and receipts.
- **Slate Border** (`#E2E8F0` / `#F1F5F9`): Hairline dividers and card borders creating crisp spatial separation.
- **Deep Slate Ink** (`#0F172A`): Primary headings and monetary figures.
- **Slate Subtext** (`#64748B` / `#94A3B8`): Body labels, metadata timestamps, and inactive icons.

### Named Rules
**The Rarity Rule.** The vibrant violet accent (`#7C3AED`) is reserved for primary focus states, key action buttons, and active tabs. It never covers entire card backgrounds indiscriminately, preserving its premium weight.

---

## Typography

**Display & Body Font:** Inter (System fallback: `-apple-system, BlinkMacSystemFont, Roboto, sans-serif`)

Typography in Looop is clean, modern, and highly legible across all screen scales. Large monetary values use bold, tabular figures with negative letter-spacing for immediate numerical comprehension.

### Hierarchy
- **Display** (800 Bold, `36px` / `29px`, line-height `1.15`, tracking `-0.6px`): Primary hero values, expense question titles, and big receipt amounts.
- **Headline** (700 Bold, `24px` / `20px`, line-height `1.25`): Screen section headers, dashboard card titles, and modal names.
- **Title** (700 Bold, `18px` / `16px`, line-height `1.35`): Card headers, list row titles, and user display names.
- **Body** (500 Medium, `15px` / `14px`, line-height `1.55`): Explanatory descriptions, financial story paragraphs, and input text.
- **Label / Micro** (800 ExtraBold, `11px`, letter-spacing `0.8px`, UPPERCASE): Category badge tags, progress pill counters, and metadata labels.

---

## Layout

- **Grid & Safe Areas**: Layouts strictly honor mobile safe-area insets (`useSafeAreaInsets()`). Top headers and bottom tab bars adapt dynamically to notches and home indicators.
- **Card Rhythm**: Content is grouped into standalone elevated cards with standard `20px` horizontal screen padding and `12px` to `16px` vertical gaps between cards.
- **Floating Bottom Dock**: Rapid action triggers (voice input, quick chat logging) float pinned above the bottom safe area with elevation and backdrop blur.

---

## Elevation & Depth

Looop uses a **Layered & Tactile** depth model. Depth is established through subtle 1px slate borders (`#E2E8F0`), soft diffused shadows (`rgba(15, 23, 42, 0.06)`), and layered surface tones rather than heavy drop shadows.

### Shadow Vocabulary
- **Card Rest** (`shadowColor: #0F172A, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2`): Used on standard cards, list items, and summary blocks.
- **Floating Dock & Modal** (`shadowColor: #0F172A, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6`): Used on floating text input docks, active keypad buttons, and bottom action sheets.
- **Accent Glow** (`shadowColor: #7C3AED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4`): Reserved for primary CTA confirmation buttons and microphone recording rings.

---

## Shapes

- **Large Cards & Sheets**: `24px` to `28px` border radius (`rounded.xl`), creating a modern, friendly silhouette.
- **Interactive Tiles & Inputs**: `14px` to `16px` border radius (`rounded.md` / `rounded.lg`).
- **Pills & Chips**: Fully circular (`9999px` / `rounded.full`) for status indicators, date chips, and category tags.
- **Perforated Receipt**: Custom notched geometry with dashed divider lines for the payment receipt card.

---

## Components

### 1. Keypad Grid
- High-contrast circular / rounded-rect number tiles with instant light haptic impact on tap.
- Integrated currency symbol display and backspace button.

### 2. Category & Time Chips
- 2-column or 3-column structured grid tiles.
- Inactive: `#F8FAFC` background with subtle `#F1F5F9` border.
- Active: `#FAF5FF` background with `#9333EA` border, vibrant icon, and white checkmark badge.

### 3. Payment Receipt Card
- Crisp white surface with simulated perforated side notches and dashed cut lines.
- Hero monetary display, category icon badge, and inline payment method dropdown.

### 4. Milestone Vault Card
- Gradient progress bar (Violet $\rightarrow$ Amber/Emerald) with percentage counter.
- Target date pill and weekly task checklist.

---

## Do's and Don'ts

### Do's
- **Do** trigger medium haptic feedback on state-changing button presses and light feedback on selections.
- **Do** format all currency amounts with localized thousands separators and appropriate currency symbols (`₹450`, `$1,250.00`).
- **Do** maintain high contrast between text and card backgrounds for effortless readability in bright daylight.
- **Do** pair numbers with meaningful behavioral context (e.g. "Safe daily spend: ₹1,400" instead of just "₹1,400 left").

### Don'ts
- **Don't** expose internal technical labels, AI model names (Gemini, Firebase, LLM, SDK versions) to the user.
- **Don't** use harsh generic red/green colors; use tuned `#059669` (emerald) and `#EF4444` (rose).
- **Don't** use unpadded touch targets—every tappable control must meet or exceed `44x44 pt`.
- **Don't** disable or block the system back gesture or Android hardware back button.
