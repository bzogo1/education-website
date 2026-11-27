import type { Metadata } from 'next';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import InvitationModal from '@/components/InvitationModal';
import FadeInObserver from '@/components/FadeInObserver';

export const metadata: Metadata = {
  metadataBase: new URL('https://tailcast.vercel.app'),
  title: {
    default: 'Tailcast',
    template: '%s - Tailcast',
  },
  description:
    'Open-source dark-themed website template built with Astro and Tailwind CSS. Responsive, fast, and ready to customize.',
  openGraph: {
    type: 'website',
    siteName: 'Tailcast',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1228,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-bgDark2">
      <body className="overflow-x-hidden bg-black">
        <main aria-label="Main content">{children}</main>
        <InvitationModal />
        <FadeInObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
