/**
 * Seed Script - Örnek ürünleri veritabanına aktarır
 * 
 * Kullanım: npm run db:seed
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

// Örnek seed data
const sampleProducts = [
  {
    id: 'wooden-wall-clock-001',
    category: 'Duvar Saatleri',
    tags: ['duvar saati', 'ahşap saat', 'dekoratif'],
    locales: {
      tr: {
        slug: 'ahsap-duvar-saati',
        name: 'El Yapımı Ahşap Duvar Saati',
        description: 'Tamamen el yapımı, doğal ahşaptan üretilmiş modern duvar saati.',
        dimensions: '30cm x 30cm x 5cm',
        materials: 'Ceviz Ahşabı, Metal',
        specifications: ['Sessiz çalışma', 'Pil ile çalışır', 'El yapımı'],
        sku: 'JZN-WC-001-TR',
        gtin: '1234567890123',
        availability: 'InStock',
        priceRange: { min: 250, max: 350, currency: 'TRY' },
        metaTitle: 'El Yapımı Ahşap Duvar Saati | Jizayn',
        metaDescription: 'Modern ve şık ahşap duvar saati. El yapımı, doğal malzeme.',
        metaKeywords: ['ahşap saat', 'duvar saati', 'el yapımı'],
        images: [
          { url: '/images/products/Woody/robot-desk-organizer-1.webp', alt: 'Ahşap Duvar Saati', pinterestDescription: 'El yapımı ahşap duvar saati' },
        ],
        reviews: [],
        faqs: [],
      },
      en: {
        slug: 'wooden-wall-clock',
        name: 'Handmade Wooden Wall Clock',
        description: 'Completely handmade modern wall clock made from natural wood.',
        dimensions: '30cm x 30cm x 5cm',
        materials: 'Walnut Wood, Metal',
        specifications: ['Silent operation', 'Battery powered', 'Handmade'],
        sku: 'JZN-WC-001-EN',
        gtin: '1234567890123',
        availability: 'InStock',
        priceRange: { min: 25, max: 35, currency: 'USD' },
        metaTitle: 'Handmade Wooden Wall Clock | Jizayn',
        metaDescription: 'Modern and elegant wooden wall clock. Handmade, natural materials.',
        metaKeywords: ['wooden clock', 'wall clock', 'handmade'],
        images: [
          { url: '/images/products/Woody/robot-desk-organizer-1.webp', alt: 'Wooden Wall Clock', pinterestDescription: 'Handmade wooden wall clock' },
        ],
        reviews: [],
        faqs: [],
      },
    },
  },
];

async function main() {
  console.log('🌱 Seed script başlatılıyor...');

  // Önce Jizayn markasını oluştur
  let brand = await prisma.brand.findFirst({
    where: { name: 'Jizayn' },
  });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: 'Jizayn',
        url: 'https://www.jizayn.com',
        logo: 'https://www.jizayn.com/JizaynLogo.svg',
      },
    });
  }

  console.log(`✅ Marka oluşturuldu: ${brand.name} (${brand.id})`);

  // Her ürün için
  for (const productData of sampleProducts) {
    console.log(`\n📦 Ürün işleniyor: ${productData.id}`);

    // Ürünü oluştur veya güncelle
    const product = await prisma.product.upsert({
      where: { id: productData.id },
      update: {
        category: productData.category,
        tags: productData.tags,
        updatedAt: new Date(),
      },
      create: {
        id: productData.id,
        category: productData.category,
        tags: productData.tags,
        brandId: brand.id,
        updatedAt: new Date(),
      },
    });

    console.log(`  ✅ Ürün: ${product.id} (${product.category})`);

    // Her locale için
    for (const [locale, localeData] of Object.entries(productData.locales)) {
      console.log(`  🌐 Locale: ${locale}`);

      // ProductLocale oluştur - Önce var mı kontrol et
      const existingLocale = await prisma.productLocale.findUnique({
        where: {
          productId_locale: {
            productId: product.id,
            locale,
          },
        },
      });

      const productLocale = existingLocale 
        ? await prisma.productLocale.update({
            where: { id: existingLocale.id },
            data: {
              slug: localeData.slug,
              name: localeData.name,
              description: localeData.description,
              dimensions: localeData.dimensions,
              materials: localeData.materials,
              specifications: localeData.specifications,
              sku: localeData.sku,
              gtin: localeData.gtin,
              availability: localeData.availability,
              priceMin: localeData.priceRange.min,
              priceMax: localeData.priceRange.max,
              priceCurrency: localeData.priceRange.currency,
              amazonUrl: localeData.amazonUrl,
              etsyUrl: localeData.etsyUrl,
              video: localeData.video,
              metaTitle: localeData.metaTitle,
              metaDescription: localeData.metaDescription,
              metaKeywords: localeData.metaKeywords,
            },
          })
        : await prisma.productLocale.create({
            data: {
              productId: product.id,
              locale,
              slug: localeData.slug,
              name: localeData.name,
              description: localeData.description,
              dimensions: localeData.dimensions,
              materials: localeData.materials,
              specifications: localeData.specifications,
              sku: localeData.sku,
              gtin: localeData.gtin,
              availability: localeData.availability,
              priceMin: localeData.priceRange.min,
              priceMax: localeData.priceRange.max,
              priceCurrency: localeData.priceRange.currency,
              amazonUrl: localeData.amazonUrl,
              etsyUrl: localeData.etsyUrl,
              video: localeData.video,
              metaTitle: localeData.metaTitle,
              metaDescription: localeData.metaDescription,
              metaKeywords: localeData.metaKeywords,
            },
          });

      // Mevcut görselleri sil ve yenilerini oluştur
      await prisma.productImage.deleteMany({
        where: { productLocaleId: productLocale.id },
      });
      
      for (let i = 0; i < localeData.images.length; i++) {
        await prisma.productImage.create({
          data: {
            id: crypto.randomUUID(),
            productLocaleId: productLocale.id,
            url: localeData.images[i].url,
            alt: localeData.images[i].alt,
            pinterestDescription: localeData.images[i].pinterestDescription,
            order: i,
          },
        });
      }
      console.log(`    ✅ ${localeData.images.length} görsel eklendi`);

      // Mevcut yorumları sil ve yenilerini oluştur
      await prisma.productReview.deleteMany({
        where: { productLocaleId: productLocale.id },
      });
      
      if (localeData.reviews) {
        for (const review of localeData.reviews) {
          await prisma.productReview.create({
            data: {
              productLocaleId: productLocale.id,
              author: review.author,
              datePublished: new Date(review.datePublished),
              reviewBody: review.reviewBody,
              reviewRating: review.reviewRating,
              reviewSource: review.reviewSource,
            },
          });
        }
        console.log(`    ✅ ${localeData.reviews.length} yorum eklendi`);
      }

      // Mevcut FAQ'leri sil ve yenilerini oluştur
      await prisma.productFaq.deleteMany({
        where: { productLocaleId: productLocale.id },
      });
      
      if (localeData.faq) {
        for (let i = 0; i < localeData.faq.length; i++) {
          await prisma.productFaq.create({
            data: {
              productLocaleId: productLocale.id,
              question: localeData.faq[i].question,
              answer: localeData.faq[i].answer,
              order: i,
            },
          });
        }
        console.log(`    ✅ ${localeData.faq.length} FAQ eklendi`);
      }

      // Mevcut offer'ları sil ve yenilerini oluştur
      await prisma.productOffer.deleteMany({
        where: { productLocaleId: productLocale.id },
      });
      
      if (localeData.amazonOffer) {
        await prisma.productOffer.create({
          data: {
            productLocaleId: productLocale.id,
            platform: 'amazon',
            url: localeData.amazonOffer.url,
            availability: localeData.amazonOffer.availability,
            price: localeData.amazonOffer.price,
            priceCurrency: localeData.amazonOffer.priceCurrency,
            sku: localeData.amazonOffer.sku,
            gtin: localeData.amazonOffer.gtin,
          },
        });
        console.log(`    ✅ Amazon offer eklendi`);
      }

      if (localeData.etsyOffer) {
        await prisma.productOffer.create({
          data: {
            productLocaleId: productLocale.id,
            platform: 'etsy',
            url: localeData.etsyOffer.url,
            availability: localeData.etsyOffer.availability,
            price: localeData.etsyOffer.price,
            priceCurrency: localeData.etsyOffer.priceCurrency,
            sku: localeData.etsyOffer.sku,
            gtin: localeData.etsyOffer.gtin,
          },
        });
        console.log(`    ✅ Etsy offer eklendi`);
      }

      // Rating oluştur veya güncelle
      if (localeData.aggregateRating) {
        await prisma.productRating.upsert({
          where: { productLocaleId: productLocale.id },
          update: {
            ratingValue: localeData.aggregateRating.ratingValue,
            reviewCount: localeData.aggregateRating.reviewCount,
            bestRating: localeData.aggregateRating.bestRating,
            worstRating: localeData.aggregateRating.worstRating,
          },
          create: {
            productLocaleId: productLocale.id,
            ratingValue: localeData.aggregateRating.ratingValue,
            reviewCount: localeData.aggregateRating.reviewCount,
            bestRating: localeData.aggregateRating.bestRating,
            worstRating: localeData.aggregateRating.worstRating,
          },
        });
        console.log(`    ✅ Rating eklendi`);
      }
    }
  }

  console.log('\n✨ Seed script tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed script hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

