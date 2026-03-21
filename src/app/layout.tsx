import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { DM_Sans, Fraunces } from 'next/font/google';
import '../styles/tailwind.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SplashScreen from '@/components/SplashScreen';
import CookieBanner from '@/components/CookieBanner';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Font optimization: load via next/font instead of CSS @import
// This eliminates render-blocking font requests and enables automatic font preloading
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  preload: true,
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700', '900'],
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://new.ireyprod.com'),
  title: {
    default: 'IREY PROD — Booking Agency & Event Production | Mauritius Island',
    template: '%s — IREY PROD',
  },
  description: 'IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.',
  keywords: ['IREY PROD', 'booking agency', 'Mauritius', 'reggae', 'dub', 'world music', 'event production'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://new.ireyprod.com',
    siteName: 'IREY PROD',
    images: [{ url: '/assets/images/IREY-PROD-BLACK-1773496673088.png', width: 1200, height: 630, alt: 'IREY PROD — Booking Agency & Event Production' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IREY PROD — Booking Agency & Event Production',
    description: 'Dynamic booking agency and event production based in Mauritius Island.',
    images: ['/assets/images/IREY-PROD-BLACK-1773496673088.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico',   type: 'image/x-icon', sizes: 'any' },
      { url: '/icon-32.png',   type: 'image/png',    sizes: '32x32' },
      { url: '/icon-192.png',  type: 'image/png',    sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <LanguageProvider>
          <SplashScreen />
          {children}
          <CookieBanner />
        </LanguageProvider>
</body>
    </html>
  );
}
