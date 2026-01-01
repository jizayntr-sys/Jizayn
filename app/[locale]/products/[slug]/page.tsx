import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/currency';
import StockNotificationForm from '@/components/StockNotificationForm';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';
import FAQ from '@/components/FAQ';
import ShareButtons from '@/components/ShareButtons';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const product = products.find((p) => {
    const localeData = p.locales[locale as keyof typeof p.locales];
    return localeData?.slug === slug;
  });

  if (!product) {
    return {};
  }

  const productData = product.locales[locale as keyof typeof product.locales];

  // Canonical ve alternate linkleri oluştur
  const uniqueLocales = Array.from(new Set(routing.locales));
  const languages = uniqueLocales.reduce((acc, l) => {
    const lData = product.locales[l as keyof typeof product.locales];
    if (lData?.slug) {
      const localizedPath = pathnames['/products'][l as keyof typeof pathnames['/products']];
      acc[l] = `${BASE_URL}/${l}${localizedPath}/${lData.slug}`;
    }
    return acc;
  }, {} as Record<string, string>);

  // x-default sadece EN sayfasında eklenmeli (TR sayfasında eklenmemeli)
  // Bu, Google'ın "multiple entries" uyarısını önler
  if (locale === 'en') {
    const defaultProductData = product.locales['en'];
    if (defaultProductData?.slug) {
      languages['x-default'] = `${BASE_URL}/en/products/${defaultProductData.slug}`;
    }
  }

  const currentProductsPath = pathnames['/products'][locale as keyof typeof pathnames['/products']];
  const canonicalUrl = `${BASE_URL}/${locale}${currentProductsPath}/${slug}`;

  const ogImage = productData?.images[0]?.url || '';

  const localeMap: Record<string, string> = { tr: 'tr_TR', en: 'en_US' };
  const ogLocale = localeMap[locale] || 'en_US';
  const alternateLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  // Meta keywords oluştur (ürün adı, kategori, malzemeler)
  const metaKeywords = [
    productData.name,
    product.category,
    ...(productData.materials ? productData.materials.split(',').map(m => m.trim()) : []),
    ...(productData.metaKeywords || []),
    'handmade',
    'wood',
    'decorative',
    locale === 'tr' ? 'ahşap' : 'wooden',
    locale === 'tr' ? 'el yapımı' : 'handcrafted',
    locale === 'tr' ? 'doğal ahşap' : 'natural wood',
    'Jizayn',
  ].filter(Boolean).join(', ');

  // Enhanced description with price and key features
  const enhancedDescription = locale === 'tr'
    ? `${productData.name}. ${productData.description?.substring(0, 120)}... El yapımı, doğal malzemelerden üretilmiş. Fiyat: ${formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}. Jizayn.`
    : `${productData.name}. ${productData.description?.substring(0, 120)}... Handmade, made from natural materials. Price: ${formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}. Jizayn.`;

  return {
    title: productData?.name, // Layout otomatik olarak "| Jizayn" ekleyecektir
    description: enhancedDescription.substring(0, 160), // Meta açıklama için ideal uzunluk
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: productData?.name,
      description: enhancedDescription.substring(0, 200),
      url: canonicalUrl,
      siteName: 'Jizayn',
      images: productData.images.map((img, index) => ({
        url: img.url,
        width: index === 0 ? 1200 : 800,
        height: index === 0 ? 630 : 600,
        alt: img.alt || productData.name,
        type: 'image/jpeg',
      })),
      type: 'website',
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      ...(productData.priceRange && {
        'product:price:amount': productData.priceRange.min.toString(),
        'product:price:currency': productData.priceRange.currency,
      }),
      ...(productData.availability && {
        'product:availability': productData.availability === 'InStock' ? 'in stock' : 'out of stock',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: productData?.name,
      description: enhancedDescription.substring(0, 200),
      images: [ogImage],
      creator: '@jizayn',
      site: '@jizayn',
    },
    other: {
      'product:price:amount': productData.priceRange.min.toString(),
      'product:price:currency': productData.priceRange.currency,
      'product:availability': productData.availability === 'InStock' ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand.name,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'product' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tProducts = await getTranslations({ locale, namespace: 'productsPage' });

  const product = products.find((p) => {
    const localeData = p.locales[locale as keyof typeof p.locales];
    return localeData?.slug === slug;
  });

  if (!product) {
    notFound();
  }

  const productData = product.locales[locale as keyof typeof product.locales];
  if (!productData) return null;

  const currentProductsPath = pathnames['/products'][locale as keyof typeof pathnames['/products']];
  const productUrl = `${BASE_URL}/${locale}${currentProductsPath}/${productData.slug}`;

  const availabilityMap = {
    'InStock': 'https://schema.org/InStock',
    'OutOfStock': 'https://schema.org/OutOfStock',
    'PreOrder': 'https://schema.org/PreOrder',
  };

  // Category mapping
  const categoryMap: Record<string, string> = {
    'decor': 'Home & Garden > Decor',
    'furniture': 'Home & Garden > Furniture',
  };

  // Additional properties for schema
  const additionalProperties = [];
  if (productData.dimensions) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'Dimensions',
      value: productData.dimensions,
    });
  }
  if (productData.materials) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'Materials',
      value: productData.materials,
    });
  }
  if (productData.specifications && productData.specifications.length > 0) {
    productData.specifications.forEach((spec) => {
      additionalProperties.push({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: spec,
      });
    });
  }

  // Dimensions parsing (e.g., "20cm x 15cm x 10cm")
  let depth, height, width;
  if (productData.dimensions) {
    const dims = productData.dimensions.match(/(\d+(?:\.\d+)?)\s*cm/g);
    if (dims && dims.length >= 3) {
      width = `${dims[0].replace('cm', '').trim()} cm`;
      height = `${dims[1].replace('cm', '').trim()} cm`;
      depth = `${dims[2].replace('cm', '').trim()} cm`;
    }
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    description: productData.description,
    image: productData.images.map((img) => img.url),
    sku: productData.sku || product.id,
    mpn: productData.sku || product.id, // Manufacturer Part Number
    category: categoryMap[product.category] || product.category,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
      logo: product.brand.logo,
      url: product.brand.url,
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.brand.name,
      url: product.brand.url,
    },
    ...(depth && height && width && {
      depth,
      height,
      width,
    }),
    ...(productData.materials && {
      material: productData.materials.split(',').map(m => m.trim()).join(', '),
    }),
    offers: {
      '@type': 'Offer',
      price: productData.priceRange.min,
      priceCurrency: productData.priceRange.currency,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 yıl sonrası
      availability: availabilityMap[productData.availability as keyof typeof availabilityMap] || 'https://schema.org/InStock',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Jizayn',
        url: BASE_URL,
      },
      ...(productData.priceRange.max && productData.priceRange.max !== productData.priceRange.min && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: productData.priceRange.min,
          maxPrice: productData.priceRange.max,
          priceCurrency: productData.priceRange.currency,
        },
      }),
    },
    ...(additionalProperties.length > 0 && {
      additionalProperty: additionalProperties,
    }),
    ...(productData.reviews && productData.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (productData.reviews.reduce((acc, r) => acc + r.reviewRating, 0) / productData.reviews.length).toFixed(1),
        reviewCount: productData.reviews.length,
        bestRating: '5',
        worstRating: '1',
      },
      review: productData.reviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        datePublished: review.datePublished,
        reviewBody: review.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.reviewRating,
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }),
  };

  // Category name for breadcrumb
  const categoryName = tProducts(`categories.${product.category}` as any);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: tNav('home'),
        item: `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tNav('products'),
        item: `${BASE_URL}/${locale}${currentProductsPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/${locale}${currentProductsPath}?category=${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productData.name,
        item: productUrl,
      },
    ],
  };

  // FAQ Schema (eğer FAQ varsa)
  const faqSchema = productData.faq && productData.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productData.faq.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // Benzer ürünleri bul (Aynı kategorideki diğer ürünler, mevcut ürün hariç)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(
            [productSchema, breadcrumbSchema, faqSchema].filter(Boolean)
          ) 
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigasyonu */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap py-2">
          <Link href="/" className="flex items-center hover:text-indigo-600 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            {tNav('home')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <Link href="/products" className="hover:text-indigo-600 transition-colors">
            {tNav('products')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <span className="text-gray-900 font-medium truncate">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Sol Kolon: Görsel Galerisi */}
          <div>
            <ProductGallery images={productData.images} />
          </div>

          {/* Sağ Kolon: Ürün Bilgileri (Sticky) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                productData.availability === 'InStock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {productData.availability === 'InStock' ? t('reviews.availability.inStock') : t('reviews.availability.outOfStock')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {productData.name}
          </h1>
            
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-100">
              <p className="text-4xl font-bold text-gray-900">
            {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
          </p>
            </div>

            <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
            <p>{productData.description}</p>
          </div>
          
          {productData.availability === 'OutOfStock' ? (
            <StockNotificationForm 
              productId={product.id}
              translations={{
                title: t('stockNotification.title'),
                description: t('stockNotification.description'),
                emailPlaceholder: t('stockNotification.emailPlaceholder'),
                submit: t('stockNotification.submit'),
                success: t('stockNotification.success'),
                error: t('stockNotification.error'),
              }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Shopier Linki */}
              <a 
                href="#" // Burayı ürün verisinden gelecek şekilde güncelleyin: product.shopierUrl
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center shadow-sm flex items-center justify-center gap-2"
              >
                {/* Shopier Icon (Shopping Bag) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {t('buyOnShopier')}
              </a>

              {/* Etsy Linki */}
              <a 
                href="#" // Burayı ürün verisinden gelecek şekilde güncelleyin: product.etsyUrl
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center shadow-sm flex items-center justify-center gap-2"
              >
                {/* Etsy Icon (Brand E) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.243 12.004c-.035.67.086 1.344.35 1.969.263.625.664 1.176 1.172 1.61.507.433 1.113.746 1.765.91.653.164 1.332.195 1.996.09v2.332c-1.09.21-2.207.23-3.305.055-1.097-.176-2.14-.543-3.07-1.082-.93-.54-1.742-1.25-2.39-2.09-.645-.84-1.11-1.8-1.363-2.824-.253-1.024-.316-2.09-.184-3.137.133-1.047.46-2.05.96-2.965.5-0.914 1.16-1.715 1.94-2.355.78-.64 1.68-1.11 2.64-1.38 1.92-.54 3.96-.36 5.77.51v2.36c-.66-.13-1.34-.12-2-.02-.66.1-1.28.34-1.83.71-.55.37-.99.86-1.29 1.44-.3.58-.45 1.23-.43 1.89h5.55v2.07H9.243z"/>
                </svg>
                {t('buyOnEtsy')}
              </a>
            </div>
          )}

          {/* Paylaşım Butonları */}
            <div className="mb-10">
          <ShareButtons 
            url={productUrl} 
            title={productData.name}
            translations={{
              title: t('reviews.share.title'),
              copied: t('reviews.share.copied'),
              instagram: t('reviews.share.instagram')
            }}
          />
            </div>

          {/* Teknik Özellikler Bölümü */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{t('reviews.specs.title')}</h3>
              <div className="grid grid-cols-1 gap-y-4 text-sm">
              {productData.dimensions && (
                  <div className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                  <span className="text-gray-500 font-medium">{t('reviews.specs.dimensions')}</span>
                    <span className="text-gray-900 font-semibold">{productData.dimensions}</span>
                </div>
              )}
              {productData.materials && (
                  <div className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                  <span className="text-gray-500 font-medium">{t('reviews.specs.materials')}</span>
                    <span className="text-gray-900 font-semibold">{productData.materials}</span>
                </div>
              )}
              {productData.sku && (
                  <div className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                  <span className="text-gray-500 font-medium">{t('reviews.specs.sku')}</span>
                    <span className="text-gray-900 font-mono font-semibold">{productData.sku}</span>
                </div>
              )}
            </div>

            {productData.specifications && (
                <ul className="mt-6 space-y-3 pt-4 border-t border-gray-200">
                {productData.specifications.map((spec, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm">
                      <span className="mr-3 text-indigo-500 font-bold">•</span>
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Müşteri Yorumları Bölümü */}
      <div className="container mx-auto px-4 mt-24 pt-12 border-t border-gray-100">
        <ProductReviews 
          reviews={productData.reviews}
          translations={{
            title: t('reviews.title'),
            noReviews: t('reviews.noReviews'),
            writeReview: t('reviews.writeReview'),
            form: {
              name: t('reviews.form.name'),
              rating: t('reviews.form.rating'),
              comment: t('reviews.form.comment'),
              submit: t('reviews.form.submit'),
              success: t('reviews.form.success'),
            },
            loadMore: t('reviews.loadMore') || 'Daha Fazla Göster',
            sort: {
              label: t('reviews.sort.label'),
              newest: t('reviews.sort.newest'),
              oldest: t('reviews.sort.oldest'),
              ratingHigh: t('reviews.sort.ratingHigh'),
              ratingLow: t('reviews.sort.ratingLow'),
            }
          }}
        />
      </div>

      {/* Alt Bölüm: Sıkça Sorulan Sorular */}
      {productData.faq && productData.faq.length > 0 && (
        <div className="container mx-auto px-4 mt-24">
          <FAQ items={productData.faq} title={t('reviews.faq.title')} />
        </div>
      )}

      {/* Benzer Ürünler Bölümü */}
      {similarProducts.length > 0 && (
        <div className="container mx-auto px-4 mt-24 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('similarProducts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProducts.map((simProduct) => {
              const simProductData = simProduct.locales[locale as keyof typeof simProduct.locales];
              if (!simProductData) return null;

              return (
                <Link
                  key={simProduct.id}
                  href={{ pathname: '/products/[slug]', params: { slug: simProductData.slug } } as any}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={simProductData.images[0].url}
                      alt={simProductData.images[0].alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
                      {simProductData.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(simProductData.priceRange.min, simProductData.priceRange.currency, locale)}
                      </span>
                      <span className="text-sm text-indigo-700 font-medium group-hover:underline">{tProducts('viewProduct')} &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}