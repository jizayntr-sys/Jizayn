import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/HeaderWrapper';
import { generateOrganizationSchema } from '@/utils/organization-schema';
import JsonLdBreadcrumb from '@/components/JsonLdBreadcrumb';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

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