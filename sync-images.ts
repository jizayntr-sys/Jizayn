import { prisma } from './lib/prisma';
import { translateText, getLanguageCode } from './lib/translate';

async function syncAllProductImages() {
  console.log('🔄 Tüm ürünler için resimleri senkronize ediliyor...\n');

  const products = await prisma.product.findMany({
    include: {
      ProductLocale: {
        include: {
          ProductImage: { orderBy: { order: 'asc' } }
        }
      }
    }
  });

  for (const product of products) {
    console.log(`📦 Ürün: ${product.id}`);
    
    const trLocale = product.ProductLocale.find(l => l.locale === 'tr');
    if (!trLocale) {
      console.log('  ⚠️ TR locale bulunamadı, atlanıyor...\n');
      continue;
    }

    if (!trLocale.ProductImage || trLocale.ProductImage.length === 0) {
      console.log('  ⚠️ TR\'de resim yok, atlanıyor...\n');
      continue;
    }

    console.log(`  ✅ TR'de ${trLocale.ProductImage.length} resim bulundu`);

    const otherLocales = product.ProductLocale.filter(l => l.locale !== 'tr');

    for (const locale of otherLocales) {
      console.log(`    → ${locale.locale.toUpperCase()} diline kopyalanıyor...`);
      
      // Mevcut resimleri sil
      await prisma.productImage.deleteMany({
        where: { productLocaleId: locale.id }
      });

      // TR'deki resimleri kopyala
      for (const image of trLocale.ProductImage) {
        const targetLang = getLanguageCode(locale.locale);
        
        // Alt text'i çevir
        const translatedAlt = await translateText({
          text: image.alt,
          from: 'tr',
          to: targetLang
        });

        // Pinterest description'ı çevir
        const translatedPinterest = image.pinterestDescription 
          ? await translateText({
              text: image.pinterestDescription,
              from: 'tr',
              to: targetLang
            })
          : null;

        await prisma.productImage.create({
          data: {
            id: crypto.randomUUID(),
            productLocaleId: locale.id,
            url: image.url,
            alt: translatedAlt,
            pinterestDescription: translatedPinterest,
            order: image.order
          }
        });
      }
      
      console.log(`    ✅ ${locale.locale.toUpperCase()}: ${trLocale.ProductImage.length} resim kopyalandı`);
    }
    
    console.log('');
  }

  console.log('✅ Tüm ürünler için resim senkronizasyonu tamamlandı!');
}

syncAllProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
