import Image from 'next/image';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getAllProducts } from '@/data/products';
import { formatPrice } from '@/utils/currency';
import { getTranslations } from 'next-intl/server';
import ProductFilters from '@/components/ProductFilters';
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
    : `${t('title')} ${t('description')} El yapımı ahşap dekorasyon ve mobilya ürünleri. Jizayn`;

  // SEO Keywords
  const keywords = category !== 'all'
    ? `${categoryName}, ${categoryName} ürünleri, ahşap ${categoryName}, el yapımı ${categoryName}, Jizayn ${categoryName}, handmade ${categoryName}, wooden ${categoryName}`
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
    // Varsayılan: En yeniler (ID'ye göre ters sıralama - basit mantık)
    return (parseInt(b.id) || 0) - (parseInt(a.id) || 0);
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
    numberOfItems: filteredProducts.length,
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

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          {category !== 'all' ? categoryName : t('title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
          {category !== 'all' 
            ? `${categoryName} ${t('categoryDescription')}` 
            : t('title') + ' ' + t('description')}
        </p>
      </div>
      
      <ProductFilters />

      {filteredProducts.length > 0 && (
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-8 mb-6">
          {category !== 'all' 
            ? t('categoryProductsHeading', { category: categoryName, count: filteredProducts.length })
            : t('allProductsHeading', { count: filteredProducts.length })}
        </h2>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">{t('noProducts')}</p>
            <p className="text-gray-500 text-sm mb-6">{t('noProductsDescription')}</p>
            <Link 
              href="/products" 
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('categories.all')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => {
            const productData = product.locales[locale as keyof typeof product.locales];
            if (!productData) return null;

            return (
              <Link 
                key={product.id} 
                href={{ pathname: '/products/[slug]', params: { slug: productData.slug } } as any}
                className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  {productData.images && productData.images.length > 0 ? (
                    <Image
                      src={productData.images[0].url}
                      alt={productData.images[0].alt}
                      width={600}
                      height={400}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 6}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">Görsel Yok</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {productData.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {productData.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                    </span>
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">{t('viewProduct')} &rarr;</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}