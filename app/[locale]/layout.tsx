import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/HeaderWrapper';
import { generateOrganizationSchema } from '@/utils/organization-schema';
import JsonLdBreadcrumb from '@/components/JsonLdBreadcrumb';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { BASE_URL } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'tr_TR';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  const title = locale === 'tr' 
    ? 'Jizayn - El Yapımı Ahşap Dekorasyon Ürünleri'
    : 'Jizayn - Handmade Wooden Decoration Products';
  
  const description = locale === 'tr'
    ? 'Geleneksel Kumiko tekniği ile üretilen el yapımı ahşap lambalar, duvar saatleri ve dekorasyon ürünleri. %100 doğal malzeme, Türk işçiliği.'
    : 'Handmade wooden lamps, wall clocks and decoration products made with traditional Kumiko technique. 100% natural materials, Turkish craftsmanship.';

  const keywords = locale === 'tr'
    ? 'kumiko, ahşap lamba, el yapımı, dekorasyon, ahşap saat, japon sanatı, doğal ahşap, el emeği, türk malı'
    : 'kumiko, wooden lamp, handmade, decoration, wooden clock, japanese art, natural wood, handcrafted, turkish made';

  return {
    title: {
      default: title,
      template: '%s | Jizayn',
    },
    description,
    keywords,
    authors: [{ name: 'Jizayn' }],
    creator: 'Jizayn',
    publisher: 'Jizayn',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'tr': `${BASE_URL}/tr`,
        'en': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/tr`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      url: `${BASE_URL}/${locale}`,
      title,
      description,
      siteName: 'Jizayn',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jizayn - El Yapımı Ahşap Ürünler',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
      creator: '@jizayn',
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
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Gelen locale parametresinin geçerli olup olmadığını kontrol et
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Request locale'i ayarla (getMessages için gerekli)
  setRequestLocale(locale);

  // Mesajları sunucudan al (locale parametresi ile)
  const messages = await getMessages({ locale });

  // Organization Schema oluştur
  const organizationSchema = generateOrganizationSchema(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GoogleAnalytics gaId="G-XXXXXXXXXX" />
          <JsonLdBreadcrumb />
          <HeaderWrapper>
          <Header />
          </HeaderWrapper>
          <main className="flex-grow">
            {children}
          </main>
          <Footer hideOnHome={true} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}