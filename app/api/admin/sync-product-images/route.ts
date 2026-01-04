import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/sync-product-images - Belirli bir ürünün resimlerini TR'den tüm dillere senkronize et
export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'productId gerekli' },
        { status: 400 }
      );
    }

    // Ürünü ve tüm locale'lerini al
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        locales: {
          include: {
            images: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    // TR locale'i bul
    const trLocale = product.locales.find(l => l.locale === 'tr');
    
    if (!trLocale || !trLocale.images || trLocale.images.length === 0) {
      return NextResponse.json(
        { error: 'TR locale veya resimleri bulunamadı' },
        { status: 404 }
      );
    }

    // Diğer dilleri bul
    const otherLocales = product.locales.filter(l => l.locale !== 'tr');

    let copiedCount = 0;

    for (const locale of otherLocales) {
      // Bu locale'deki mevcut resimleri sil
      await prisma.productImage.deleteMany({
        where: {
          productLocaleId: locale.id
        }
      });

      // TR'deki resimleri kopyala
      for (const image of trLocale.images) {
        await prisma.productImage.create({
          data: {
            productLocaleId: locale.id,
            url: image.url,
            alt: image.alt,
            pinterestDescription: image.pinterestDescription,
            order: image.order
          }
        });
        copiedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${copiedCount} resim ${otherLocales.length} dile kopyalandı`,
      copiedCount,
      locales: otherLocales.map(l => l.locale)
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Senkronizasyon hatası: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
