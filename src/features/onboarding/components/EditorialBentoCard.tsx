import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Bookmark, Clock, Sparkles, BookOpen, Check } from 'lucide-react-native';

interface EditorialBentoCardProps {
  compact?: boolean;
}

export const EditorialBentoCard: React.FC<EditorialBentoCardProps> = ({ compact = false }) => {
  const isDark = useColorScheme() === 'dark';
  const fgColor = isDark ? '#FFFFFF' : '#000000';
  const fgMuted = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const fgLight = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const bgColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <View style={[styles.cardContainer, { borderColor: fgLight }, compact && styles.compactCard]}>
      {/* Header / Category Meta */}
      <View style={styles.headerRow}>
        <View style={[styles.categoryPill, { backgroundColor: fgLight }]}>
          <Sparkles size={12} color={fgColor} />
          <Text style={[styles.categoryText, { color: fgColor }]}>FINANCIAL LITERACY</Text>
        </View>

        <View style={styles.metaRow}>
          <Clock size={12} color={fgMuted} />
          <Text style={[styles.metaText, { color: fgMuted }]}>3 min read</Text>
          <TouchableOpacity style={styles.bookmarkBtn}>
            <Bookmark size={14} color={fgColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Headline */}
      <Text style={[styles.headline, { color: fgColor }, compact && styles.compactHeadline]}>
        The 50/30/20 Rule: How AI Automates Your Wealth Building
      </Text>

      {/* Excerpt / Body Snippet */}
      {!compact && (
        <>
          <Text style={[styles.excerpt, { color: fgMuted }]}>
            Building lasting savings doesn&apos;t require budgeting spreadsheets. By automating micro-transfers based on daily spending habits, users save 3x faster without changing their lifestyle.
          </Text>

          {/* Key Insights List */}
          <View style={[styles.keyTakeawaysBox, { borderColor: fgLight, backgroundColor: 'transparent' }]}>
            <Text style={[styles.takeawayTitle, { color: fgColor }]}>Key AI Takeaways:</Text>

            <View style={styles.takeawayItem}>
              <View style={[styles.checkCircle, { backgroundColor: fgLight }]}>
                <Check size={10} color={fgColor} />
              </View>
              <Text style={[styles.takeawayText, { color: fgColor }]}>Zero friction automated round-ups on every swipe.</Text>
            </View>

            <View style={styles.takeawayItem}>
              <View style={[styles.checkCircle, { backgroundColor: fgLight }]}>
                <Check size={10} color={fgColor} />
              </View>
              <Text style={[styles.takeawayText, { color: fgColor }]}>Dynamic adjustment during high-expense weeks.</Text>
            </View>
          </View>
        </>
      )}

      {/* Author Footer */}
      <View style={[styles.footerRow, { borderTopColor: fgLight }]}>
        <View style={styles.authorGroup}>
          <View style={[styles.authorAvatar, { backgroundColor: fgColor }]}>
            <BookOpen size={14} color={bgColor} />
          </View>
          <View>
            <Text style={[styles.authorName, { color: fgColor }]}>Looop Editorial</Text>
            <Text style={[styles.authorRole, { color: fgMuted }]}>Curated Wealth Guides</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    elevation: 0,
  },
  compactCard: {
    padding: 14,
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  bookmarkBtn: {
    padding: 4,
    marginLeft: 4,
  },
  headline: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  compactHeadline: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  keyTakeawaysBox: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  takeawayTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 3,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeawayText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
  },
  authorRole: {
    fontSize: 10,
  },
});
