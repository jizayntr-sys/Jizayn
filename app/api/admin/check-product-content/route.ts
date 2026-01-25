import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Kumiko ürünü içeriğini kontrol eder
 * GET: http://localhost:3000/api/admin/check-product-content
 */
export async function GET() {
  try {
    const kumiko = await prisma.productLocale.findFirst({
      where: {
        slug: 'el-yapimi-kumiko-ahsap-masa-lambasi',
        locale: 'tr',
      },
      include: {
        ProductFaq: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!kumiko) {
      return NextResponse.json(
        { error: 'Kumiko ürünü bulunamadı' },
        { status: 404 }
      );
    }

    // HTML tag'lerini kaldır ve kelime sayısını hesapla
    const plainDescription = kumiko.description?.replace(/<[^>]*>/g, '') || '';
    const wordCount = plainDescription.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      success: true,
      name: kumiko.name,
      slug: kumiko.slug,
      description: kumiko.description,
      plainDescription,
      wordCount,
      specifications: kumiko.specifications,
      materials: kumiko.materials,
      dimensions: kumiko.dimensions,
      faqCount: kumiko.ProductFaq.length,
      faqs: kumiko.ProductFaq,
    });
  } catch (error: any) {
    console.error('❌ Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}
