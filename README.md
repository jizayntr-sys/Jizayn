# Jizayn - Ahşap Dekoratif Ürünler Web Sitesi

El yapımı ahşap dekoratif ürünler için çok dilli e-ticaret katalog web sitesi.

## Özellikler

- ✅ **10 Dil Desteği** (TR, EN, FR, DE, RU, ES, AR, IT, PT, NL) - İlk aşamada TR ve EN aktif
- ✅ **Ülke Bazlı Currency & Pricing**: Her locale için farklı Amazon/Etsy pazaryeri ve currency
- ✅ **SEO Optimizasyonu**: Gelişmiş metadata, hreflang, canonical URLs, sitemap
- ✅ **Ürün Sayfaları**: 6+ görsel, video desteği, ölçüler, malzemeler, detaylı açıklamalar
- ✅ **Responsive Tasarım**: Mobil, tablet ve desktop uyumlu
- ✅ **Performans**: Next.js 14 App Router, Image Optimization, Static Generation
- ✅ **Core Web Vitals**: LCP optimizasyonu, priority loading, eager loading
- ✅ **URL Yapısı**: `/[locale]/[slug]` formatında, sluglar kendi dillerinde

## Teknolojiler

- **Next.js 14.2.33** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS 3.4.1**
- **next-intl 3.22.0** (Internationalization)
- **Lucide React** (Icons)

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## Proje Yapısı

```
├── app/
│   ├── [locale]/          # Dil bazlı sayfalar
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── products/      # Ürün listesi ve detay
│   │   ├── about/         # Hakkımızda
│   │   └── contact/       # İletişim
│   ├── layout.tsx          # Root layout
│   ├── globals.css        # Global stiller
│   ├── sitemap.ts         # Dinamik sitemap
│   ├── robots.ts          # Robots.txt
│   └── product-feed.xml/   # Google Shopping Feed
├── components/            # React componentleri
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LanguageSwitcher.tsx
│   ├── ProductImageGallery.tsx
│   ├── ProductVideo.tsx
│   └── ContactForm.tsx
├── data/                  # Veri dosyaları
│   └── products.ts        # Ürün verileri
├── i18n/                  # i18n yapılandırması
│   ├── routing.ts
│   └── request.ts
├── messages/              # Çeviri dosyaları
│   ├── tr.json
│   └── en.json
├── types/                 # TypeScript type tanımları
│   └── product.ts
└── utils/                 # Utility fonksiyonları
    ├── currency.ts        # Locale-to-currency mapping
    ├── hreflang.ts        # Hreflang alternates generator
    ├── organization-schema.ts  # Organization schema generator
    └── image-seo.ts       # Image SEO utilities
```

## Ürün Verisi Ekleme

Ürünler `data/products.ts` dosyasında tanımlanır. Her ürün için:

- **ID**: Benzersiz ürün ID'si
- **Category**: Ürün kategorisi
- **Tags**: Etiketler
- **Brand**: Marka bilgisi (name, url, logo)
- **Locales**: Her dil için:
  - `slug`: URL'de kullanılacak slug (kendi dilinde)
  - `name`: Ürün adı
  - `description`: Detaylı açıklama
  - `images`: En az 6 görsel
  - `video`: Opsiyonel video
  - `dimensions`: Ölçüler
  - `materials`: Malzemeler
  - `specifications`: Özellikler
  - `sku`: Ürün SKU kodu
  - `gtin`: GTIN/EAN kodu
  - `availability`: Stok durumu (InStock/OutOfStock/PreOrder/BackOrder)
  - `priceRange`: Fiyat aralığı (min, max, currency) - Rich snippets için
  - `amazonUrl`: Amazon satış linki (ülke bazlı domain: amazon.com, amazon.de, amazon.fr, vs.)
  - `amazonOffer`: Amazon offer detayları (url, availability, price, priceCurrency, sku, gtin)
  - `etsyUrl`: Etsy satış linki (locale bazlı: etsy.com, etsy.com/de, etsy.com/fr, vs.)
  - `etsyOffer`: Etsy offer detayları (url, availability, price, priceCurrency, sku, gtin)
  - `aggregateRating`: Toplam değerlendirme (ratingValue, reviewCount, bestRating, worstRating)
  - `reviews`: Müşteri yorumları array'i (author, datePublished, reviewBody, reviewRating)
  - `metaTitle`, `metaDescription`, `metaKeywords`: SEO metadata
  
  **Not:** Her locale için farklı Amazon/Etsy pazaryeri ve currency kullanılır:
  - TR: amazon.com.tr, TRY
  - EN: amazon.com, USD
  - DE: amazon.de, EUR
  - FR: amazon.fr, EUR
  - vs.

## SEO Özellikleri

- ✅ **Metadata**: Her sayfa için özel title, description, keywords
- ✅ **Hreflang**: Tüm diller için alternatif URL'ler + x-default (dil tercihi belirsiz kullanıcılar için EN)
- ✅ **Canonical URLs**: Her sayfa için canonical URL
- ✅ **Open Graph**: Sosyal medya paylaşımları için
- ✅ **Twitter Cards**: Twitter paylaşımları için
- ✅ **JSON-LD Schema Markup**: Gelişmiş Schema.org structured data
  - Product schema ile tam uyumlu
  - Brand bilgisi (Jizayn)
  - SKU ve GTIN desteği
  - PriceRange (AggregateOffer) - Rich snippets için
  - Offers içinde availability (InStock/OutOfStock/PreOrder/BackOrder)
  - AggregateRating (ratingValue, reviewCount, bestRating, worstRating)
  - Review array (müşteri yorumları)
  - Her offer için ayrı SKU/GTIN (Amazon/Etsy kodlarıyla eşleştirme)
- ✅ **Sitemap**: Dinamik XML sitemap
- ✅ **Robots.txt**: Arama motoru yönlendirmeleri
- ✅ **Google Shopping Feed**: `/product-feed.xml` - Google Merchant Center için XML feed
- ✅ **Local SEO**: Organization schema markup (her dil için adres ve areaServed)

## Performance - Core Web Vitals

### LCP (Largest Contentful Paint) Optimizasyonu

- ✅ **Priority Loading**: İlk görsel için `priority={true}` ve `loading="eager"`
- ✅ **Fetch Priority**: İlk görsel için `fetchPriority="high"`
- ✅ **Above the Fold**: Ürün listesinde ilk 6 ürün için priority loading
- ✅ **Lazy Loading**: Below the fold görseller için `loading="lazy"`
- ✅ **Image Optimization**: WebP ve AVIF formatları otomatik
- ✅ **Responsive Images**: `sizes` prop'u ile optimize edilmiş yükleme

**Optimizasyon Stratejisi:**
- Ürün detay sayfası: İlk görsel priority + eager
- Ürün listesi: İlk 6 ürün priority + eager (above the fold)
- Thumbnail galeri: İlk thumbnail eager, diğerleri lazy
- İlgili ürünler: Tümü lazy (below the fold)

## Domain Yapılandırması

Production'da domain: `www.jizayn.com`

`next.config.mjs` ve `app/layout.tsx` dosyalarında domain URL'leri güncellenmelidir.

## Görseller

Ürün görselleri `public/images/products/` klasörüne yerleştirilmelidir:

```
public/
└── images/
    └── products/
        └── [product-id]/
            ├── 1.jpg
            ├── 2.jpg
            ├── 3.jpg
            ├── 4.jpg
            ├── 5.jpg
            └── 6.jpg
```

### Görsel SEO Optimizasyonları

- ✅ **Alt Text**: Her görsele dil bazlı alt text eklenir (i18n ile)
- ✅ **Dosya İsimleri**: SEO-friendly dosya isimleri için `utils/image-seo.ts` kullanılabilir
- ✅ **WebP + AVIF**: Next.js Image component otomatik olarak WebP ve AVIF formatlarını oluşturur
- ✅ **Pinterest**: Her görsele `data-pin-description` attribute'u eklenir
- ✅ **Responsive Images**: `sizes` prop'u ile responsive görsel yükleme

**Örnek Görsel Yapılandırması:**

```typescript
images: [
  {
    url: '/images/products/1/ahsap-dekoratif-kutu-1.jpg',
    alt: 'Ahşap Dekoratif Kutu - Ana görsel',
    pinterestDescription: 'El yapımı Ahşap Dekoratif Kutu - Jizayn\'dan özel tasarım ahşap dekoratif ürün',
  },
  // ...
]
```

## Çeviri Ekleme

Yeni dil eklemek için:

1. `i18n/routing.ts` dosyasına locale ekle
2. `messages/[locale].json` dosyası oluştur
3. Tüm çeviri anahtarlarını ekle
4. `utils/currency.ts` dosyasına locale config ekle (currency, amazonDomain, etsyLocale)

## Hreflang & x-default

Tüm sayfalarda hreflang alternates ve x-default eklenmiştir:

- **x-default**: Dil tercihi belirsiz kullanıcılar için varsayılan dil (EN)
- **Tüm diller**: Her sayfa için tüm dil versiyonları
- **Utility fonksiyon**: `utils/hreflang.ts` ile merkezi yönetim

**Örnek HTML çıktısı:**
```html
<link rel="alternate" hreflang="tr" href="https://www.jizayn.com/tr/products" />
<link rel="alternate" hreflang="en" href="https://www.jizayn.com/en/products" />
<link rel="alternate" hreflang="de" href="https://www.jizayn.com/de/products" />
<link rel="alternate" hreflang="x-default" href="https://www.jizayn.com/en/products" />
```

## Local SEO - Organization Schema

Her sayfada Organization schema markup eklenmiştir:

- **Organization**: Jizayn şirket bilgileri
- **Address**: Her dil için lokalize edilmiş adres bilgileri
- **Area Served**: Hizmet verilen ülkeler (TR, DE, FR, RU, ES, AR, IT, PT, NL, US, GB, CA, AU)
- **Contact Point**: İletişim bilgileri (telefon, e-posta)

**Örnek JSON-LD Çıktısı:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Jizayn",
  "url": "https://www.jizayn.com",
  "logo": "https://www.jizayn.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TR",
    "addressLocality": "Istanbul",
    "addressRegion": "Istanbul",
    "postalCode": "34000",
    "streetAddress": "Atölye Adresi, Istanbul"
  },
  "areaServed": ["TR", "DE", "FR", "RU", "ES", "AR", "IT", "PT", "NL", "US", "GB", "CA", "AU"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-555-123-45-67",
    "email": "info@jizayn.com",
    "contactType": "Customer Service",
    "availableLanguage": ["tr", "en", "fr", "de", "ru", "es", "ar", "it", "pt", "nl"]
  }
}
```

**Not:** Adres bilgileri her dil için lokalize edilmiştir. Gerçek adres bilgilerinizi `utils/organization-schema.ts` dosyasında güncelleyin.

## Google Shopping Feed

Google Merchant Center için XML feed oluşturulmuştur:

- **URL**: `https://www.jizayn.com/product-feed.xml`
- **Format**: RSS 2.0 with Google Shopping namespace
- **Dil**: İngilizce (EN) ürün verileri kullanılır
- **Link Stratejisi**: Amazon/Etsy offer linkleri öncelikli, yoksa product page linki

**Feed İçeriği:**
- Ürün ID, title, description
- Amazon/Etsy satış linkleri
- Fiyat ve currency (Amazon/Etsy offer'ından veya priceRange'den)
- Görseller (ana görsel + ek görseller)
- Stok durumu (availability)
- Brand, GTIN, SKU bilgileri
- Google Product Category mapping

**Kullanım:**
1. Google Merchant Center'a giriş yapın
2. Products > Feeds bölümüne gidin
3. Yeni feed oluşturun
4. Feed URL'ini ekleyin: `https://www.jizayn.com/product-feed.xml`
5. Feed'i onaylayın ve yayınlayın

**Not:** Feed, Amazon/Etsy linklerini kullanır çünkü satış bu platformlarda yapılıyor. Product page linki fallback olarak kullanılır.

## Ülke Bazlı Currency & Pricing

Her locale için farklı Amazon/Etsy pazaryeri ve currency kullanılır:

- **TR**: amazon.com.tr, etsy.com/tr, TRY
- **EN**: amazon.com, etsy.com, USD
- **DE**: amazon.de, etsy.com/de, EUR
- **FR**: amazon.fr, etsy.com/fr, EUR
- **RU**: amazon.ru, etsy.com/ru, RUB
- **ES**: amazon.es, etsy.com/es, EUR
- **AR**: amazon.ae, etsy.com, SAR
- **IT**: amazon.it, etsy.com/it, EUR
- **PT**: amazon.es, etsy.com/pt, EUR
- **NL**: amazon.nl, etsy.com/nl, EUR

`utils/currency.ts` dosyasında locale-to-currency mapping tanımlıdır. Yeni locale eklerken bu dosyayı güncelleyin.

## Lisans

Özel proje - Tüm hakları saklıdır.
