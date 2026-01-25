import { getTranslations, getLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getAllProducts } from '@/data/products';
import { ArrowRight, CheckCircle, Leaf, Palette, ShieldCheck, Recycle, UserCheck } from 'lucide-react';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CustomerReviewsCarousel from '@/components/CustomerReviewsCarousel';
import FadeIn from '@/components/FadeIn';
import ScrollSection from '@/components/ScrollSection';
import StaggerContainer from '@/components/StaggerContainer';
import SectionScroller from '@/components/SectionScroller';
import MouseScrollIndicator from '@/components/MouseScrollIndicator';
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
    <main className="relative scroll-smooth snap-y snap-mandatory overflow-y-auto">
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
      <SectionScroller sectionId="hero" className="relative z-10 h-screen snap-start snap-always flex items-center justify-center overflow-hidden">
        <h1 className="sr-only">{t('hero.title')}</h1>
        {/* İçerik */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
          <FadeIn>
            <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-lg px-2" role="heading" aria-level={1}>
              {(() => {
                const title = t('hero.title');
                // Kelimelere ayır, boşlukları ve noktalama işaretlerini koru
                const parts = title.split(/(\s+|,|\.)/);
                const colors = ['text-blue-400', 'text-gray-100', 'text-green-400', 'text-purple-400'];
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
        
        {/* Scroll Indicator */}
        <MouseScrollIndicator />
      </SectionScroller>

      {/* Öne Çıkan Ürünler */}
      <SectionScroller sectionId="featured" className="relative z-10 min-h-screen md:h-screen snap-start snap-always flex items-center justify-center bg-amber-950/30 backdrop-blur-sm transition-colors duration-700 py-12 md:py-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 relative">
          <ScrollSection animation="slide-right">
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('featured.title')}</h2>
              <Link href="/products" className="text-white/90 font-medium hover:text-white flex items-center gap-1 transition-colors text-sm md:text-base">
                {t('featured.viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollSection>
          
          <ScrollSection animation="scale" delay={0.2}>
            <FeaturedCarousel products={featuredProducts} locale={locale} />
          </ScrollSection>
        </div>
      </SectionScroller>

      {/* Özellikler Bölümü (Neden Jizayn) */}
      <SectionScroller sectionId="features" className="relative z-10 min-h-screen md:h-screen snap-start snap-always flex items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-colors duration-700 py-12 md:py-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative">
          <ScrollSection animation="slide-up">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white px-2">{t('features.title')}</h2>
            </div>
          </ScrollSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6" staggerDelay={0.15}>
            {/* El Yapımı */}
            <Link href="/products" className="block bg-indigo-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-indigo-300/20 text-center hover:bg-indigo-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <Palette className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.handmade.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.handmade.desc')}</p>
            </Link>
            
            {/* Doğal Malzeme */}
            <Link href="/products" className="block bg-green-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-green-300/20 text-center hover:bg-green-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <Leaf className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.natural.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.natural.desc')}</p>
            </Link>
            
            {/* Özgün Tasarım */}
            <Link href="/products" className="block bg-orange-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-orange-300/20 text-center hover:bg-orange-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.design.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.design.desc')}</p>
            </Link>
            
            {/* Dayanıklılık */}
            <Link href="/products" className="block bg-blue-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-blue-300/20 text-center hover:bg-blue-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.durability.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.durability.desc')}</p>
            </Link>
            
            {/* Sürdürülebilir */}
            <Link href="/products" className="block bg-emerald-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-emerald-300/20 text-center hover:bg-emerald-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <Recycle className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.sustainable.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.sustainable.desc')}</p>
            </Link>
            
            {/* Kişiye Özel */}
            <Link href="/products" className="block bg-rose-500/10 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-rose-300/20 text-center hover:bg-rose-500/20 transition-all h-full group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-125 group-hover:bg-white group-hover:text-rose-600 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                <UserCheck className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t('features.custom.title')}</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-snug sm:leading-relaxed">{t('features.custom.desc')}</p>
            </Link>
          </StaggerContainer>
        </div>
      </SectionScroller>

      {/* Müşteri Yorumları Slider */}
      <SectionScroller sectionId="reviews" className="relative z-10 min-h-screen md:h-screen snap-start snap-always flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm transition-colors duration-700 py-12 md:py-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative">
          <ScrollSection animation="slide-left">
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('reviews.title')}</h2>
            </div>
          </ScrollSection>
          <ScrollSection animation="fade" delay={0.2}>
            <CustomerReviewsCarousel />
          </ScrollSection>
        </div>
      </SectionScroller>

      {/* Footer Section - Son bölüm, animasyonsuz */}
      <section id="footer" className="relative z-10 snap-start snap-always bg-gradient-to-b from-transparent via-black/40 to-black/70">
        <div className="min-h-[60vh] flex items-end">
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </section>
    </main>
  );
}