import Image from 'next/image';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getAllProducts } from '@/data/products';
import { formatLocalizedPrice } from '@/utils/currency';
import { getTranslations } from 'next-intl/server';
import ProductFilters from '@/components/ProductFilters';
import FadeIn from '@/components/FadeIn';
import StaggerContainer from '@/components/StaggerContainer';
import { ArrowRight } from 'lucide-react';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'productsPage' });

  const uniqueLocales = Array.from(new Set(routing.locales));
  const languages = uniqueLocales.reduce((acc, l) => {
    acc[l] = `${BASE_URL}${l === 'tr' ? '/tr/urunler' : '/en/products'}`;
    return acc;
  }, {} as Record<string, string>);

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'en_US';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  // Kategoriye göre dinamik başlık ve açıklama
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const categoryName = category !== 'all' ? t(`categories.${category}` as any) : '';
  
  const pageTitle = category !== 'all' 
    ? `${categoryName} | Jizayn` 
    : t('title');
    
  const pageDescription = category !== 'all'
    ? `${categoryName} ${t('categoryDescription')} ${t('title')} - Jizayn`
    : locale === 'tr'
    ? `${t('title')} ${t('description')} El yapımı ahşap dekorasyon ve mobilya ürünleri. Jizayn`
    : `${t('title')} ${t('description')} Handmade wooden decoration and furniture products. Jizayn`;

  // SEO Keywords
  const keywords = category !== 'all'
    ? locale === 'tr'
      ? `${categoryName}, ${categoryName} ürünleri, ahşap ${categoryName}, el yapımı ${categoryName}, Jizayn ${categoryName}`
      : `${categoryName}, ${categoryName} products, wooden ${categoryName}, handmade ${categoryName}, Jizayn ${categoryName}`
    : locale === 'tr'
    ? 'el yapımı ahşap ürünler, ahşap dekorasyon, ahşap mobilya, doğal ahşap, dekoratif ahşap, Jizayn ürünleri, handmade wood products, wooden decoration'
    : 'handmade wood products, wooden decoration, wooden furniture, natural wood, decorative wood, Jizayn products, el yapımı ahşap';

  const alternateLanguages: Record<string, string> = { 
    ...languages,
    'x-default': `${BASE_URL}/en/products`,
  };

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: languages[locale],
      languages: alternateLanguages,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: languages[locale],
      siteName: 'Jizayn',
      type: 'website',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      images: [
        {
          url: `${BASE_URL}/JizaynAtolye.webp`,
          width: 1200,
          height: 630,
          alt: category !== 'all' ? `${categoryName} - Jizayn` : 'Jizayn Ürünler',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`${BASE_URL}/JizaynAtolye.webp`],
      creator: '@jizayn',
      site: '@jizayn',
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'productsPage' });

  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'newest';
  const searchQuery = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search.toLocaleLowerCase(locale) : '';
  const minPrice = Number(resolvedSearchParams.minPrice) || 0;
  const maxPrice = Number(resolvedSearchParams.maxPrice) || Infinity;

  // Tüm ürünleri getir
  let allProducts: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    allProducts = await getAllProducts(locale);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Continue with empty products array
  }

  // Filtreleme
  let filteredProducts = allProducts.filter((product) => {
    // Mevcut dil için ürün verisi var mı kontrol et
    const productData = product.locales[locale as keyof typeof product.locales];
    if (!productData) return false;
    
    // Fiyat filtresi
    const price = productData.priceRange.min;
    if (price < minPrice || price > maxPrice) return false;

    if (category !== 'all' && product.category !== category) return false;

    if (searchQuery) {
      const matchesSearch = productData.name.toLocaleLowerCase(locale).includes(searchQuery) || 
                            productData.description.toLocaleLowerCase(locale).includes(searchQuery);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Sıralama
  filteredProducts.sort((a, b) => {
    const priceA = a.locales[locale as keyof typeof a.locales]?.priceRange.min || 0;
    const priceB = b.locales[locale as keyof typeof b.locales]?.priceRange.min || 0;

    if (sort === 'priceAsc') {
      return priceA - priceB;
    } else if (sort === 'priceDesc') {
      return priceB - priceA;
    }
    
    // Varsayılan sıralama: sortOrder'a göre (sizin belirlediğiniz sıra)
    // sortOrder değeri veritabanından zaten sıralı geliyor, bu sadece frontend filtreleme sonrası için
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  // Seçilen kategori ismini al (collectionSchema'dan önce tanımlanmalı)
  const categoryName = category !== 'all' ? t(`categories.${category}` as any) : '';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category !== 'all' ? `${categoryName} - Jizayn` : t('title'),
    description: category !== 'all'
      ? `${categoryName} ${t('categoryDescription')} ${t('title')} - Jizayn`
      : `${t('title')} ${t('description')} El yapımı ahşap dekorasyon ve mobilya ürünleri. Jizayn`,
    url: `${BASE_URL}/${locale === 'tr' ? 'tr/urunler' : 'en/products'}${category !== 'all' ? `?category=${category}` : ''}`,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.map((product, index) => {
        const pData = product.locales[locale as keyof typeof product.locales];
        if (!pData) return null;
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `${BASE_URL}/${locale === 'tr' ? 'tr/urunler' : 'en/products'}/${pData.slug}`,
          name: pData.name,
          image: pData.images[0]?.url,
          description: pData.description?.substring(0, 160),
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null)
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'tr' ? 'Ana Sayfa' : 'Home',
          item: `${BASE_URL}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category !== 'all' ? categoryName : (locale === 'tr' ? 'Ürünler' : 'Products'),
          item: `${BASE_URL}/${locale === 'tr' ? 'tr/urunler' : 'en/products'}`,
        },
      ],
    },
  };

  // Hero için kısa, profesyonel alt başlık (uzun SEO metni en altta gösterilir)
  const heroSubtitle = category !== 'all'
    ? (locale === 'tr' ? `${categoryName} koleksiyonu` : `${categoryName} collection`)
    : (locale === 'tr'
        ? 'Doğal ahşaptan, el emeğiyle üretilen özel parçalar.'
        : 'Special pieces handcrafted from natural wood.');

  // Sayfa altındaki SEO açıklama metni
  const seoText = category !== 'all'
    ? `${categoryName} ${t('categoryDescription')}`
    : `${t('title')} ${t('description')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Markalı Hero Şeridi */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/JizaynAtolye.webp"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-900/70 to-stone-900/80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center text-white">
          <FadeIn>
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-white/90">
                {category !== 'all' ? categoryName : (locale === 'tr' ? 'Ürünler' : 'Products')}
              </span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg">
              {category !== 'all' ? categoryName : t('title')}
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
              {heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-10 sm:-mt-14 relative z-10">
        <ProductFilters />

        {filteredProducts.length > 0 && (
          <h2 className="text-lg sm:text-xl font-semibold text-stone-800 mt-8 mb-6">
            {category !== 'all'
              ? t('categoryProductsHeading', { category: categoryName, count: filteredProducts.length })
              : t('allProductsHeading', { count: filteredProducts.length })}
          </h2>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 mt-8">
            <div className="max-w-md mx-auto px-4">
              <svg className="w-20 h-20 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium text-stone-900 mb-2">{t('noProducts')}</p>
              <p className="text-stone-500 text-sm mb-6">{t('noProductsDescription')}</p>
              <Link
                href="/products"
                className="inline-block bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-700 transition-colors"
              >
                {t('categories.all')}
              </Link>
            </div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => {
              const productData = product.locales[locale as keyof typeof product.locales];
              if (!productData) return null;

              const categoryBadge = ['lighting', 'decor', 'furniture'].includes(product.category)
                ? t(`categories.${product.category}` as any)
                : null;

              return (
                <Link
                  key={product.id}
                  href={{ pathname: '/products/[slug]', params: { slug: productData.slug } } as any}
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
                    {productData.images && productData.images.length > 0 ? (
                      <Image
                        src={productData.images[0].url}
                        alt={productData.images[0].alt}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 6}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                        <span className="text-stone-400 text-sm">{locale === 'tr' ? 'Görsel Yok' : 'No Image'}</span>
                      </div>
                    )}
                    {categoryBadge && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        {categoryBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="text-lg font-semibold mb-2 text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {productData.name}
                    </h3>
                    <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-grow">
                      {productData.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <span className="text-lg font-bold text-stone-900">
                        {formatLocalizedPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 group-hover:gap-2 transition-all">
                        {t('viewProduct')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </StaggerContainer>
        )}

        {/* SEO açıklama metni */}
        <div className="mt-14 max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed text-center">
            {seoText}
          </p>
        </div>
      </div>
    </div>
  );
}