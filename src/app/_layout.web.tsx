import React, { useEffect } from 'react';
import { Slot, usePathname } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function WebRootLayout() {
  const pathname = usePathname();

  // Scroll to top whenever the route / pathname changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    // Inject global web styles and OpenGraph meta tags
    if (typeof document !== 'undefined') {
      // 1. Document Title
      document.title = 'Looop — AI Financial Biographer & Private Vault';

      // 2. OpenGraph and Twitter Meta Tags Helper
      const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
        let el = document.querySelector(`meta[${attr}="${key}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, key);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      // Standard SEO
      setMetaTag('name', 'description', 'A private, local-first personal finance companion that transforms daily cashflow into lasting wealth and mindful habits.');
      setMetaTag('name', 'theme-color', '#FAF9F6');

      // OpenGraph Facebook / WhatsApp / LinkedIn / iMessage
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:title', 'Looop — Master Daily Cashflow. Fund Life Milestones.');
      setMetaTag('property', 'og:description', 'A private, local-first personal finance companion that turns micro-spending habits into funded dream vaults. Coming soon to App Store & Google Play.');
      setMetaTag('property', 'og:url', 'https://looop.expo.app');
      setMetaTag('property', 'og:image', 'https://looop.expo.app/og-image.png');
      setMetaTag('property', 'og:image:width', '1200');
      setMetaTag('property', 'og:image:height', '630');
      setMetaTag('property', 'og:site_name', 'Looop');

      // Twitter Cards
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', 'Looop — Master Daily Cashflow. Fund Life Milestones.');
      setMetaTag('name', 'twitter:description', 'A private, local-first personal finance companion that turns micro-spending habits into funded dream vaults. Coming soon to App Store & Google Play.');
      setMetaTag('name', 'twitter:image', 'https://looop.expo.app/og-image.png');

      // 3. Inject Google Fonts link if not present
      const fontLinkId = 'looop-google-fonts';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap';
        document.head.appendChild(link);
      }

      // 4. Inject global CSS rules
      const styleId = 'looop-web-global-styles';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #FAF9F6;
          height: auto !important;
          min-height: 100%;
          overflow-y: auto !important;
          overflow-x: hidden;
        }
        body {
          background-color: #FAF9F6;
          color: #0F172A;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          height: auto !important;
          overflow-y: auto !important;
          overflow-x: hidden;
        }
        #root, [data-reactroot] {
          min-height: 100vh;
          height: auto !important;
          display: flex;
          flex-direction: column;
          overflow-y: visible !important;
        }
        ::selection {
          background-color: #FFEDD5;
          color: #EA580C;
        }
        button {
          cursor: pointer;
          border: none;
          outline: none;
          font-family: inherit;
        }
        a {
          text-decoration: none;
          color: inherit;
        }

        /* Hardware-accelerated Keyframe Animations */
        @keyframes floatSmooth {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes tickerMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes waveScale {
          0%, 100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }

        .animate-float-mockup {
          animation: floatSmooth 6s ease-in-out infinite;
        }
        .animate-ticker {
          display: inline-flex;
          animation: tickerMarquee 28s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        .wave-anim-1 { animation: waveScale 1.1s ease-in-out infinite 0.1s; }
        .wave-anim-2 { animation: waveScale 1.1s ease-in-out infinite 0.3s; }
        .wave-anim-3 { animation: waveScale 1.1s ease-in-out infinite 0.5s; }
        .wave-anim-4 { animation: waveScale 1.1s ease-in-out infinite 0.2s; }
        .wave-anim-5 { animation: waveScale 1.1s ease-in-out infinite 0.4s; }
      `;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
