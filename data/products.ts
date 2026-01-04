/**
 * Product Data Access Layer
 * Prisma'dan veri çeker ve mevcut Product type formatına dönüştürür
 */

import { Product } from '@/types/product';
import { prisma } from '@/lib/prisma';
import { transformProduct } from '@/lib/prisma-helpers';

/**
 * Tüm ürünleri getirir
 * @param locale - Opsiyonel locale filtresi
 * @returns Product array
 */
export async function getAllProducts(locale?: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      Brand: true,
      ProductLocale: {
        where: locale ? { locale } : undefined,
        include: {
          ProductImage: {
            orderBy: { order: 'asc' },
          },
          ProductReview: {
            orderBy: { datePublished: 'desc' },
          },
          ProductFaq: {
            orderBy: { order: 'asc' },
          },
          ProductOffer: true,
          ProductRating: true,
        },
      },
    },
    orderBy: [
      { sortOrder: 'asc' },  // Önce sıra numarasına göre
      { createdAt: 'desc' }, // Sonra en yeniler
    ],
  });

  return products.map(transformProduct);
}

/**
 * Slug ile ürün getirir (Fallback destekli)
 * Eğer istenen locale yoksa, önce EN sonra TR'ye fallback yapar
 * @param slug - Ürün slug'ı
 * @param locale - Locale kodu (tr, en, vs.)
 * @returns Product veya null
 */
export async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  // Önce istenen locale'de ara
  let productLocale = await prisma.productLocale.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
      },
    },
    include: {
      Product: {
        include: {
          Brand: true,
          ProductLocale: {
            include: {
              ProductImage: {
                orderBy: { order: 'asc' },
              },
              ProductReview: {
                orderBy: { datePublished: 'desc' },
              },
              ProductFaq: {
                orderBy: { order: 'asc' },
              },
              ProductOffer: true,
              ProductRating: true,
            },
          },
        },
      },
    },
  });

  // İstenen locale'de bulunamadı, fallback deneyelim
  if (!productLocale && locale !== 'en' && locale !== 'tr') {
    console.log(`${locale} locale bulunamadı, fallback yapılıyor...`);
    
    // Önce EN'de ara
    productLocale = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'en',
          slug,
        },
      },
      include: {
        Product: {
          include: {
            Brand: true,
            ProductLocale: {
              include: {
                ProductImage: { orderBy: { order: 'asc' } },
                ProductReview: { orderBy: { datePublished: 'desc' } },
                ProductFaq: { orderBy: { order: 'asc' } },
                ProductOffer: true,
                ProductRating: true,
              },
            },
          },
        },
      },
    });

    // EN'de de yok, TR'de ara
    if (!productLocale) {
      productLocale = await prisma.productLocale.findUnique({
        where: {
          locale_slug: {
            locale: 'tr',
            slug,
          },
        },
        include: {
          Product: {
            include: {
              Brand: true,
              ProductLocale: {
                include: {
                  ProductImage: { orderBy: { order: 'asc' } },
                  ProductReview: { orderBy: { datePublished: 'desc' } },
                  ProductFaq: { orderBy: { order: 'asc' } },
                  ProductOffer: true,
                  ProductRating: true,
                },
              },
            },
          },
        },
      });
    }
  }

  if (!productLocale) {
    return null;
  }

  return transformProduct(productLocale.Product);
}

/**
 * ID ile ürün getirir
 * @param id - Ürün ID'si
 * @returns Product veya null
 */
export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      Brand: true,
      ProductLocale: {
        include: {
          ProductImage: {
            orderBy: { order: 'asc' },
          },
          ProductReview: {
            orderBy: { datePublished: 'desc' },
          },
          ProductFaq: {
            orderBy: { order: 'asc' },
          },
          ProductOffer: true,
          ProductRating: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return transformProduct(product);
}

/**
 * Sync fonksiyon - Geçici olarak mevcut kodlar için
 * Kullanımdan kaldırılacak - getAllProducts() kullanın
 * @deprecated Use getAllProducts() instead
 */
export async function getProductsSync(locale?: string): Promise<Product[]> {
  return getAllProducts(locale);
}

// Backward compatibility için - deprecated
// Bu export artık async olduğu için kullanıcılar getAllProducts() kullanmalı
// Eski kodlar için geçici çözüm
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 dakika

export async function getProductsForSync(): Promise<Product[]> {
  const now = Date.now();
  if (!cachedProducts || (now - cacheTimestamp) > CACHE_TTL) {
    cachedProducts = await getAllProducts();
    cacheTimestamp = now;
  }
  return cachedProducts;
}
