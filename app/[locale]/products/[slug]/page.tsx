import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, Home, ShoppingBag, Truck, Package, AlertTriangle, Check, X, Film, Hammer, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pathnames } from '@/i18n/pathnames';
import { getProductBySlug, getAllProducts } from '@/data/products';
import { formatLocalizedPrice, getLocalizedPriceParts } from '@/utils/currency';
import StockNotificationForm from '@/components/StockNotificationForm';
import ProductGallery from '@/components/ProductGallery';
import ProductVideo from '@/components/ProductVideo';
import ProductReviews from '@/components/ProductReviews';
import ProductFaq from '@/components/ProductFaq';
import ShareButtons from '@/components/ShareButtons';
import AddToCartButton from '@/components/AddToCartButton';
import { BASE_URL } from '@/lib/constants';

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

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

  // Meta keywords (Google için kritik değil ama diğer motorlar için yardımcı olabilir)
  // Ürüne özel terimler ürün verisindeki metaKeywords'ten gelir; burada sadece genel terimler eklenir.
  const metaKeywords = Array.from(new Set([
    productData.name,
    product.category,
    ...(productData.materials ? productData.materials.split(',').map(m => m.trim()) : []),
    ...(productData.metaKeywords || []),
    locale === 'tr' ? 'el yapımı' : 'handmade',
    locale === 'tr' ? 'doğal ahşap' : 'natural wood',
    locale === 'tr' ? 'türkiye üretim' : 'made in turkey',
    'Jizayn',
  ].filter(Boolean))).join(', ');

  // Category name for description
  const tProducts = await getTranslations({ locale, namespace: 'productsPage' });
  const categoryTranslationKey = `categories.${product.category}` as any;
  const categoryName = tProducts(categoryTranslationKey);

  const shortDescription = stripHtml(productData.description || '');
  // Açıklama önce ürün verisindeki metaDescription'dan; yoksa ürün açıklamasından beslenir.
  const enhancedDescription = productData.metaDescription?.trim()
    ? productData.metaDescription.trim()
    : shortDescription;

  // x-default her zaman EN versiyonunu göstermeli
  const alternateLanguages: Record<string, string> = { 
    ...languages,
    'x-default': languages['en'] || `${BASE_URL}/en/products/${slug}`,
  };

  // Başlık ürün verisindeki metaTitle'dan beslenir; yoksa ürün adına döner.
  // metaTitle zaten "| Jizayn" içerdiğinden absolute ile şablonun tekrar eklemesi önlenir.
  const seoTitle = productData.metaTitle?.trim() || `${productData.name} | Jizayn`;

  return {
    title: { absolute: seoTitle },
    description: enhancedDescription.substring(0, 158),
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: productData.name,
      description: enhancedDescription.substring(0, 190),
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
        'product:price:amount': getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).price.toString(),
        'product:price:currency': getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).currency,
      }),
      ...(productData.availability && {
        'product:availability': productData.availability === 'InStock' ? 'in stock' : 'out of stock',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: productData.name,
      description: enhancedDescription.substring(0, 190),
      images: [ogImage],
      creator: '@jizayn',
      site: '@jizayn',
    },
    other: {
      'product:price:amount': getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).price.toString(),
      'product:price:currency': getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).currency,
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

  const schemaDescription = stripHtml(productData.description || '').slice(0, 500);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: productData.name,
    description: schemaDescription,
    mainEntityOfPage: productUrl,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url,
      contentUrl: img.url,
      caption: img.alt,
    })),
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
    inLanguage: locale,
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
      price: getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).price,
      priceCurrency: getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).currency,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 yıl sonrası
      availability: availabilityMap[productData.availability as keyof typeof availabilityMap] || 'https://schema.org/InStock',
      url: productData.shopierUrl || productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Jizayn',
        url: BASE_URL,
      },
      ...(productData.priceRange.max && productData.priceRange.max !== productData.priceRange.min && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).price,
          maxPrice: getLocalizedPriceParts(productData.priceRange.max, productData.priceRange.currency, locale).price,
          priceCurrency: getLocalizedPriceParts(productData.priceRange.min, productData.priceRange.currency, locale).currency,
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

  const translatedCommonFaq = Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return {
      question: t(`reviews.commonFaqs.q${number}.question`),
      answer: t(`reviews.commonFaqs.q${number}.answer`),
    };
  });

  const combinedFaq = [
    ...(productData.faq || []).map((item) => ({ question: item.question, answer: item.answer })),
    ...translatedCommonFaq,
  ];

  const uniqueFaq = Array.from(
    new Map(
      combinedFaq
        .filter((item) => item.question && item.answer)
        .map((item) => [item.question.trim().toLowerCase(), item])
    ).values()
  );

  // FAQ Schema
  const faqSchema = uniqueFaq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: uniqueFaq.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // HowTo Schema - Bakım Önerileri için
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'tr' ? 'Ahşap Masa Lambası Bakımı' : 'Wooden Table Lamp Care',
    description: locale === 'tr' 
      ? 'El yapımı ahşap masa lambanızın uzun ömürlü olması için bakım önerileri'
      : 'Care recommendations for your handmade wooden table lamp to last longer',
    step: [
      {
        '@type': 'HowToStep',
        name: locale === 'tr' ? 'Temizlik' : 'Cleaning',
        text: locale === 'tr' 
          ? 'Temizlik için sadece nemli bez kullanın. Sert fırçalar ahşap yüzeye zarar verebilir. Leke için hemen müdahale edin.'
          : 'Use only a damp cloth for cleaning. Hard brushes can damage the wood surface. Address stains immediately.',
      },
      {
        '@type': 'HowToStep',
        name: locale === 'tr' ? 'Yerleştirme' : 'Placement',
        text: locale === 'tr'
          ? 'Ürünü dengeli bir yüzeye yerleştirin. Isı kaynaklarından en az 1 metre uzakta tutun.'
          : 'Place the product on a balanced surface. Keep at least 1 meter away from heat sources.',
      },
      {
        '@type': 'HowToStep',
        name: locale === 'tr' ? 'Bakım' : 'Maintenance',
        text: locale === 'tr'
          ? 'Yumuşak ve kuru bir bez ile silin. Kimyasal temizleyiciler kullanmayın. Direkt güneş ışığından uzak tutun.'
          : 'Wipe with a soft, dry cloth. Do not use chemical cleaners. Keep away from direct sunlight.',
      },
    ],
    totalTime: 'PT10M',
  };

  // Yapım/tanıtım videosu — yalnızca veride video varsa
  const videoUrl = productData.video;
  const firstImageUrl = images[0]?.url || '';
  const videoThumbnail = firstImageUrl.startsWith('http')
    ? firstImageUrl
    : `${BASE_URL}${firstImageUrl}`;
  const videoName = locale === 'tr'
    ? `${productData.name} - Tanıtım ve Yapım Videosu`
    : `${productData.name} - Showcase & Making Video`;
  const videoSchema = videoUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: videoName,
        description: schemaDescription || videoName,
        thumbnailUrl: videoThumbnail,
        uploadDate: product.updatedAt || product.createdAt || new Date().toISOString(),
        contentUrl: videoUrl,
        embedUrl: videoUrl,
      }
    : null;

  // Benzer ürünleri bul (Aynı kategorideki diğer ürünler, mevcut ürün hariç)
  const allProducts = await getAllProducts(locale);
  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <article className="bg-white pb-20">
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(
            [productSchema, breadcrumbSchema, faqSchema, howToSchema, videoSchema].filter(Boolean)
          ) 
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Breadcrumb Navigasyonu */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap py-2 -mx-2 px-2" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center hover:text-amber-700 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            {tNav('home')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <Link href="/products" className="hover:text-amber-700 transition-colors">
            {tNav('products')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <a 
            href={`/${locale}${currentProductsPath}?category=${product.category}`}
            className="hover:text-amber-700 transition-colors"
          >
            {categoryName}
          </a>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <span className="text-gray-900 font-medium truncate">{productData.name}</span>
        </nav>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-x-20 lg:gap-y-6">
          {/* 1. Galeri - Mobilde 1. sırada, Desktop'ta sol üst */}
          <div className="order-1 lg:order-none">
            <ProductGallery images={images.map((img, idx) => ({
              ...img,
              alt: img.alt || `${productData.name} - ${locale === 'tr' ? 'Görsel' : 'Image'} ${idx + 1} | ${categoryName} | Jizayn ${locale === 'tr' ? 'El Yapımı Ahşap Ürünler' : 'Handmade Wood Products'}`
            }))} />
            
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
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                  {locale === 'tr' ? 'SATIN AL' : 'BUY NOW'}
                </h2>
                <div className="p-4 sm:p-5 border border-stone-200 rounded-2xl shadow-sm bg-stone-50">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                      {formatLocalizedPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    {productData.shopierUrl && (
                      <AddToCartButton url={productData.shopierUrl} platform="Shopier" />
                    )}
                    {productData.etsyUrl && (
                      <AddToCartButton url={productData.etsyUrl} platform="Etsy" />
                    )}
                    {productData.amazonUrl && (
                      <AddToCartButton url={productData.amazonUrl} platform="Amazon" />
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Hammer className="w-4 h-4 text-amber-600" />
                      {locale === 'tr' ? 'El yapımı' : 'Handmade'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-amber-600" />
                      {locale === 'tr' ? 'Özenli paketleme' : 'Careful packaging'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      {locale === 'tr' ? 'Güvenli ödeme' : 'Secure payment'}
                    </span>
                  </div>
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
              {productData.name}
            </h1>
            
            {/* SEO-Friendly Introduction */}
            {productData.intro && (
              <div className="mb-6 text-gray-700 leading-relaxed text-base hidden lg:block">
                <p>{productData.intro}</p>
              </div>
            )}
            
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100" />

            {/* Açıklama Bölümleri - Veriden gelen ürüne özel içerik */}
            {((productData.contentSections && productData.contentSections.length > 0) ||
              (productData.importantNotes && productData.importantNotes.length > 0)) && (
              <div className="space-y-6 mb-8">
                {productData.contentSections?.map((section, i) => {
                  const hasItems = !!(section.items && section.items.length > 0);

                  // Sadece anlatı içeren bölümler: kartsız, sade tipografi (ritim için)
                  if (!hasItems) {
                    return (
                      <div key={i} className="px-1">
                        <h3 className="text-lg font-bold text-stone-800 mb-2">{section.title}</h3>
                        {section.body && (
                          <p className="text-stone-600 leading-relaxed whitespace-pre-line">{section.body}</p>
                        )}
                      </div>
                    );
                  }

                  // Listeli bölümler: sıcak amber kart
                  return (
                    <div key={i} className="border border-stone-200 border-l-4 border-l-amber-500 bg-stone-50/70 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-bold text-stone-800 mb-3">{section.title}</h3>
                      {section.body && (
                        <p className="text-stone-600 leading-relaxed whitespace-pre-line">{section.body}</p>
                      )}
                      <ul className={`space-y-1.5 text-stone-700 text-sm ${section.body ? 'mt-3' : ''}`}>
                        {section.items!.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                {productData.importantNotes && productData.importantNotes.length > 0 && (
                  <div className="border border-stone-200 border-l-4 border-l-amber-500 bg-stone-50/70 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      {locale === 'tr' ? 'Önemli Notlar - Lütfen Okuyun' : 'Important Notes - Please Read'}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {productData.importantNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                          <div>
                            <strong className="text-stone-800">{note.title}</strong>
                            <span className="text-stone-600"> {note.text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Teknik Detaylar - Mobilde 3. sırada, Desktop'ta sol alt */}
          <div className="order-3 lg:order-none space-y-8 lg:-mt-20">
            {/* Teknik Özellikler */}
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {t('reviews.specs.title')}
              </h2>
              <div className="grid grid-cols-1 gap-y-2 text-sm">
                {productData.dimensions && (
                  <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-500 font-medium">{t('reviews.specs.dimensions')}</span>
                    <span className="text-gray-900 font-semibold">{productData.dimensions}</span>
                  </div>
                )}
                {productData.materials && (
                  <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-500 font-medium">{t('reviews.specs.materials')}</span>
                    <span className="text-gray-900 font-semibold">{productData.materials}</span>
                  </div>
                )}
                {productData.sku && (
                  <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-500 font-medium">{t('reviews.specs.sku')}</span>
                    <span className="text-gray-900 font-mono font-semibold">{productData.sku}</span>
                  </div>
                )}
              </div>

              {productData.specifications && (
                <ul className="mt-4 space-y-2 pt-3 border-t border-gray-200">
                  {productData.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start text-gray-600 text-sm">
                      <span className="mr-3 text-amber-500 font-bold">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ürün Özellikleri */}
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('reviews.features.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.handmade')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.natural')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.unique')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.durable')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.ecofriendly')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-white/60 rounded-lg p-3">
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('reviews.features.quality')}</span>
                </div>
              </div>
            </div>

            {/* Kargo ve Teslimat */}
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-6 h-6 text-amber-600" />
                {t('reviews.shipping.title')}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {t('reviews.shipping.info')}
              </p>
            </div>

            {/* Paket İçeriği */}
            {productData.packageContents && productData.packageContents.length > 0 && (
              <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-amber-600" />
                  {locale === 'tr' ? 'Paket İçeriği' : 'Package Contents'}
                </h2>
                <div className="space-y-1.5 text-sm">
                  {productData.packageContents.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-stone-700 bg-white/60 rounded-lg p-2">
                      {item.included === false ? (
                        <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={item.included === false ? 'font-medium' : ''}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yapım / Tanıtım Videosu */}
      {videoUrl && (
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Film className="w-7 h-7 text-amber-600" />
              {locale === 'tr' ? 'Yapım ve Tanıtım Videosu' : 'Making & Showcase Video'}
            </h2>
            <ProductVideo video={videoUrl} poster={firstImageUrl} title={videoName} />
          </div>
        </section>
      )}

      {/* FAQ Bölümü */}
      <section className="mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-stone-50/60 border border-stone-200 rounded-3xl p-6 sm:p-10">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Sol: başlık + iletişim CTA */}
              <div className="lg:col-span-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-4">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
                  {t('reviews.commonFaqs.title')}
                </h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {locale === 'tr'
                    ? 'Aklınıza takılan başka bir şey mi var? Size yardımcı olmaktan memnuniyet duyarız.'
                    : 'Have another question? We are happy to help.'}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:gap-3 transition-all"
                >
                  {locale === 'tr' ? 'İletişime geçin' : 'Contact us'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Sağ: accordion */}
              <div className="lg:col-span-2">
                <ProductFaq
                  items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
                    question: t(`reviews.commonFaqs.q${num}.question`),
                    answer: t(`reviews.commonFaqs.q${num}.answer`),
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Benzer Ürünler Bölümü */}
      {similarProducts.length > 0 && (
        <section className="container mx-auto px-4 mt-24 pt-12 border-t border-gray-100" itemScope itemType="https://schema.org/ItemList">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" itemProp="name">
            {t('similarProducts')} - {categoryName}
          </h2>
          <meta itemProp="numberOfItems" content={similarProducts.length.toString()} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProducts.map((simProduct) => {
              const simProductData = simProduct.locales[locale as keyof typeof simProduct.locales];
              if (!simProductData) return null;

              return (
                <Link
                  key={simProduct.id}
                  href={{ pathname: '/products/[slug]', params: { slug: simProductData.slug } } as any}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  itemProp="isRelatedTo"
                  itemScope
                  itemType="https://schema.org/Product"
                >
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    {simProductData.images && simProductData.images.length > 0 ? (
                      <Image
                        src={simProductData.images[0].url}
                        alt={`${simProductData.name} - ${locale === 'tr' ? 'El yapımı ahşap ürün' : 'Handmade wood product'} | Jizayn`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Görsel Yok</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {simProductData.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatLocalizedPrice(simProductData.priceRange.min, simProductData.priceRange.currency, locale)}
                      </span>
                      <span className="text-sm text-amber-700 font-medium group-hover:underline">{tProducts('viewProduct')} &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}