import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/slug/[locale]/[slug] - Locale ve slug ile ürün getir + tüm dillerdeki slug'ları döndür
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  try {
    const { locale, slug } = await params;

    const productLocale = await prisma.productLocale.findUnique({
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
              select: {
                locale: true,
                slug: true,
              },
            },
          },
        },
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
    });

    if (!productLocale) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    // Tüm dillerdeki slug'ları bir map olarak hazırla
    const slugs = productLocale.Product.ProductLocale.reduce((acc, locale) => {
      acc[locale.locale] = locale.slug;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ 
      productLocale,
      slugs, // { tr: 'slug-tr', en: 'slug-en', ... }
    }, { status: 200 });
  } catch (error) {
    console.error('Product by slug GET error:', error);
    return NextResponse.json(
      { error: 'Ürün alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

