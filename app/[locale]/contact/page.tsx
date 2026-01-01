import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { pathnames } from '@/i18n/pathnames';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'en_US';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${BASE_URL}/${locale}${pathnames['/contact'][locale as 'tr' | 'en']}`,
      languages: {
        'en': `${BASE_URL}/en${pathnames['/contact'].en}`,
        'tr': `${BASE_URL}/tr${pathnames['/contact'].tr}`,
        'x-default': `${BASE_URL}/en${pathnames['/contact'].en}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${BASE_URL}/${locale}${pathnames['/contact'][locale as 'tr' | 'en']}`,
      siteName: 'Jizayn',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      type: 'website',
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-gray-900 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('info.title')}</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('info.addressLabel')}</h3>
                  <p className="text-gray-600">{t('info.address')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('info.emailLabel')}</h3>
                  <a href={`mailto:${t('info.email')}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {t('info.email')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('info.phoneLabel')}</h3>
                  <a href={`tel:${t('info.phone')}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {t('info.phone')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.name')}</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.email')}</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.message')}</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t('form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}