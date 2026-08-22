import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react-native';
import { WebColors, WebShadows, WebTypography } from '@/constants/web-tokens';

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
      'Traditional budgeting apps rely on tedious manual dropdowns and punitive red bars that cause guilt. Looop uses natural voice recognition and behavioral psychology to diagnose root spending triggers, connect expenses to your sleep and health, and turn weekly micro-wins directly into funded milestone vaults.',
  },
  {
    id: 'faq_2',
    question: 'Is my financial transaction data private and secure?',
    answer:
      'Yes, 100%. Looop is built with a local-first architecture using encrypted on-device SQLite storage. Your personal financial transactions and voice memos stay on your physical device—we do not scrape your bank accounts with Plaid and never sell data to advertisers.',
  },
  {
    id: 'faq_3',
    question: 'How does 1-second natural voice logging work?',
    answer:
      'Simply tap the mic and say what you spent in plain English or Hinglish (e.g., "Paid 450 for lunch Subway via UPI"). Looop streams your speech in real-time and verifies the amount, category, merchant, and payment method into a structured receipt in 1 second.',
  },
  {
    id: 'faq_4',
    question: 'What are Milestone Savings Vaults?',
    answer:
      'Vaults are dedicated targets for things you genuinely care about — like a Smart Fitness Ring, a Family Vacation, or a 3-Month Emergency Cushion. When you complete weekly habit challenges, your saved surplus is automatically calculated and routed straight into your active vault.',
  },
  {
    id: 'faq_5',
    question: 'Can I use Looop across both Mobile and Web?',
    answer:
      'Yes! Looop runs as a native application on iOS and Android with biometric Face ID security, and as a lightweight web app on desktop and mobile browsers.',
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
            <Sparkles size={13} color={WebColors.primaryOrange} />
            <span style={tagTextStyle as any}>GOT QUESTIONS?</span>
          </div>

          <h2 style={leftHeadingStyle as any}>
            Things people<br />
            <span style={{ color: WebColors.primaryOrange }}>want to know.</span>
          </h2>

          <p style={leftSubtextStyle as any}>
            Everything you need to know about Looop, privacy, AI habit diagnosis, and milestone vaults.
          </p>
        </div>

        {/* Right Column: Stacked Paper White Accordion Cards */}
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
                    borderColor: isOpen ? WebColors.creamBorderStrong : WebColors.borderCard,
                    boxShadow: isOpen ? WebShadows.cardHover : WebShadows.cardRest,
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
                        backgroundColor: isOpen ? WebColors.creamSoft : WebColors.surfaceSubtle,
                      } as any
                    }
                  >
                    <ChevronDown size={18} color={isOpen ? WebColors.accentOrange : WebColors.mutedSlate} />
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
  backgroundColor: WebColors.canvas,
  padding: '96px 0',
  display: 'flex',
  justifyContent: 'center',
};

const faqContainer = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '56px',
  alignItems: 'start',
};

const leftColStyle = {
  position: 'sticky',
  top: '100px',
};

const tagRowStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  backgroundColor: WebColors.creamSoft,
  border: `1px solid ${WebColors.creamBorder}`,
  padding: '6px 14px',
  borderRadius: '999px',
  marginBottom: '18px',
};

const tagTextStyle = {
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  color: WebColors.accentOrange,
  fontFamily: WebTypography.displayFont,
};

const leftHeadingStyle = {
  fontSize: 'clamp(32px, 4.5vw, 42px)',
  lineHeight: 1.12,
  fontWeight: 800,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: '0 0 16px 0',
  letterSpacing: '-0.03em',
};

const leftSubtextStyle = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  maxWidth: '380px',
  margin: 0,
};

const rightColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const faqCardStyle = {
  backgroundColor: WebColors.cardWhite,
  borderRadius: '20px',
  padding: '24px 28px',
  border: `1.2px solid ${WebColors.borderCard}`,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
};

const faqHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
};

const faqQuestionStyle = {
  fontSize: '16.5px',
  fontWeight: '700',
  lineHeight: 1.35,
  color: WebColors.inkSlate,
  fontFamily: WebTypography.displayFont,
  margin: 0,
};

const chevronContainerStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const faqBodyContainerStyle = {
  marginTop: '14px',
  paddingTop: '14px',
  borderTop: `1px solid ${WebColors.borderHairline}`,
};

const faqAnswerStyle = {
  fontSize: '14.5px',
  lineHeight: 1.65,
  color: WebColors.subSlate,
  fontFamily: WebTypography.bodyFont,
  margin: 0,
};
