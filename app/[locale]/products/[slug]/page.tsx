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
    locale === 'tr' ? 'doğal ahşap ürünler' : 'natural wood products',
    locale === 'tr' ? 'ahşap dekorasyon' : 'wood decoration',
    locale === 'tr' ? 'ahşap masa lambası' : 'wooden table lamp',
    locale === 'tr' ? 'kumiko sanatı' : 'kumiko art',
    locale === 'tr' ? 'kumiko lamba' : 'kumiko lamp',
    locale === 'tr' ? 'japon kumiko' : 'japanese kumiko',
    locale === 'tr' ? 'el işi lamba' : 'handmade lamp',
    locale === 'tr' ? 'dekoratif lamba' : 'decorative lamp',
    locale === 'tr' ? 'ahşap aydınlatma' : 'wooden lighting',
    locale === 'tr' ? 'yapıştırıcısız ahşap' : 'glue-free wood',
    locale === 'tr' ? 'geleneksel ahşap işçiliği' : 'traditional woodworking',
    locale === 'tr' ? 'türkiye' : 'turkey',
    locale === 'tr' ? 'istanbul' : 'istanbul',
    locale === 'tr' ? 'yerli üretim' : 'domestic production',
    locale === 'tr' ? 'el emeği' : 'handcrafted',
    locale === 'tr' ? 'özel tasarım' : 'custom design',
    locale === 'tr' ? 'benzersiz ürün' : 'unique product',
    'Jizayn',
  ].filter(Boolean).join(', ');

  // Category name for description
  const tProducts = await getTranslations({ locale, namespace: 'productsPage' });
  const categoryTranslationKey = `categories.${product.category}` as any;
  const categoryName = tProducts(categoryTranslationKey);

  // Enhanced description with price and key features
  const enhancedDescription = locale === 'tr'
    ? `${productData.name} - ${categoryName} | 400 yıllık Japon Kumiko tekniği ile tamamen el yapımı ahşap masa lambası. Yapıştırıcısız geleneksel ahşap işçiliği, geometrik desenler, LED aydınlatma. ${productData.materials ? productData.materials : 'Doğal ahşap'}. Türkiye'de üretim, hızlı kargo. ✓ El emeği ✓ Benzersiz tasarım ✓ Kaliteli işçilik. Fiyat: ${formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)} - Jizayn.`
    : `${productData.name} - ${categoryName} | Completely handmade wooden table lamp with 400-year-old Japanese Kumiko technique. Traditional woodworking without glue, geometric patterns, LED lighting. ${productData.materials ? productData.materials : 'Natural wood'}. Made in Turkey, fast shipping. ✓ Handcrafted ✓ Unique design ✓ Quality workmanship. Price: ${formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)} - Jizayn.`;

  // x-default her zaman EN versiyonunu göstermeli
  const alternateLanguages: Record<string, string> = { 
    ...languages,
    'x-default': languages['en'] || `${BASE_URL}/en/products/${slug}`,
  };

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
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'TRY',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'TR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'TR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 15,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
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
            [productSchema, breadcrumbSchema, faqSchema, howToSchema].filter(Boolean)
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
          <a 
            href={`/${locale}${currentProductsPath}?category=${product.category}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {categoryName}
          </a>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
          <span className="text-gray-900 font-medium truncate">{productData.name}</span>
        </nav>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-20">
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
              {productData.name}
            </h1>
            
            {/* SEO-Friendly Introduction */}
            <div className="mb-6 text-gray-700 leading-relaxed text-base hidden lg:block">
              <p>
                {locale === 'tr' 
                  ? `${productData.name}, 400 yıllık Japon Kumiko sanatı tekniği ile el emeği göz nuru üretilmiş özel bir ahşap masa lambasıdır. Geleneksel ahşap işçiliği ve modern tasarımın mükemmel birleşimi olan bu benzersiz ürün, yapıştırıcı kullanılmadan sadece hassas kesim ve geçme teknikleri ile üretilmektedir. ${categoryName} kategorisindeki bu özel ürün, evinize doğal ahşabın sıcaklığını ve Uzakdoğu estetiğini taşır.`
                  : `${productData.name} is a special wooden table lamp handcrafted with 400-year-old Japanese Kumiko art technique. This unique product, a perfect combination of traditional woodworking and modern design, is produced without glue, using only precise cutting and joinery techniques. This special item in the ${categoryName} category brings the warmth of natural wood and Far Eastern aesthetics to your home.`}
              </p>
            </div>
            
            <div className="flex items-baseline gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
              </p>
            </div>

            {/* Açıklama Bölümleri - Styled Sections */}
            <div className="space-y-4 mb-8">
              {/* Kumiko Sanatı */}
              <div className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md">
                <h2 className="text-xl font-bold text-amber-900 mb-3">
                  🎎 {locale === 'tr' ? 'Kumiko Sanatı Nedir ve Neden Özeldir?' : 'What is Kumiko Art and Why Special?'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {locale === 'tr' 
                    ? 'Kumiko, 17. yüzyıldan beri Japonya\'da uygulanan geleneksel bir ahşap işçiliği sanatıdır. Bu teknik, ince ahşap çubukların yapıştırıcı kullanılmadan, sadece hassas kesimleri ve geçme tekniği ile birleştirilmesiyle karmaşık geometrik desenler oluşturulmasını sağlar. Her bir ahşap parça, milimetrik hassasiyetle kesilir ve yerleştirilir.'
                    : 'Kumiko is a traditional woodworking art practiced in Japan since the 17th century. This technique creates complex geometric patterns by joining thin wooden rods without glue, using only precise cuts and joinery. Each piece is cut and placed with millimeter precision.'}
                </p>
              </div>

              {/* Neden Tercih Etmeli */}
              <div className="border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  ✨ {locale === 'tr' ? 'Neden Bu Masa Lambasını Tercih Etmelisiniz?' : 'Why Choose This Table Lamp?'}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>🎨 {locale === 'tr' ? 'Geleneksel Sanat:' : 'Traditional Art:'}</strong> {locale === 'tr' ? '400 yıllık Japon Kumiko tekniği ile tamamen el yapımı' : '400-year-old Japanese Kumiko technique, completely handmade'}</li>
                  <li><strong>🔧 {locale === 'tr' ? 'Yapıştırıcısız Üretim:' : 'No Glue Production:'}</strong> {locale === 'tr' ? 'Tüm ahşap parçalar hassas kesim ve geçmelerle birleştirilir' : 'All wooden parts joined with precise cuts and joinery'}</li>
                  <li><strong>💡 {locale === 'tr' ? 'Işık Sanatı:' : 'Light Art:'}</strong> {locale === 'tr' ? 'LED ışık, geometrik desenlerin arasından süzülerek büyüleyici gölge oyunları yaratır' : 'LED light creates fascinating shadow play through geometric patterns'}</li>
                  <li><strong>🌳 {locale === 'tr' ? 'Doğal Malzeme:' : 'Natural Material:'}</strong> {locale === 'tr' ? '%100 masif doğal ahşap - maun ve çam kombinasyonu' : '100% solid natural wood - mahogany and pine combination'}</li>
                </ul>
              </div>

              {/* Kullanım Alanları */}
              <div className="border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-purple-900 mb-3">
                  🏡 {locale === 'tr' ? 'Kullanım Alanları ve Dekorasyon Fikirleri' : 'Usage Areas and Decoration Ideas'}
                </h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>🛏️ <strong>{locale === 'tr' ? 'Yatak Odası:' : 'Bedroom:'}</strong> {locale === 'tr' ? 'Gece lambası olarak rahatlatıcı atmosfer' : 'As a night lamp for relaxing atmosphere'}</li>
                  <li>🛋️ <strong>{locale === 'tr' ? 'Oturma Odası:' : 'Living Room:'}</strong> {locale === 'tr' ? 'Okuma lambası veya dekoratif aydınlatma' : 'Reading lamp or decorative lighting'}</li>
                  <li>💼 <strong>{locale === 'tr' ? 'Çalışma Masası:' : 'Desk:'}</strong> {locale === 'tr' ? 'Modern ofis dekorasyonunda şık aksesuar' : 'Elegant accessory in modern office decoration'}</li>
                  <li>🎁 <strong>{locale === 'tr' ? 'Özel Hediye:' : 'Special Gift:'}</strong> {locale === 'tr' ? 'Ev açılışı, yıldönümü için unutulmaz hediye' : 'Unforgettable gift for housewarming, anniversary'}</li>
                </ul>
              </div>

              {/* Işık ve Atmosfer */}
              <div className="border-2 border-indigo-400 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">
                  🌙 {locale === 'tr' ? 'Işık ve Atmosfer' : 'Light and Atmosphere'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locale === 'tr'
                    ? 'Kumiko lambanın en büyük özelliği, ışık ile ahşap geometrik desenlerin yarattığı büyüleyici atmosferdir. LED ışık kaynağı, ahşap çubukların arasından geçerek duvarlara ve tavana geometrik gölge desenleri yansıtır. Özellikle gece kullanımında, bu ışık oyunu mekanınıza huzurlu ve sıcak bir ambiyans katarken, aynı zamanda okuma yapmak için yeterli ışık sağlar.'
                    : 'The biggest feature of the Kumiko lamp is the fascinating atmosphere created by light and wooden geometric patterns. The LED light source passes through the wooden rods, reflecting geometric shadow patterns on walls and ceiling. Especially at night, this light play adds a peaceful and warm ambiance to your space while providing sufficient light for reading.'}
                </p>
              </div>

              {/* Hediye Seçeneği */}
              <div className="border-2 border-rose-400 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-rose-900 mb-3">
                  🎁 {locale === 'tr' ? 'Mükemmel Hediye Seçeneği' : 'Perfect Gift Option'}
                </h3>
                <p className="text-gray-700 mb-2">
                  {locale === 'tr' 
                    ? 'El yapımı Kumiko masa lambası, özel günleriniz ve hediye ihtiyaçlarınız için unutulmaz bir seçenektir:' 
                    : 'The handmade Kumiko table lamp is an unforgettable choice for your special occasions and gift needs:'}
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>🏠 <strong>{locale === 'tr' ? 'Ev Açılışı:' : 'Housewarming:'}</strong> {locale === 'tr' ? 'Yeni eve taşınan sevdiklerinize anlamlı hediye' : 'Meaningful gift for loved ones moving to a new home'}</li>
                  <li>💕 <strong>{locale === 'tr' ? 'Evlilik Yıldönümü:' : 'Wedding Anniversary:'}</strong> {locale === 'tr' ? 'Çiftler için romantik ve şık hediye' : 'Romantic and elegant gift for couples'}</li>
                  <li>🎨 <strong>{locale === 'tr' ? 'Tasarım Meraklıları:' : 'Design Enthusiasts:'}</strong> {locale === 'tr' ? 'Sanat ve tasarım seven arkadaşlarınıza' : 'For friends who love art and design'}</li>
                </ul>
              </div>

              {/* Jizayn Farkı */}
              <div className="border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  🏭 {locale === 'tr' ? 'Jizayn Farkı - Neden Bizden Almalısınız?' : 'Jizayn Difference - Why Buy From Us?'}
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✅ <strong>{locale === 'tr' ? 'Usta Marangozlar:' : 'Master Craftsmen:'}</strong> {locale === 'tr' ? 'Deneyimli ustalar tarafından özenle üretilir' : 'Carefully crafted by experienced masters'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'Geleneksel Teknik:' : 'Traditional Technique:'}</strong> {locale === 'tr' ? 'Orijinal Kumiko tekniği korunarak uygulanır' : 'Original Kumiko technique preserved and applied'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'Türk Malı:' : 'Turkish Made:'}</strong> {locale === 'tr' ? '%100 yerli üretim, milli ve yerli' : '100% domestic production'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'El Emeği:' : 'Handcrafted:'}</strong> {locale === 'tr' ? 'Seri üretim değil, her biri özel olarak yapılır' : 'Not mass production, each made individually'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'Güvenli Kargo:' : 'Safe Shipping:'}</strong> {locale === 'tr' ? 'Özel ambalaj ile hasar görmeden teslim' : 'Delivered without damage with special packaging'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'Müşteri Memnuniyeti:' : 'Customer Satisfaction:'}</strong> {locale === 'tr' ? 'Memnuniyetiniz bizim önceliğimiz' : 'Your satisfaction is our priority'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'Değişim Hakkı:' : 'Return Right:'}</strong> {locale === 'tr' ? '15 gün içinde sorunsuz iade ve değişim' : 'Hassle-free return and exchange within 15 days'}</li>
                  <li>✅ <strong>{locale === 'tr' ? 'İletişim:' : 'Communication:'}</strong> {locale === 'tr' ? 'WhatsApp ve telefon ile hızlı destek' : 'Fast support via WhatsApp and phone'}</li>
                </ul>
              </div>

              {/* Kullanım ve Bakım Önerileri */}
              <div className="border-2 border-gray-400 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {locale === 'tr' ? 'Kullanım ve Bakım Önerileri' : 'Usage and Care Recommendations'}
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2 text-sm">
                      <span className="text-lg">🧼</span>
                      {locale === 'tr' ? 'Temizlik' : 'Cleaning'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {locale === 'tr' ? 'Temizlik için sadece nemli bez kullanın. Sert fırçalar ahşap yüzeye zarar verebilir. Leke için hemen müdahale edin. Yılda bir kez doğal yağla besleyin.' : 'Use only a damp cloth for cleaning. Hard brushes can damage the wood surface. Address stains immediately. Nourish with natural oil once a year.'}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2 text-sm">
                      <span className="text-lg">🛡️</span>
                      {locale === 'tr' ? 'Bakım' : 'Care'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {locale === 'tr' ? 'Ürünlerinizin uzun ömürlü olması için düzenli bakım önemlidir. Yumuşak ve kuru bir bez ile silin. Kimyasal temizleyiciler kullanmayın. Direkt güneş ışığından uzak tutun. Aşırı neme maruz bırakmayın.' : 'Regular care is important for long-lasting products. Wipe with a soft, dry cloth. Do not use chemical cleaners. Keep away from direct sunlight. Do not expose to excessive moisture.'}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2 text-sm">
                      <span className="text-lg">📍</span>
                      {locale === 'tr' ? 'Yerleştirme' : 'Placement'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {locale === 'tr' ? 'Ürünü dengeli bir yüzeye yerleştirin. Isı kaynaklarından (kalorifer, soba) en az 1 metre uzakta tutun. Ahşap, sıcaklık değişimlerine duyarlıdır. Nem oranı %40-60 arası ideal ortamdır.' : 'Place the product on a balanced surface. Keep at least 1 meter away from heat sources (radiator, stove). Wood is sensitive to temperature changes. Humidity between 40-60% is ideal.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Önemli Notlar */}
              <div className="border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  {locale === 'tr' ? 'Önemli Notlar - Lütfen Okuyun' : 'Important Notes - Please Read'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'El Yapımı Ürün:' : 'Handmade Product:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'Her lamba benzersizdir, küçük farklılıklar olabilir' : 'Each lamp is unique, small differences may occur'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Doğal Ahşap:' : 'Natural Wood:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'Ahşabın doğal dokusu ve renk tonlarında varyasyonlar normal ve beklenir' : 'Variations in natural texture and color tones of wood are normal and expected'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Kalite Değil:' : 'Not a Defect:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'Bu doğal farklılıklar ürünü daha da özel kılar - kusur değildir' : 'These natural differences make the product even more special - not a defect'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Ampul Dahil Değil:' : 'Bulb Not Included:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'E14 duy tipi LED ampul ayrıca temin edilmelidir' : 'E14 socket type LED bulb must be purchased separately'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Ampul Önerisi:' : 'Bulb Recommendation:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? '2-5W sıcak beyaz LED ampul kullanın (2700K-3000K)' : 'Use 2-5W warm white LED bulb (2700K-3000K)'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Kırılgandır:' : 'Fragile:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'Ahşap yapı hassastır, darbelere karşı dikkatli olun' : 'Wood structure is delicate, be careful against impacts'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-base mt-0.5 flex-shrink-0">📌</span>
                    <div>
                      <strong className="text-gray-900">{locale === 'tr' ? 'Nem:' : 'Moisture:'}</strong>
                      <span className="text-gray-700"> {locale === 'tr' ? 'Banyo, mutfak gibi yüksek nemli alanlarda kullanmayın' : 'Do not use in high humidity areas like bathrooms and kitchens'}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Teknik Detaylar - Mobilde 3. sırada, Desktop'ta sol alt */}
          <div className="order-3 lg:order-none space-y-8">
            {/* Teknik Özellikler */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border-2 border-gray-300 shadow-md">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <span className="mr-3 text-indigo-500 font-bold">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
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

            {/* Paket İçeriği */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border-2 border-purple-200 shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Paket İçeriği
              </h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>1 adet El Yapımı Kumiko Ahşap Masa Lambası</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>E14 duy soket (lamba başlığı içinde)</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>1.5 metre şık siyah kumaş elektrik kablosu</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>Kablo üzerinde açma/kapama anahtarı</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>CE sertifikalı elektrik aksam</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>Kullanım ve bakım kılavuzu</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✔️</span>
                  <span>Özel tasarım ambalaj - hediye için hazır</span>
                </div>
                <div className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-2">
                  <span className="text-red-600 text-lg flex-shrink-0">❌</span>
                  <span className="font-medium">LED ampul dahil değildir (ayrıca temin edilmelidir)</span>
                </div>
              </div>
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
        </section>
      )}
    </article>
  );
}