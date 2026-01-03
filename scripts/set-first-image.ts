/**
 * Ürün için ilk resmi (önizleme/kapak resmi) ayarlar
 * 
 * Kullanım:
 * npx tsx scripts/set-first-image.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setFirstImage() {
  try {
    console.log('🖼️  Ürün resimlerini düzenleniyor...\n');

    // Tüm ürünleri al
    const products = await prisma.product.findMany({
      include: {
        locales: {
          include: {
            images: true,
          },
        },
      },
    });

    console.log(`📦 Toplam ${products.length} ürün bulundu\n`);

    for (const product of products) {
      for (const locale of product.locales) {
        if (locale.images.length === 0) {
          console.log(`⚠️  ${locale.name} (${locale.locale}): Resim yok, atlanıyor...`);
          continue;
        }

        console.log(`\n🔧 ${locale.name} (${locale.locale}):`);
        console.log(`   Toplam ${locale.images.length} resim`);

        // Resimleri listele
        locale.images.forEach((img, index) => {
          console.log(`   ${index + 1}. ${img.url.split('/').pop()} (order: ${img.order})`);
        });

        // İLK RESMİ SEÇ: order değeri en küçük olan (halihazırda order: asc ile sıralı)
        const firstImage = locale.images[0];
        
        // Eğer ilk resmin order'ı 0 değilse, tüm resimleri yeniden sırala
        if (firstImage.order !== 0) {
          console.log(`   ✨ İlk resim order=${firstImage.order}, yeniden sıralanıyor...`);
          
          // Tüm resimleri order'a göre sırala ve yeniden numaralandır
          for (let i = 0; i < locale.images.length; i++) {
            await prisma.productImage.update({
              where: { id: locale.images[i].id },
              data: { order: i },
            });
          }
          
          console.log(`   ✅ Resimler yeniden sıralandı (0'dan başlayarak)`);
        } else {
          console.log(`   ✅ İlk resim zaten doğru sırada (order=0)`);
        }

        console.log(`   📸 Önizleme resmi: ${firstImage.url.split('/').pop()}`);
      }
    }

    console.log('\n✅ Tamamlandı!\n');
    console.log('💡 İpucu: Farklı bir resmi ilk sıra yapmak için:');
    console.log('   1. Prisma Studio\'yu aç: npm run db:studio');
    console.log('   2. ProductImage tablosuna git');
    console.log('   3. İstediğin resmin "order" değerini 0 yap');
    console.log('   4. Diğer resimlerin order\'larını 1, 2, 3... şeklinde güncelle\n');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setFirstImage();
