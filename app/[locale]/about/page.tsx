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

  const languages: Record<string, string> = {
    'en': `${BASE_URL}/en${pathnames['/about'].en}`,
    'tr': `${BASE_URL}/tr${pathnames['/about'].tr}`,
    'x-default': `${BASE_URL}/en${pathnames['/about'].en}`,
  };

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${BASE_URL}/${locale}${pathnames['/about'][locale as 'tr' | 'en']}`,
      languages,
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
      <div className="bg-gray-900 pt-28 pb-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Section 1: Jizayn'ın Hikayesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-100 to-orange-100">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <span className="text-6xl">🏗️</span>
             </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('content.section1Title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t('content.p1')}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Tasarım Felsefesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('content.section2Title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t('content.p2')}</p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg order-1 md:order-2 bg-gradient-to-br from-indigo-100 to-blue-100">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <span className="text-6xl">🎨</span>
             </div>
          </div>
        </div>

        {/* Section 3: Sürdürülebilirlik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-green-100 to-emerald-100">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <span className="text-6xl">🌳</span>
             </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('content.section3Title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t('content.p3')}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Misyon & Vizyon */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('content.section4Title')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto text-center">{t('content.p4')}</p>
        </div>

        {/* Section 5: Değerlerimiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('content.section5Title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t('content.p5')}</p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg order-1 md:order-2 bg-gradient-to-br from-rose-100 to-pink-100">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <span className="text-6xl">⭐</span>
             </div>
          </div>
        </div>

        {/* Section 6: Neden Jizayn */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('content.section6Title')}</h2>
          <p className="text-lg leading-relaxed max-w-4xl mx-auto text-center opacity-95">{t('content.p6')}</p>
        </div>
      </div>
    </div>
  );
}