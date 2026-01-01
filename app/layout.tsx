import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  manifest: '/manifest.webmanifest',
  metadataBase: new URL('https://www.jizayn.com'),
  title: {
    default: 'Jizayn - Ahşap Dekoratif Ürünler',
    template: '%s | Jizayn',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/JizaynLogo.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  description: 'Jizayn ile el yapımı ahşap dekoratif ürünleri keşfedin. Evinize doğallık katacak özel tasarım mobilya, aksesuar ve dekorasyon ürünleri.',
  keywords: ['ahşap dekoratif ürünler', 'el yapımı mobilya', 'ahşap dekorasyon', 'özel tasarım'],
  authors: [{ name: 'Jizayn' }],
  creator: 'Jizayn',
  publisher: 'Jizayn',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.jizayn.com',
    siteName: 'Jizayn',
    title: 'Jizayn - Ahşap Dekoratif Ürünler',
    description: 'Jizayn ile el yapımı ahşap dekoratif ürünleri keşfedin. Evinize doğallık katacak özel tasarım mobilya, aksesuar ve dekorasyon ürünleri.',
    images: [
      {
        url: 'https://www.jizayn.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jizayn - Ahşap Dekoratif Ürünler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jizayn - Ahşap Dekoratif Ürünler',
    description: 'Jizayn ile el yapımı ahşap dekoratif ürünleri keşfedin. Evinize doğallık katacak özel tasarım mobilya, aksesuar ve dekorasyon ürünleri.',
    creator: '@jizayn',
    images: ['https://www.jizayn.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'x-dns-prefetch-control': 'on',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // HTML tag'i locale layout'ta (app/[locale]/layout.tsx) tanımlı
  // Root layout sadece children'ı render eder
  return (
    <>
      {children}
    </>
  );
}

