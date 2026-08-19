import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WebHeader } from '@/components/web/WebHeader';
import { LandingHero } from '@/components/web/LandingHero';
import { TiltedAppTiles } from '@/components/web/TiltedAppTiles';
import { MobileMockupShowcase } from '@/components/web/MobileMockupShowcase';
import { CategoryNavBand } from '@/components/web/CategoryNavBand';
import { ImpactMatrixSection } from '@/components/web/ImpactMatrixSection';
import { GradientHighlightSection } from '@/components/web/GradientHighlightSection';
import { FaqSection } from '@/components/web/FaqSection';
import { FinalCtaSection } from '@/components/web/FinalCtaSection';
import { WebFooter } from '@/components/web/WebFooter';
import { PlayfulColors } from '@/constants/playful-tokens';

export default function WebLandingPage() {
  const handleJoinWaitlist = (email: string) => {
    console.log('User joined waitlist:', email);
  };

  return (
    <div style={pageContainerStyle as any}>
      {/* Sticky Top Header */}
      <WebHeader />

      {/* Main Hero Section */}
      <LandingHero onJoinWaitlist={handleJoinWaitlist} />

      {/* Interactive Mobile Device Mockups Showcase */}
      <MobileMockupShowcase />

      {/* Hand of Cards Fan Showcase */}
      <TiltedAppTiles />

      {/* Full-width Black Category Nav Ticker Band */}
      <CategoryNavBand />

      {/* 3D Impact Matrix Pillars */}
      <ImpactMatrixSection />

      {/* Mid-page Atmospheric Gradient Highlight */}
      <GradientHighlightSection />

      {/* Two-Column FAQ Section */}
      <FaqSection />

      {/* Final Closing Call to Action */}
      <FinalCtaSection onJoinWaitlist={handleJoinWaitlist} />

      {/* Footer with Legal Links */}
      <WebFooter />
    </div>
  );
}

const pageContainerStyle = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: PlayfulColors.oatCanvas,
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
};
