import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { StoreHydration } from '@/components/providers/StoreHydration';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Embroo India — Custom Embroidery, Reimagined',
  description:
    "India's first 3D embroidery studio. Design custom embroidered hoodies, t-shirts, polos and more. Visualize before you order.",
  keywords: [
    'custom embroidery',
    'embroidered hoodies',
    'custom t-shirts India',
    'embroidery design tool',
    'personalized clothing',
    'embroo india',
  ],
  metadataBase: new URL('https://embroo.in'),
  openGraph: {
    title: 'Embroo India — Custom Embroidery, Reimagined',
    description: "Design. Visualize. Wear. India's first 3D embroidery studio.",
    url: 'https://embroo.in',
    siteName: 'Embroo India',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Embroo India — Custom Embroidery, Reimagined',
    description: "Design. Visualize. Wear. India's first 3D embroidery studio.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="font-[var(--font-body)] antialiased">
        <SessionProvider>
          <StoreHydration />
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
