/**
 * Prisma verilerini Product type formatına dönüştüren helper fonksiyonlar
 */

import { Product, ProductLocaleData, ProductImage, ProductReview, FaqItem, ProductOffer } from '@/types/product';
import { prisma } from './prisma';

/**
 * Prisma ProductLocale verisini ProductLocaleData formatına dönüştürür
 */
export function transformProductLocale(prismaLocale: any): ProductLocaleData {
  return {
    slug: prismaLocale.slug,
    name: prismaLocale.name,
    description: prismaLocale.description,
    images: prismaLocale.ProductImage.map((img: any) => ({
      url: img.url,
      alt: img.alt,
      pinterestDescription: img.pinterestDescription || undefined,
    }) as ProductImage),
    video: prismaLocale.video || undefined,
    dimensions: prismaLocale.dimensions,
    materials: prismaLocale.materials,
    specifications: prismaLocale.specifications || [],
    sku: prismaLocale.sku,
    gtin: prismaLocale.gtin || undefined,
    availability: prismaLocale.availability as 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder',
    priceRange: {
      min: Number(prismaLocale.priceMin),
      max: Number(prismaLocale.priceMax),
      currency: prismaLocale.priceCurrency,
    },
    amazonUrl: prismaLocale.amazonUrl || undefined,
    amazonOffer: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon') ? {
      url: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').url,
      availability: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').availability,
      price: Number(prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').price),
      priceCurrency: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').priceCurrency,
      sku: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').sku || undefined,
      gtin: prismaLocale.ProductOffer.find((o: any) => o.platform === 'amazon').gtin || undefined,
    } as ProductOffer : undefined,
    etsyUrl: prismaLocale.etsyUrl || undefined,
    etsyOffer: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy') ? {
      url: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').url,
      availability: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').availability,
      price: Number(prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').price),
      priceCurrency: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').priceCurrency,
      sku: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').sku || undefined,
      gtin: prismaLocale.ProductOffer.find((o: any) => o.platform === 'etsy').gtin || undefined,
    } as ProductOffer : undefined,
    aggregateRating: prismaLocale.ProductRating ? {
      ratingValue: Number(prismaLocale.ProductRating.ratingValue),
      reviewCount: prismaLocale.ProductRating.reviewCount,
      bestRating: prismaLocale.ProductRating.bestRating,
      worstRating: prismaLocale.ProductRating.worstRating,
    } : undefined,
    reviews: prismaLocale.ProductReview?.map((r: any) => ({
      author: r.author,
      datePublished: r.datePublished.toISOString().split('T')[0],
      reviewBody: r.reviewBody,
      reviewRating: r.reviewRating,
      reviewSource: r.reviewSource as 'Amazon' | 'Etsy' | 'Website' | undefined,
    } as ProductReview)) || [],
    faq: prismaLocale.ProductFaq?.map((f: any) => ({
      question: f.question,
      answer: f.answer,
    } as FaqItem)) || [],
    metaTitle: prismaLocale.metaTitle,
    metaDescription: prismaLocale.metaDescription,
    metaKeywords: prismaLocale.metaKeywords || [],
  };
}

/**
 * Prisma Product verisini Product type formatına dönüştürür
 */
export function transformProduct(prismaProduct: any): Product {
  const locales: Record<string, ProductLocaleData> = {};
  
  for (const locale of prismaProduct.ProductLocale) {
    locales[locale.locale] = transformProductLocale(locale);
  }

  return {
    id: prismaProduct.id,
    category: prismaProduct.category,
    tags: prismaProduct.tags || [],
    brand: {
      name: prismaProduct.Brand.name,
      url: prismaProduct.Brand.url,
      logo: prismaProduct.Brand.logo,
    },
    locales,
  };
}

