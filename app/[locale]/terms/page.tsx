import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  const baseUrl = 'https://www.jizayn.com';
  
  const pathTr = '/kullanim-kosullari';
  const pathEn = '/terms-of-use';
  const localizedPath = locale === 'tr' ? pathTr : pathEn;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}${localizedPath}`,
      languages: locale === 'en'
        ? {
            'en': `${baseUrl}/en${pathEn}`,
            'tr': `${baseUrl}/tr${pathTr}`,
            'x-default': `${baseUrl}/en${pathEn}`,
          }
        : {
            'en': `${baseUrl}/en${pathEn}`,
            'tr': `${baseUrl}/tr${pathTr}`,
          },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}${localizedPath}`,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-wood-700">{t('title')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">{t('lastUpdated')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-wood-700">{t('section1.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('section1.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-wood-700">{t('section2.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('section2.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-wood-700">{t('section3.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('section3.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-wood-700">{t('section4.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('section4.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-wood-700">{t('section5.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('section5.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

