import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { getProductBySlug, getAllProducts } from '@/data/products';
import { formatPrice } from '@/utils/currency';
import StockNotificationForm from '@/components/StockNotificationForm';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';
import FAQ from '@/components/FAQ';
import ShareButtons from '@/components/ShareButtons';
import AddToCartButton from '@/components/AddToCartButton';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const product = await getProductBySlug(slug, locale);

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

  // x-default her zaman EN versiyonunu göstermeli
  const alternateLanguages: Record<string, string> = { 
    ...languages,
    'x-default': languages['en'] || `${BASE_URL}/en/products/${slug}`,
  };

  // Enhanced title with category and key details for better SEO
  const tProducts = await getTranslations({ locale, namespace: 'productsPage' });
  const categoryTranslationKey = `categories.${product.category}` as any;
  const categoryName = tProducts(categoryTranslationKey);
  
  // Extract first material for title enhancement
  const firstMaterial = productData.materials ? productData.materials.split(',')[0].trim() : '';
  
  // Build an SEO-optimized title with category and material info
  const seoTitle = locale === 'tr'
    ? `${productData.name} - ${categoryName}${firstMaterial ? ` | ${firstMaterial}` : ' | El Yapımı Ahşap'}`
    : `${productData.name} - ${categoryName}${firstMaterial ? ` | ${firstMaterial}` : ' | Handmade Wood'}`;

  return {
    title: seoTitle.length > 60 ? productData?.name : seoTitle, // Layout otomatik olarak "| Jizayn" ekleyecektir
    description: enhancedDescription.substring(0, 160), // Meta açıklama için ideal uzunluk
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
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

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const productData = product.locales[locale as keyof typeof product.locales];
  if (!productData) return null;

  // Resimler için fallback: Eğer mevcut locale'de resim yoksa, TR locale'den al
  const images = productData.images && productData.images.length > 0 
    ? productData.images 
    : (product.locales.tr?.images || []);

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
    image: images.map((img) => img.url),
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
  const allProducts = await getAllProducts(locale);
  const similarProducts = allProducts
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

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Breadcrumb Navigasyonu */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap py-2 -mx-2 px-2" aria-label="Breadcrumb">
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

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-20">
          {/* 1. Galeri - Mobilde 1. sırada, Desktop'ta sol üst */}
          <div className="order-1 lg:order-none">
            <ProductGallery images={images} />
            
            {/* Satın Alma Butonları */}
            {productData.availability === 'OutOfStock' ? (
              <div className="mt-6">
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
              </div>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 mt-6 flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  SATIN AL
                </h2>
                <div className="p-3 sm:p-4 border-2 border-indigo-300 rounded-lg shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-row gap-2">
                  <AddToCartButton url="#" platform="Shopier" />
                  <AddToCartButton url="#" platform="Etsy" />
                  <AddToCartButton url="#" platform="Amazon" />
                </div>
                {/* Paylaşım Butonları */}
                <div className="mt-4">
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
              </div>
            )}
          </div>

          {/* 2. Ürün Bilgileri - Mobilde 2. sırada, Desktop'ta sağ kolon */}
          <div className="order-2 lg:order-none lg:row-span-2">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                productData.availability === 'InStock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {productData.availability === 'InStock' ? t('reviews.availability.inStock') : t('reviews.availability.outOfStock')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {(() => {
                const name = productData.name;
                const words = name.split(' ');
                const colors = ['text-blue-900', 'text-black', 'text-green-900', 'text-purple-900'];
                return words.map((word, index) => (
                  <span key={index} className={colors[index % colors.length]}>
                    {word}{index < words.length - 1 ? ' ' : ''}
                  </span>
                ));
              })()}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
              </p>
            </div>

            {/* Açıklama */}
            <div 
              className="prose prose-sm sm:prose-base md:prose-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: productData.description }}
            />

            {/* Teknik Özellikler */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border-2 border-gray-300 shadow-md mb-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {t('reviews.specs.title')}
              </h2>
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

          {/* 3. Teknik Detaylar - Mobilde 3. sırada, Desktop'ta sol alt */}
          <div className="order-3 lg:order-none space-y-8">
            {/* Jizayn Farkı */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 md:p-8 border-2 border-indigo-200 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">🏭</span>
                Jizayn Farkı - Neden Bizden Almalısınız?
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Usta Marangozlar:</strong>
                    <span className="text-gray-700"> Deneyimli ustalar tarafından özenle üretilir</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Geleneksel Teknik:</strong>
                    <span className="text-gray-700"> Orijinal Kumiko tekniği korunarak uygulanır</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Türk Malı:</strong>
                    <span className="text-gray-700"> %100 yerli üretim, milli ve yerli</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">El Emeği:</strong>
                    <span className="text-gray-700"> Seri üretim değil, her biri özel olarak yapılır</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Güvenli Kargo:</strong>
                    <span className="text-gray-700"> Özel ambalaj ile hasar görmeden teslim</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Müşteri Memnuniyeti:</strong>
                    <span className="text-gray-700"> Memnuniyetiniz bizim önceliğimiz</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">Değişim Hakkı:</strong>
                    <span className="text-gray-700"> 15 gün içinde sorunsuz iade ve değişim</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <strong className="text-gray-900">İletişim:</strong>
                    <span className="text-gray-700"> WhatsApp ve telefon ile hızlı destek</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Önemli Notlar */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border-2 border-amber-200 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Önemli Notlar - Lütfen Okuyun
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">El Yapımı Ürün:</strong>
                    <span className="text-gray-700"> Her lamba benzersizdir, küçük farklılıklar olabilir</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Doğal Ahşap:</strong>
                    <span className="text-gray-700"> Ahşabın doğal dokusu ve renk tonlarında varyasyonlar normal ve beklenir</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Kalite Değil:</strong>
                    <span className="text-gray-700"> Bu doğal farklılıklar ürünü daha da özel kılar - kusur değildir</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Ampul Dahil Değil:</strong>
                    <span className="text-gray-700"> E14 duy tipi LED ampul ayrıca temin edilmelidir</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Ampul Önerisi:</strong>
                    <span className="text-gray-700"> 2-5W sıcak beyaz LED ampul kullanın (2700K-3000K)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Kırılgandır:</strong>
                    <span className="text-gray-700"> Ahşap yapı hassastır, darbelere karşı dikkatli olun</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-lg mt-0.5 flex-shrink-0">📌</span>
                  <div>
                    <strong className="text-gray-900">Nem:</strong>
                    <span className="text-gray-700"> Banyo, mutfak gibi yüksek nemli alanlarda kullanmayın</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Kullanım ve Bakım Önerileri */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border-2 border-gray-300 shadow-md">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('reviews.usage.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <span className="text-xl">🧼</span>
                    {t('reviews.usage.cleaningTitle')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {t('reviews.usage.cleaning')}
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <span className="text-xl">🛡️</span>
                    {t('reviews.usage.careTitle')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {t('reviews.usage.care')}
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                    <span className="text-xl">📍</span>
                    {t('reviews.usage.placementTitle')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {t('reviews.usage.placement')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ürün Özellikleri */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border-2 border-gray-300 shadow-md">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('reviews.features.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.handmade')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.natural')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.unique')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.durable')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.ecofriendly')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-medium">{t('reviews.features.quality')}</span>
                </div>
              </div>
            </div>

            {/* Kargo ve Teslimat */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8 border-2 border-gray-300 shadow-md">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                {t('reviews.shipping.title')}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {t('reviews.shipping.info')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Bölümü */}
      <div className="container mx-auto px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('reviews.commonFaqs.title')}
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <details key={num} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>{t(`reviews.commonFaqs.q${num}.question`)}</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {t(`reviews.commonFaqs.q${num}.answer`)}
                </div>
              </details>
            ))}
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
                    {simProductData.images && simProductData.images.length > 0 ? (
                      <Image
                        src={simProductData.images[0].url}
                        alt={simProductData.images[0].alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Görsel Yok</span>
                      </div>
                    )}
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