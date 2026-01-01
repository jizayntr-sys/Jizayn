import Image from 'next/image';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { products } from '@/data/products';
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
  }, {
    'x-default': `${BASE_URL}/en/products` // Varsayılan dil
  } as Record<string, string>);

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
    ? `${categoryName} koleksiyonumuzu keşfedin. ${t('title')} - Jizayn`
    : `${t('title')} - Jizayn. El yapımı ahşap dekorasyon ve mobilya ürünleri.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: languages[locale],
      languages,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: languages[locale],
      type: 'website',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
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

  // Filtreleme
  let filteredProducts = products.filter((product) => {
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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: `${t('title')} - Jizayn`,
    url: `${BASE_URL}/${locale === 'tr' ? 'tr/urunler' : 'en/products'}`,
    numberOfItems: filteredProducts.length,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredProducts.map((product, index) => {
        const pData = product.locales[locale as keyof typeof product.locales];
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: pData ? `${BASE_URL}/${locale === 'tr' ? 'tr/urunler' : 'en/products'}/${pData.slug}` : '',
          name: pData?.name
        };
      })
    }
  };

  // Seçilen kategori ismini al
  const categoryName = category !== 'all' ? t(`categories.${category}` as any) : '';

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {category !== 'all' ? categoryName : t('title')}
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {category !== 'all' 
            ? `${categoryName} kategorisindeki özel tasarım el yapımı ürünlerimizi inceleyin. Doğal malzemeler ve eşsiz işçilik.` 
            : t('title') + ' koleksiyonumuzda eviniz için en özel parçaları bulabilirsiniz.'}
        </p>
      </div>
      
      <ProductFilters />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Bu kategoride ürün bulunamadı.
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
                  <Image
                    src={productData.images[0].url}
                    alt={productData.images[0].alt}
                    width={600}
                    height={400}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 6}
                  />
                </div>
                
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {productData.name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {productData.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                    </span>
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">İncele &rarr;</span>
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