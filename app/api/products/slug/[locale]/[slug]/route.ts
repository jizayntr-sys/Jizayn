import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/slug/[locale]/[slug] - Locale ve slug ile ürün getir
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
        product: {
          include: {
            brand: true,
          },
        },
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
    });

    if (!productLocale) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ productLocale }, { status: 200 });
  } catch (error) {
    console.error('Product by slug GET error:', error);
    return NextResponse.json(
      { error: 'Ürün alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

