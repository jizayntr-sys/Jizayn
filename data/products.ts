/**
 * Static Product Data
 * Database yerine statik ürün verileri
 */

import { Product } from '@/types/product';

// Statik ürün verileri
export const products: Product[] = [
  {
    id: 'kumiko-lamp',
    category: 'lighting',
    tags: ['kumiko', 'wooden-lamp', 'japanese', 'handmade'],
    brand: {
      name: 'Jizayn',
      url: 'https://jizayn.com',
      logo: '/logo.png'
    },
    isFeatured: true,
    locales: {
      tr: {
        slug: 'kumiko-ahsap-masa-lambasi',
        name: 'El Yapımı Kumiko Ahşap Masa Lambası',
        description: '', // Styled sections will be in page.tsx
        images: [
          {
            url: '/images/products/Kumiko/ElyapimiKumikomasalambasi.webp',
            alt: 'El Yapımı Kumiko Ahşap Masa Lambası - Geleneksel Japon Sanatı',
            pinterestDescription: 'El yapımı Kumiko ahşap masa lambası - Japon sanatı ile yapılmış benzersiz tasarım'
          },
          {
            url: '/images/products/Kumiko/Kumiko.webp',
            alt: 'Kumiko Masa Lambası - Geometrik Desen Detayı',
            pinterestDescription: 'Kumiko geçme tekniği ile yapılmış ahşap masa lambası detay'
          },
          {
            url: '/images/products/Kumiko/Kumikoabajur.webp',
            alt: 'Kumiko Abajur - Işık ve Gölge Oyunu',
            pinterestDescription: 'Kumiko abajur ile yaratılan büyüleyici ışık efektleri'
          },
          {
            url: '/images/products/Kumiko/Kumikogecelambasi.webp',
            alt: 'Kumiko Gece Lambası - Yatak Odası Dekorasyonu',
            pinterestDescription: 'Kumiko gece lambası ile huzurlu atmosfer'
          },
          {
            url: '/images/products/Kumiko/Gelenekselgeometrikahsap.webp',
            alt: 'Geleneksel Geometrik Ahşap Kumiko Tasarım',
            pinterestDescription: 'Geleneksel Kumiko geometrik desen ve ahşap işçiliği'
          }
        ],
        video: undefined,
        dimensions: '20 x 20 x 25 cm',
        materials: 'Masif maun ve çam ağacı',
        specifications: [
          'Geleneksel Kumiko tekniği',
          'Yapıştırıcısız montaj',
          'E14 duy',
          'CE sertifikalı'
        ],
        sku: 'JIZAYN-KUMIKO-001',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 1200,
          max: 1200,
          currency: 'TRY'
        },
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'El Yapımı Kumiko Ahşap Masa Lambası | Jizayn',
        metaDescription: '400 yıllık Japon Kumiko tekniği ile üretilen el yapımı ahşap masa lambası. Doğal malzeme, benzersiz tasarım, modern dekorasyon için ideal.',
        metaKeywords: ['kumiko', 'ahşap lamba', 'masa lambası', 'japon sanatı', 'el yapımı'],
        faq: [
          {
            question: 'Ampul dahil mi?',
            answer: 'Hayır, E14 duy tipi LED ampul ayrıca temin edilmelidir. 2-5W sıcak beyaz LED ampul öneriyoruz.'
          },
          {
            question: 'Nasıl temizlenir?',
            answer: 'Kuru veya hafif nemli yumuşak bez ile silin. Kimyasal temizleyici kullanmayın.'
          }
        ],
        reviews: [],
        aggregateRating: {
          ratingValue: 4.8,
          reviewCount: 12,
          bestRating: 5,
          worstRating: 1
        }
      },
      en: {
        slug: 'kumiko-wooden-table-lamp',
        name: 'Handmade Kumiko Wooden Table Lamp',
        description: '', // Styled sections will be in page.tsx
        images: [
          {
            url: '/images/products/Kumiko/ElyapimiKumikomasalambasi.webp',
            alt: 'Handmade Kumiko Wooden Table Lamp - Traditional Japanese Art',
            pinterestDescription: 'Handmade Kumiko wooden table lamp - unique design crafted with Japanese art'
          },
          {
            url: '/images/products/Kumiko/Kumiko.webp',
            alt: 'Kumiko Table Lamp - Geometric Pattern Detail',
            pinterestDescription: 'Wooden table lamp crafted with Kumiko joinery technique detail'
          },
          {
            url: '/images/products/Kumiko/Kumikoabajur.webp',
            alt: 'Kumiko Lamp Shade - Light and Shadow Play',
            pinterestDescription: 'Fascinating light effects created with Kumiko lamp shade'
          },
          {
            url: '/images/products/Kumiko/Kumikogecelambasi.webp',
            alt: 'Kumiko Night Lamp - Bedroom Decoration',
            pinterestDescription: 'Peaceful atmosphere with Kumiko night lamp'
          },
          {
            url: '/images/products/Kumiko/Gelenekselgeometrikahsap.webp',
            alt: 'Traditional Geometric Wooden Kumiko Design',
            pinterestDescription: 'Traditional Kumiko geometric pattern and woodworking craftsmanship'
          }
        ],
        video: undefined,
        dimensions: '20 x 20 x 25 cm (7.9 x 7.9 x 9.8 inches)',
        materials: 'Solid mahogany and pine wood',
        specifications: [
          'Traditional Kumiko technique',
          'No glue assembly',
          'E14 socket',
          'CE certified'
        ],
        sku: 'JIZAYN-KUMIKO-001',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 1200,
          max: 1200,
          currency: 'TRY'
        },
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'Handmade Kumiko Wooden Table Lamp | Jizayn',
        metaDescription: 'Handmade wooden table lamp crafted with 400-year-old Japanese Kumiko technique. Natural materials, unique design, perfect for modern decor.',
        metaKeywords: ['kumiko', 'wooden lamp', 'table lamp', 'japanese art', 'handmade'],
        faq: [
          {
            question: 'Is the bulb included?',
            answer: 'No, E14 socket LED bulb must be purchased separately. We recommend 2-5W warm white LED bulb.'
          },
          {
            question: 'How to clean?',
            answer: 'Wipe with a dry or slightly damp soft cloth. Do not use chemical cleaners.'
          }
        ],
        reviews: [],
        aggregateRating: {
          ratingValue: 4.8,
          reviewCount: 12,
          bestRating: 5,
          worstRating: 1
        }
      }
    }
  }
];

/**
 * Tüm ürünleri getirir
 * @param locale - Opsiyonel locale filtresi (kullanılmıyor artık)
 * @returns Product array
 */
export async function getAllProducts(locale?: string): Promise<Product[]> {
  return products;
}

/**
 * Slug ile ürün getirir
 * @param slug - Ürün slug'ı
 * @param locale - Locale kodu (tr, en, vs.)
 * @returns Product veya null
 */
export async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  const product = products.find(p => {
    // Tüm locale'leri kontrol et
    const locales = p.locales as any;
    for (const loc in locales) {
      if (locales[loc]?.slug === slug) {
        return true;
      }
    }
    return false;
  });
  
  return product || null;
}

/**
 * ID ile ürün getirir
 * @param id - Ürün ID'si
 * @returns Product veya null
 */
export async function getProductById(id: string): Promise<Product | null> {
  const product = products.find(p => p.id === id);
  return product || null;
}
