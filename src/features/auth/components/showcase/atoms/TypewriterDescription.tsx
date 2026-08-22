import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TypewriterDescriptionProps {
  currencySymbol?: string;
  isActive: boolean;
  onComplete?: () => void;
}

export function TypewriterDescription({
  currencySymbol = '₹',
  isActive,
  onComplete,
}: TypewriterDescriptionProps) {
  const { t } = useTranslation();
  const fullText = t(
    'showcase.story.excerpt',
    `Afternoon ${currencySymbol}450 cafe treats compound into ${currencySymbol}13,500 monthly leaks. 92% happen from habit, not hunger.`,
    { currency: currencySymbol }
  );
  const boldTarget = t(
    'showcase.story.boldTarget',
    `${currencySymbol}13,500 monthly leaks`,
    { currency: currencySymbol }
  );
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayedLength(0);
      return;
    }

    setDisplayedLength(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 2; // 2 chars per tick (~30ms) for smooth natural reading cadence
      if (current >= fullText.length) {
        setDisplayedLength(fullText.length);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedLength(current);
      }
    }, 32);

    return () => clearInterval(interval);
  }, [isActive, fullText]);

  const visibleText = fullText.slice(0, displayedLength);
  const isComplete = displayedLength >= fullText.length;

  const boldStartIdx = fullText.indexOf(boldTarget);
  const boldEndIdx = boldStartIdx !== -1 ? boldStartIdx + boldTarget.length : -1;

  return (
    <Text style={styles.storyExcerpt}>
      {boldStartIdx === -1 ? (
        visibleText
      ) : displayedLength <= boldStartIdx ? (
        visibleText
      ) : displayedLength < boldEndIdx ? (
        <>
          {fullText.slice(0, boldStartIdx)}
          <Text style={styles.storyBoldText}>
            {fullText.slice(boldStartIdx, displayedLength)}
          </Text>
        </>
      ) : (
        <>
          {fullText.slice(0, boldStartIdx)}
          <Text style={styles.storyBoldText}>{boldTarget}</Text>
          {fullText.slice(boldEndIdx, displayedLength)}
        </>
      )}
      {!isComplete && <Text style={styles.typingCaret}>|</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  storyExcerpt: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
    minHeight: 36,
  },
  storyBoldText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#EA580C',
  },
  typingCaret: {
    color: '#FF6B00',
    fontWeight: '300',
    fontSize: 15,
  },
});
