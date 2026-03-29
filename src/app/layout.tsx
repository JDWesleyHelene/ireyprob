import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import '../styles/tailwind.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SplashScreen from '@/components/SplashScreen';
import CookieBanner from '@/components/CookieBanner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import FontController from '@/components/FontController';
import PageLoader from '@/components/PageLoader';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  preload: true,
  adjustFontFallback: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ireyprob.vercel.app'),
  title: {
    default: 'IREY PROD — Booking Agency & Event Production | Mauritius Island',
    template: '%s — IREY PROD',
  },
  description: 'IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.',
  keywords: ['booking agency', 'event production', 'Mauritius', 'artist management', 'IREY PROD'],
  openGraph: {
    title: 'IREY PROD — Your Gateway to Unforgettable Experiences',
    description: 'Booking agency & event production based in Mauritius Island.',
    images: [{ url: '/assets/images/IREY-PROD-BLACK-1773496673088.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'IREY PROD', description: 'Booking agency & event production — Mauritius Island.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="bg-background text-foreground antialiased font-sans">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <PageLoader />
        <SplashScreen />
        <FontController />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
