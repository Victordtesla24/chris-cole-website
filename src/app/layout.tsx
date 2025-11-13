import type { Metadata } from 'next';
import { spaceGrotesk } from './fonts';
import './globals.css';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CursorTrail from '@/components/animations/CursorTrail';
import LoadingOverlay from '@/components/animations/LoadingOverlay';
import ParallaxStars from '@/components/animations/ParallaxStars';
import DriftingSpaceships from '@/components/animations/DriftingSpaceships';
import Constellation from '@/components/animations/Constellation';

export const metadata: Metadata = {
  title: 'Chris Cole - Creative Director & Designer',
  description: 'Portfolio of Chris Cole: Web design, branding, product, packaging. Over a decade in tech.',
  keywords: ['web design', 'branding', 'creative director', 'portfolio'],
  authors: [{ name: 'Chris Cole' }],
  openGraph: {
    title: 'Chris Cole Portfolio',
    description: 'Creative Director specializing in web, branding, product',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Cole Portfolio',
    description: 'Creative Director & Designer',
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://localhost:3001'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <LoadingOverlay />
          <ParallaxStars />
          <Constellation />
          <CursorTrail />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
