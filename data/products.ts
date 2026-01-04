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
      brand: true,
      locales: {
        where: locale ? { locale } : undefined,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          reviews: {
            orderBy: { datePublished: 'desc' },
          },
          faqs: {
            orderBy: { order: 'asc' },
          },
          offers: true,
          rating: true,
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
 * Slug ile ürün getirir
 * @param slug - Ürün slug'ı
 * @param locale - Locale kodu (tr, en, vs.)
 * @returns Product veya null
 */
export async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  const productLocale = await prisma.productLocale.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
      },
    },
    include: {
      product: {
        include: {
          brand: true,
          locales: {
            include: {
              images: {
                orderBy: { order: 'asc' },
              },
              reviews: {
                orderBy: { datePublished: 'desc' },
              },
              faqs: {
                orderBy: { order: 'asc' },
              },
              offers: true,
              rating: true,
            },
          },
        },
      },
    },
  });

  if (!productLocale) {
    return null;
  }

  return transformProduct(productLocale.product);
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
      brand: true,
      locales: {
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          reviews: {
            orderBy: { datePublished: 'desc' },
          },
          faqs: {
            orderBy: { order: 'asc' },
          },
          offers: true,
          rating: true,
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
