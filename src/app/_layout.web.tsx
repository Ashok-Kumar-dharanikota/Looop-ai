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
    // Inject global web styles for full window scrolling and typography smoothing
    if (typeof document !== 'undefined') {
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
          background-color: #f6f2ee;
          height: auto !important;
          min-height: 100%;
          overflow-y: auto !important;
          overflow-x: hidden;
        }
        body {
          background-color: #f6f2ee;
          color: #000000;
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
          background-color: #ff2e95;
          color: #ffffff;
        }
        button {
          cursor: pointer;
          border: none;
          outline: none;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
      `;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

