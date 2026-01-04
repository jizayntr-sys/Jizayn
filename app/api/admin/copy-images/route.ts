import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateText, getLanguageCode } from '@/lib/translate';

// POST /api/admin/copy-images - TR'deki resimleri diğer tüm dillere kopyala (alt text çevirerek)
export async function POST() {
  try {
    console.log('Starting image copy process...');

    // Tüm ürünleri al
    const products = await prisma.product.findMany({
      include: {
        locales: {
          include: {
            images: true
          }
        }
      }
    });

    let copiedCount = 0;
    const results = [];

    for (const product of products) {
      // TR locale'i bul
      const trLocale = product.locales.find(l => l.locale === 'tr');
      
      if (!trLocale || !trLocale.images || trLocale.images.length === 0) {
        continue;
      }

      // Diğer dilleri bul
      const otherLocales = product.locales.filter(l => l.locale !== 'tr');

      for (const locale of otherLocales) {
        // Bu locale'deki mevcut resimleri sil (üzerine yazma modu)
        if (locale.images && locale.images.length > 0) {
          await prisma.productImage.deleteMany({
            where: {
              productLocaleId: locale.id
            }
          });
        }

        // TR'deki resimleri bu locale'e kopyala ve alt text'leri çevir
        for (const image of trLocale.images) {
          const targetLang = getLanguageCode(locale.locale);
          
          // Alt text'i çevir
          const translatedAlt = await translateText({
            text: image.alt,
            from: 'tr',
            to: targetLang
          });

          // Pinterest description'ı çevir (varsa)
          const translatedPinterest = image.pinterestDescription 
            ? await translateText({
                text: image.pinterestDescription,
                from: 'tr',
                to: targetLang
              })
            : null;

          await prisma.productImage.create({
            data: {
              productLocaleId: locale.id,
              url: image.url,
              alt: translatedAlt,
              pinterestDescription: translatedPinterest,
              order: image.order
            }
          });
          copiedCount++;
        }

        results.push({
          productId: product.id,
          locale: locale.locale,
          imagesCopied: trLocale.images.length
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${copiedCount} resim kopyalandı`,
      totalImagesCopied: copiedCount,
      results
    });

  } catch (error) {
    console.error('Image copy error:', error);
    return NextResponse.json(
      { error: 'Resim kopyalama hatası: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
