import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/data/products';

// GET /api/products/slug/[locale]/[slug] - Locale ve slug ile ürün getir + tüm dillerdeki slug'ları döndür
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  try {
    const { locale, slug } = await params;

    const product = await getProductBySlug(slug, locale);

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    // Tüm dillerdeki slug'ları bir map olarak hazırla
    const slugs: Record<string, string> = {};
    Object.keys(product.locales).forEach((loc) => {
      const localeData = product.locales[loc as keyof typeof product.locales];
      if (localeData?.slug) {
        slugs[loc] = localeData.slug;
      }
    });

    return NextResponse.json({ 
      product,
      slugs, // { tr: 'kumiko-ahsap-masa-lambasi', en: 'kumiko-wooden-table-lamp', ... }
    }, { status: 200 });
  } catch (error) {
    console.error('Product by slug GET error:', error);
    return NextResponse.json(
      { error: 'Ürün alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

