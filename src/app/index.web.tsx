import React from 'react';
import { WebHeader } from '@/components/web/WebHeader';
import { LandingHero } from '@/components/web/LandingHero';
import { CategoryNavBand } from '@/components/web/CategoryNavBand';
import { FeatureBentoGrid } from '@/components/web/FeatureBentoGrid';
import { ImpactMatrixSection } from '@/components/web/ImpactMatrixSection';
import { FaqSection } from '@/components/web/FaqSection';
import { FinalCtaSection } from '@/components/web/FinalCtaSection';
import { WebFooter } from '@/components/web/WebFooter';
import { WebColors } from '@/constants/web-tokens';

export default function WebLandingPage() {
  const handleJoinWaitlist = (email: string) => {
    console.log('User joined waitlist:', email);
  };

  return (
    <div style={pageContainerStyle as any}>
      {/* Sticky Top Navigation Header */}
      <WebHeader />

      {/* Hero Stage with Dual-Column Value Prop + Floating Phone Mockup */}
      <LandingHero onJoinWaitlist={handleJoinWaitlist} />

      {/* Hardware-accelerated Capability Ticker */}
      <CategoryNavBand />

      {/* High-Density Interactive Feature Bento Grid */}
      <FeatureBentoGrid />

      {/* 3D Impact Matrix: Health, Family & Freedom */}
      <ImpactMatrixSection />

      {/* Interactive FAQ Accordion */}
      <FaqSection />

      {/* Final Closing VIP Waitlist Card */}
      <FinalCtaSection onJoinWaitlist={handleJoinWaitlist} />

      {/* Footer with Legal & Privacy Links */}
      <WebFooter />
    </div>
  );
}

const pageContainerStyle = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: WebColors.canvas,
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
};
