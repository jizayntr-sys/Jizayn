import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { pathnames } from '@/i18n/pathnames';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'en_US';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${BASE_URL}/${locale}${pathnames['/about'][locale as 'tr' | 'en']}`,
      languages: {
        'en': `${BASE_URL}/en${pathnames['/about'].en}`,
        'tr': `${BASE_URL}/tr${pathnames['/about'].tr}`,
        'x-default': `${BASE_URL}/en${pathnames['/about'].en}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${BASE_URL}/${locale}${pathnames['/about'][locale as 'tr' | 'en']}`,
      siteName: 'Jizayn',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      type: 'website',
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-gray-900 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
             <Image
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
               alt="About Jizayn"
               fill
               className="object-cover"
             />
          </div>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>{t('content.p1')}</p>
            <p>{t('content.p2')}</p>
            <p>{t('content.p3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}