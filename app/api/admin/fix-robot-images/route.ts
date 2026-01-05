import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // EN locale robot ürününü bul
    const enLocale = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'en',
          slug: 'handmade-wooden-robot-desk-organizer'
        }
      },
      select: {
        id: true,
        productId: true
      }
    });

    if (!enLocale) {
      return NextResponse.json({ error: 'EN locale not found' }, { status: 404 });
    }

    // TR locale robot ürününü bul
    const trLocale = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'tr',
          slug: 'el-yapimi-ahsap-robot-masa-duzenleyici'
        }
      },
      include: {
        ProductImage: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!trLocale) {
      return NextResponse.json({ error: 'TR locale not found' }, { status: 404 });
    }

    // Önce EN locale'deki tüm resimleri sil
    await prisma.productImage.deleteMany({
      where: {
        productLocaleId: enLocale.id
      }
    });

    // TR'deki resimleri EN'e kopyala
    for (const image of trLocale.ProductImage) {
      await prisma.productImage.create({
        data: {
          productLocaleId: enLocale.id,
          url: image.url,
          alt: image.alt,
          pinterestDescription: image.pinterestDescription,
          order: image.order
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `${trLocale.ProductImage.length} resim kopyalandı`
    });
  } catch (error) {
    console.error('Error copying robot images:', error);
    return NextResponse.json(
      { error: 'Failed to copy images' },
      { status: 500 }
    );
  }
}
