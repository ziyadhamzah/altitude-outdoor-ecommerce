import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { StoreHydrator } from '@/components/layout/store-hydrator';
import { BRAND, SITE_DESCRIPTION, SITE_URL } from '@/data/site';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Gear for a Higher Journey`,
    template: `%s — ${BRAND.name}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [
    'outdoor gear',
    'hiking equipment',
    'camping gear',
    'trekking poles',
    'hiking backpack',
    'outdoor apparel',
  ],
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    title: `${BRAND.name} — Gear for a Higher Journey`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/images/editorial/hero-01.jpg', width: 2400, height: 800 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — Gear for a Higher Journey`,
    description: SITE_DESCRIPTION,
    images: ['/images/editorial/hero-01.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#111111',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-offwhite text-ink">
        <StoreHydrator />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
