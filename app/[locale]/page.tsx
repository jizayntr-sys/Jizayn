import { getTranslations, getLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getAllProducts } from '@/data/products';
import { ArrowRight, CheckCircle, Leaf, Palette, ShieldCheck, Recycle, Search, Settings, Clock, UserCheck } from 'lucide-react';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CustomerReviewsCarousel from '@/components/CustomerReviewsCarousel';
import FadeIn from '@/components/FadeIn';
import Footer from '@/components/Footer';
import SectionBackgroundController from '@/components/SectionBackgroundController';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const tHome = await getTranslations({ locale, namespace: 'home' });

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'en_US';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  // SEO Keywords
  const keywords = locale === 'tr' 
    ? 'el yapımı ahşap, ahşap dekorasyon, ahşap mobilya, el yapımı mobilya, doğal ahşap ürünler, dekoratif ahşap, ahşap kutu, ahşap duvar saati, ahşap masa, ahşap sandalye, Jizayn, handmade wood, wooden decoration'
    : 'handmade wood, wooden decoration, wooden furniture, handmade furniture, natural wood products, decorative wood, wooden box, wooden wall clock, wooden table, wooden chair, Jizayn, el yapımı ahşap';

  // Enhanced description
  const description = locale === 'tr'
    ? `${t('subtitle')} El yapımı ahşap dekorasyon ve mobilya ürünleri. Doğal malzemelerden üretilmiş, özenle tasarlanmış ahşap ürünler. Jizayn ile evinize doğallık katın.`
    : `${t('subtitle')} Handmade wooden decoration and furniture products. Carefully designed wooden products made from natural materials. Add naturalness to your home with Jizayn.`;

  const languages: Record<string, string> = {
    'en': `${BASE_URL}/en`,
    'tr': `${BASE_URL}/tr`,
    'x-default': `${BASE_URL}/en`,
  };

  return {
    title: t('title'),
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      title: t('title'),
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: 'Jizayn',
      images: [
        {
          url: `${BASE_URL}/JizaynAtolye.webp`,
          width: 1200,
          height: 630,
          alt: locale === 'tr' ? 'Jizayn El Yapımı Ahşap Ürünler Atölyesi' : 'Jizayn Handmade Wood Products Workshop',
        },
      ],
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description,
      images: [`${BASE_URL}/JizaynAtolye.webp`],
      creator: '@jizayn',
      site: '@jizayn',
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('home');
  const locale = await getLocale();

  // Öne çıkan ürünler (slider için)
  let featuredProducts: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    const allProducts = await getAllProducts();
    featuredProducts = allProducts.slice(0, 8);
  } catch (error) {
    console.error('Error fetching products for homepage:', error);
    // Continue with empty products array
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jizayn',
    url: BASE_URL,
    inLanguage: locale,
    description: locale === 'tr' 
      ? 'El yapımı ahşap dekorasyon ve mobilya ürünleri. Doğal malzemelerden üretilmiş, özenle tasarlanmış ahşap ürünler.'
      : 'Handmade wooden decoration and furniture products. Carefully designed wooden products made from natural materials.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/${locale}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Arka Plan Kontrolcüsü */}
      <SectionBackgroundController />

      {/* Global Fixed Background (Tüm sayfa için sabit arka plan) */}
      <div className="fixed inset-0 -z-20">
           <Image
             src="/JizaynAtolye.webp"
             alt={t('hero.imageAlt')}
             fill
             className="object-cover brightness-[0.6]"
             priority
             sizes="100vw"
           />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-0 pointer-events-none" />
      </div>

      {/* Hero Section Content */}
      <section id="hero" className="relative z-10 h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <h1 className="sr-only">{t('hero.title')}</h1>
        {/* İçerik */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
          <FadeIn>
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-lg px-2" role="heading" aria-level={1}>
              {(() => {
                const title = t('hero.title');
                // Kelimelere ayır, boşlukları ve noktalama işaretlerini koru
                const parts = title.split(/(\s+|,|\.)/);
                const colors = ['text-orange-400', 'text-green-400', 'text-blue-400', 'text-yellow-400'];
                let wordIndex = 0;
                return parts.map((part, index) => {
                  // Boşluk veya noktalama işareti ise olduğu gibi döndür
                  if (part.trim() === '' || part === ',' || part === '.') {
                    return <span key={index}>{part}</span>;
                  }
                  // Kelime ise renklendir
                  const color = colors[wordIndex % colors.length];
                  wordIndex++;
                  return (
                    <span key={index} className={color}>
                      {part}
                    </span>
                  );
                });
              })()}
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 max-w-2xl mx-auto text-gray-100 leading-relaxed drop-shadow-md px-2">
              {t('hero.subtitle')}
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              {t('hero.cta')}
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section id="features" className="relative z-10 min-h-screen flex items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-colors duration-700">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white px-2">{t('features.title')}</h2>
            </div>
          </FadeIn>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-2 sm:px-0 md:grid md:grid-cols-3 md:gap-8 md:gap-y-12 md:overflow-visible">
            <FadeIn delay={200} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Palette className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.handmade.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.handmade.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={400} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Leaf className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.natural.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.natural.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={600} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.design.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.design.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={200} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.durability.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.durability.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={400} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Recycle className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.sustainable.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.sustainable.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={600} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-purple-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Search className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.details.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.details.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={200} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-cyan-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Settings className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.functional.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.functional.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={400} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-amber-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.timeless.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.timeless.desc')}</p>
              </Link>
            </FadeIn>
            <FadeIn delay={600} className="w-[280px] sm:w-72 flex-shrink-0 md:w-auto snap-start">
              <Link href="/products" className="block bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 text-center hover:bg-white/20 transition-all h-full group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-125 group-hover:bg-white group-hover:text-rose-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                  <UserCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t('features.custom.title')}</h3>
                <p className="text-sm sm:text-base text-gray-200">{t('features.custom.desc')}</p>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section id="featured" className="relative z-10 min-h-screen flex items-center justify-center bg-amber-950/30 backdrop-blur-sm transition-colors duration-700">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold text-white">{t('featured.title')}</h2>
              <Link href="/products" className="text-white/90 font-medium hover:text-white flex items-center gap-1 transition-colors">
                {t('featured.viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <FeaturedCarousel products={featuredProducts} locale={locale} />
          </FadeIn>
        </div>
      </section>

      {/* Müşteri Yorumları Slider */}
      <section id="reviews" className="relative z-10 min-h-screen flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm transition-colors duration-700">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold text-white">{t('reviews.title')}</h2>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <CustomerReviewsCarousel />
          </FadeIn>
        </div>
      </section>

      {/* Footer Section */}
      <section id="footer" className="relative z-10">
        <Footer />
      </section>
    </main>
  );
}