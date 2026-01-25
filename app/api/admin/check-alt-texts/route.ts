import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Kumiko ürünü mevcut alt text'lerini kontrol eder
 * GET: http://localhost:3000/api/admin/check-alt-texts
 */
export async function GET() {
  try {
    const kumikoProducts = await prisma.productLocale.findMany({
      where: {
        OR: [
          { slug: 'el-yapimi-kumiko-ahsap-masa-lambasi' },
          { slug: { contains: 'kumiko' } },
        ],
      },
      include: {
        ProductImage: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const result = kumikoProducts.map((product) => ({
      locale: product.locale,
      slug: product.slug,
      name: product.name,
      images: product.ProductImage.map((img) => ({
        url: img.url,
        filename: img.url.split('/').pop(),
        alt: img.alt || '(BOŞ)',
        order: img.order,
      })),
    }));

    return NextResponse.json({
      success: true,
      products: result,
      totalProducts: result.length,
      totalImages: result.reduce((sum, p) => sum + p.images.length, 0),
    });
  } catch (error: any) {
    console.error('❌ Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}
