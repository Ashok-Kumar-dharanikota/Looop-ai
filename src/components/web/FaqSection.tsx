import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react-native';
import { PlayfulColors, PlayfulTypography, PlayfulShadows, PlayfulRadii } from '@/constants/playful-tokens';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'How is Looop different from traditional budgeting apps?',
    answer:
      'Traditional apps rely on manual bookkeeping and punitive red bars that cause guilt. Looop uses conversational AI and behavioral psychology to diagnose root habit triggers, connect spending to your health/sleep, and turn weekly micro-wins directly into funded dream vaults.',
  },
  {
    id: 'faq_2',
    question: 'Is my financial transaction data private and secure?',
    answer:
      'Yes, 100%. Looop is built with a local-first architecture using encrypted on-device SQLite storage. Your personal financial data and voice memos stay on your device and are never sold or shared with advertisers.',
  },
  {
    id: 'faq_3',
    question: 'How does natural voice logging work?',
    answer:
      'Simply tap the mic and say what you spent in plain English or Hinglish (e.g., "Paid 450 for lunch Subway via UPI"). Looop streams your speech in real-time and verifies the amount, category, time, and payment method into a clean receipt in 2 seconds.',
  },
  {
    id: 'faq_4',
    question: 'What are Milestone Savings Vaults?',
    answer:
      'Vaults are dedicated targets for things you genuinely care about — like a Smart Fitness Ring, a Family Goa Trip, or a 3-Month Safety Buffer. When you complete weekly habit tasks, your savings are automatically calculated and routed straight into your active vault.',
  },
  {
    id: 'faq_5',
    question: 'Can I use Looop on both Mobile and Web?',
    answer:
      'Yes! Looop runs as a native app on iOS and Android, and as a lightweight web app on desktop and mobile browsers.',
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq_1');

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section style={faqSectionWrapper as any} id="faq">
      <div style={faqContainer as any}>
        {/* Left Column: Label + Display Heading */}
        <div style={leftColStyle as any}>
          <div style={tagRowStyle as any}>
            <Sparkles size={13} color={PlayfulColors.hotMagenta} />
            <span style={tagTextStyle as any}>GOT QUESTIONS?</span>
          </div>
          <h2 style={leftHeadingStyle as any}>
            Things people<br />
            <span style={{ color: PlayfulColors.hotMagenta }}>want to know.</span>
          </h2>
          <p style={leftSubtextStyle as any}>
            Everything you need to know about Looop, privacy, AI habit diagnosis, and milestone vaults.
          </p>
        </div>

        {/* Right Column: Stacked 44px Paper White Accordion Cards */}
        <div style={rightColStyle as any}>
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => toggleAccordion(item.id)}
                style={
                  {
                    ...faqCardStyle,
                    borderColor: isOpen ? PlayfulColors.sand : PlayfulColors.warmMist,
                  } as any
                }
              >
                <div style={faqHeaderRowStyle as any}>
                  <h3 style={faqQuestionStyle as any}>{item.question}</h3>
                  <div
                    style={
                      {
                        ...chevronContainerStyle,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      } as any
                    }
                  >
                    <ChevronDown size={20} color={isOpen ? PlayfulColors.hotMagenta : PlayfulColors.stone} />
                  </div>
                </div>

                {isOpen && (
                  <div style={faqBodyContainerStyle as any}>
                    <p style={faqAnswerStyle as any}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const faqSectionWrapper = {
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  padding: '113px 0',
};

const faqContainer = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
  display: 'grid',
  gridTemplateColumns: '1fr 1.35fr',
  gap: '64px',
  alignItems: 'start',
};

const leftColStyle = {
  position: 'sticky',
  top: '120px',
};

const tagRowStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 46, 149, 0.08)',
  padding: '6px 14px',
  borderRadius: '99px',
  marginBottom: '20px',
};

const tagTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  color: PlayfulColors.hotMagenta,
  fontFamily: PlayfulTypography.fontFamily,
};

const leftHeadingStyle = {
  fontSize: '42px',
  lineHeight: 1.1,
  fontWeight: 900,
  fontStyle: 'italic',
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: '0 0 16px 0',
  letterSpacing: '-0.5px',
};

const leftSubtextStyle = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  maxWidth: '380px',
  margin: 0,
};

const rightColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const faqCardStyle = {
  backgroundColor: PlayfulColors.paperWhite,
  borderRadius: `${PlayfulRadii.cards}px`,
  padding: '28px 32px',
  boxShadow: PlayfulShadows.cardStack,
  border: `1px solid ${PlayfulColors.warmMist}`,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const faqHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
};

const faqQuestionStyle = {
  fontSize: '18px',
  fontWeight: '700',
  fontStyle: 'italic',
  lineHeight: 1.35,
  color: PlayfulColors.inkBlack,
  fontFamily: PlayfulTypography.fontFamily,
  margin: 0,
};

const chevronContainerStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: PlayfulColors.oatCanvas,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const faqBodyContainerStyle = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: `1px solid ${PlayfulColors.warmMist}`,
};

const faqAnswerStyle = {
  fontSize: '15px',
  lineHeight: 1.65,
  color: PlayfulColors.slate,
  fontFamily: PlayfulTypography.fontFamily,
  margin: 0,
};
