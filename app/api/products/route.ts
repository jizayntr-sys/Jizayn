import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transformProduct } from '@/lib/prisma-helpers';

// GET /api/products - Tüm ürünleri listele (opsiyonel locale filtresi)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale');

    const products = await prisma.product.findMany({
      include: {
        Brand: true,
        locales: {
          include: {
            ProductImage: {
              orderBy: { order: 'asc' },
            },
            ProductReview: true,
            ProductFaq: {
              orderBy: { order: 'asc' },
            },
            ProductOffer: true,
            ProductRating: true,
          },
          ...(locale ? { where: { locale } } : {}),
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    // Prisma sonuçlarını Product type formatına dönüştür
    const transformedProducts = products.map(transformProduct);

    return NextResponse.json({ products: transformedProducts }, { status: 200 });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Ürünler alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// POST /api/products - Yeni ürün oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      tags,
      brand,
      brandId,
      locales,
      sortOrder,
    } = body;

    // Brand'i bul veya oluştur
    let existingBrand = null;
    if (brand) {
      // Önce name ile ara (unique field)
      existingBrand = await prisma.brand.findFirst({ where: { name: brand.name } });
      if (!existingBrand) {
      existingBrand = await prisma.brand.create({
        data: {
          id: crypto.randomUUID(),
          name: brand.name,
          url: brand.url,
          logo: brand.logo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      }
    } else if (brandId) {
      existingBrand = await prisma.brand.findUnique({ where: { id: brandId } });
    }

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Marka bulunamadı veya oluşturulamadı.' },
        { status: 400 }
      );
    }

    // Locales formatını kontrol et - object ise array'e çevir
    let localesArray = locales;
    if (locales && typeof locales === 'object' && !Array.isArray(locales)) {
      localesArray = Object.entries(locales).map(([locale, localeData]: [string, any]) => ({
        locale,
        ...localeData,
      }));
    }

    // Validation
    if (!category || !existingBrand || !localesArray || !Array.isArray(localesArray) || localesArray.length === 0) {
      return NextResponse.json(
        { error: 'Kategori, marka ve en az bir locale gereklidir.' },
        { status: 400 }
      );
    }

    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        category,
        tags: tags || [],
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
        brandId: existingBrand.id,
        locales: {
          create: localesArray.map((localeData: any) => ({
            id: crypto.randomUUID(),
            locale: localeData.locale,
            slug: localeData.slug,
            name: localeData.name,
            description: localeData.description,
            dimensions: localeData.dimensions,
            materials: localeData.materials,
            specifications: localeData.specifications || [],
            sku: localeData.sku,
            gtin: localeData.gtin,
            availability: localeData.availability || 'InStock',
            priceMin: localeData.priceRange?.min || 0,
            priceMax: localeData.priceRange?.max || 0,
            priceCurrency: localeData.priceRange?.currency || 'TRY',
            amazonUrl: localeData.amazonUrl,
            etsyUrl: localeData.etsyUrl,
            video: localeData.video,
            metaTitle: localeData.metaTitle || localeData.name,
            metaDescription: localeData.metaDescription || localeData.description.substring(0, 160),
            metaKeywords: localeData.metaKeywords || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            ProductImage: {
              create: (localeData.images || []).map((img: any, index: number) => ({
                id: crypto.randomUUID(),
                url: img.url,
                alt: img.alt,
                pinterestDescription: img.pinterestDescription,
                order: index,
                createdAt: new Date(),
              })),
            },
            ProductReview: {
              create: (localeData.reviews || []).map((review: any) => ({
                id: crypto.randomUUID(),
                author: review.author,
                datePublished: new Date(review.datePublished),
                reviewBody: review.reviewBody,
                reviewRating: review.reviewRating,
                reviewSource: review.reviewSource,
                isApproved: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
            ProductFaq: {
              create: (localeData.faq || []).map((faq: any, index: number) => ({
                id: crypto.randomUUID(),
                question: faq.question,
                answer: faq.answer,
                order: index,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
            ProductOffer: {
              create: [
                localeData.amazonOffer && {
                  id: crypto.randomUUID(),
                  platform: 'amazon',
                  url: localeData.amazonOffer.url,
                  availability: localeData.amazonOffer.availability,
                  price: localeData.amazonOffer.price,
                  priceCurrency: localeData.amazonOffer.priceCurrency,
                  sku: localeData.amazonOffer.sku,
                  gtin: localeData.amazonOffer.gtin,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                localeData.etsyOffer && {
                  id: crypto.randomUUID(),
                  platform: 'etsy',
                  url: localeData.etsyOffer.url,
                  availability: localeData.etsyOffer.availability,
                  price: localeData.etsyOffer.price,
                  priceCurrency: localeData.etsyOffer.priceCurrency,
                  sku: localeData.etsyOffer.sku,
                  gtin: localeData.etsyOffer.gtin,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ].filter(Boolean) as any[],
            },
            ProductRating: localeData.aggregateRating ? {
              create: {
                id: crypto.randomUUID(),
                ratingValue: localeData.aggregateRating.ratingValue,
                reviewCount: localeData.aggregateRating.reviewCount,
                bestRating: localeData.aggregateRating.bestRating || 5,
                worstRating: localeData.aggregateRating.worstRating || 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            } : undefined,
          })),
        },
      },
      include: {
        Brand: true,
        locales: {
          include: {
            ProductImage: { orderBy: { order: 'asc' } },
            ProductReview: true,
            ProductFaq: { orderBy: { order: 'asc' } },
            ProductOffer: true,
            ProductRating: true,
          },
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Product POST error:', error);
    
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor. Lütfen farklı bir slug kullanın.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Ürün oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

