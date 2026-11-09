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

  const heroImage = '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-ayna-onunde-konsol-ustunde.webp';

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
      images: [`${BASE_URL}${heroImage}`],
    },
  };
}

const aboutImages = [
  { src: '/JizaynAtolye-v2.webp', altKey: 'image1Alt' as const },
  { src: '/images/about/jizayn-kumiko-el-detay.webp', altKey: 'image2Alt' as const },
  { src: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-salon-sehpa-ustunde.webp', altKey: 'image3Alt' as const },
  { src: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-antre-konsol-ustunde.webp', altKey: 'image4Alt' as const },
];

const heroImage = '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-ayna-onunde-konsol-ustunde.webp';
const founderImage = '/images/about/jizayn-usta-calisirken.webp';
const missionImage = '/images/about/jizayn-atolye-genis.webp';
const ctaImage = '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-komodin-ustunde-gece.webp';

function AboutImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-stone-200/70 bg-stone-100">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const facts = t.raw('content.facts') as { label: string; value: string }[];

  return (
    <div className="bg-stone-50">
      {/* Header Section */}
      <div className="relative bg-stone-900 pt-28 pb-24 md:pb-28 text-center text-white overflow-hidden min-h-[420px] flex items-center">
        <Image
          src={heroImage}
          alt={t('content.imageHeroAlt')}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-amber-400/90 text-sm uppercase tracking-[0.2em] mb-4 font-medium">Jizayn</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 drop-shadow-lg">{t('title')}</h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>
      </div>

      {/* Facts Strip */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {facts.map((f, i) => (
              <div
                key={i}
                className="px-4 py-6 md:py-7 text-center border-stone-200 [&:nth-child(odd)]:border-r md:[&:not(:first-child)]:border-l md:[&:nth-child(odd)]:border-r-0 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0"
              >
                <dt className="text-xs uppercase tracking-wider text-stone-500 mb-1">{f.label}</dt>
                <dd className="text-lg md:text-xl font-semibold text-stone-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Founder / Usta */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center mb-20 md:mb-24">
          <div className="md:col-span-2">
            <AboutImage src={founderImage} alt={t('content.imageFounderAlt')} />
          </div>
          <div className="md:col-span-3 space-y-5">
            <p className="text-amber-700 text-sm uppercase tracking-[0.15em] font-medium">{t('content.founderRole')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('content.founderName')}</h2>
            <blockquote className="text-xl md:text-2xl font-medium text-stone-800 leading-snug border-l-4 border-amber-500 pl-4">
              “{t('content.founderQuote')}”
            </blockquote>
            <p className="text-lg text-stone-600 leading-relaxed">{t('content.founderStory')}</p>
          </div>
        </div>

        {/* Section 1: Jizayn'ın Hikayesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-24">
          <AboutImage src={aboutImages[0].src} alt={t(`content.${aboutImages[0].altKey}`)} />
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">{t('content.section1Title')}</h2>
              <p className="text-lg text-stone-600 leading-relaxed">{t('content.p1')}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Tasarım Felsefesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-24">
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">{t('content.section2Title')}</h2>
              <p className="text-lg text-stone-600 leading-relaxed">{t('content.p2')}</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <AboutImage src={aboutImages[1].src} alt={t(`content.${aboutImages[1].altKey}`)} />
          </div>
        </div>

        {/* Section 3: Sürdürülebilirlik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-24">
          <AboutImage src={aboutImages[2].src} alt={t(`content.${aboutImages[2].altKey}`)} />
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">{t('content.section3Title')}</h2>
              <p className="text-lg text-stone-600 leading-relaxed">{t('content.p3')}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Misyon & Vizyon */}
        <div className="relative rounded-2xl overflow-hidden mb-20 md:mb-24 shadow-lg">
          <div className="absolute inset-0">
            <Image
              src={missionImage}
              alt={t('content.imageWorkshopWideAlt')}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-stone-900/75" />
          </div>
          <div className="relative z-10 p-8 md:p-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('content.section4Title')}</h2>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto text-stone-100">{t('content.p4')}</p>
          </div>
        </div>

        {/* Section 5: Değerlerimiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-20 md:mb-24">
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">{t('content.section5Title')}</h2>
              <p className="text-lg text-stone-600 leading-relaxed">{t('content.p5')}</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <AboutImage src={aboutImages[3].src} alt={t(`content.${aboutImages[3].altKey}`)} />
          </div>
        </div>

        {/* Section 6: Neden Jizayn */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src={ctaImage}
              alt={t('content.imageCtaAlt')}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/85 to-stone-900/90" />
          </div>
          <div className="relative z-10 p-8 md:p-14 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t('content.section6Title')}</h2>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto text-center text-stone-100">{t('content.p6')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
