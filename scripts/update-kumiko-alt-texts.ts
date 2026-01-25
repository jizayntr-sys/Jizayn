/**
 * Kumiko Masa Lambası ürünü için Alt Text Optimizasyonu
 * SEO-friendly, açıklayıcı ve benzersiz alt text'ler
 */

import { prisma } from '../lib/prisma';

async function updateKumikoAltTexts() {
  console.log('🔍 Kumiko ürünü aranıyor...');

  // Kumiko ürününü bul
  const kumikoProduct = await prisma.productLocale.findFirst({
    where: {
      slug: 'el-yapimi-kumiko-ahsap-masa-lambasi',
      locale: 'tr',
    },
    include: {
      ProductImage: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!kumikoProduct) {
    console.log('❌ Kumiko ürünü bulunamadı!');
    return;
  }

  console.log(`✅ Ürün bulundu: ${kumikoProduct.name}`);
  console.log(`📸 ${kumikoProduct.ProductImage.length} adet resim var\n`);

  // Her resim için optimize edilmiş alt text tanımlamaları
  const optimizedAltTexts: Record<string, string> = {
    'ElyapimiKumikomasalambasi.webp': 'El Yapımı Kumiko Ahşap Masa Lambası - Geleneksel Japon Kumiko Tekniği ile İşlenmiş Geometrik Desenli Dekoratif Aydınlatma',
    'Gelenekselgeometrikahsap.webp': 'Kumiko Masa Lambası - Geleneksel Geometrik Ahşap İşçiliği Detay Görünümü, Doğal Ahşap Dokusu',
    'Kumiko.webp': 'Kumiko Tekniği Ahşap Masa Lambası - Yatak Odası ve Oturma Odası için Modern Tasarım Gece Lambası',
    'Kumikoabajur.webp': 'Kumiko Abajur Masa Lambası - El Yapımı Ahşap Geometrik Desen, Çalışma Masası Aydınlatması',
    'Kumikogecelambasi.webp': 'Kumiko Gece Lambası - Sıcak Işıklı Ahşap Masa Lambası, Yatak Odası Dekoratif Aydınlatma Ürünü',
  };

  // Resimleri güncelle
  let updatedCount = 0;

  for (const image of kumikoProduct.ProductImage) {
    const filename = image.url.split('/').pop() || '';
    const newAltText = optimizedAltTexts[filename];

    if (newAltText && image.alt !== newAltText) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: { alt: newAltText },
      });

      console.log(`✅ Güncellendi: ${filename}`);
      console.log(`   Eski: ${image.alt || '(boş)'}`);
      console.log(`   Yeni: ${newAltText}\n`);
      updatedCount++;
    } else if (!newAltText) {
      console.log(`⚠️  Eşleşme bulunamadı: ${filename}`);
    } else {
      console.log(`✓ Zaten güncel: ${filename}\n`);
    }
  }

  console.log(`\n🎉 Tamamlandı! ${updatedCount} resim güncellendi.`);

  // İngilizce versiyonu da güncelle
  console.log('\n🌍 İngilizce versiyonu kontrol ediliyor...');

  const kumikoProductEn = await prisma.productLocale.findFirst({
    where: {
      slug: {
        contains: 'kumiko',
      },
      locale: 'en',
    },
    include: {
      ProductImage: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (kumikoProductEn && kumikoProductEn.ProductImage.length > 0) {
    const optimizedAltTextsEn: Record<string, string> = {
      'ElyapimiKumikomasalambasi.webp': 'Handmade Kumiko Wooden Table Lamp - Traditional Japanese Kumiko Technique with Geometric Pattern Decorative Lighting',
      'Gelenekselgeometrikahsap.webp': 'Kumiko Table Lamp - Traditional Geometric Wooden Craftsmanship Detail View, Natural Wood Texture',
      'Kumiko.webp': 'Kumiko Technique Wooden Table Lamp - Modern Design Night Lamp for Bedroom and Living Room',
      'Kumikoabajur.webp': 'Kumiko Table Lamp Shade - Handmade Wooden Geometric Pattern, Desk Lighting',
      'Kumikogecelambasi.webp': 'Kumiko Night Lamp - Warm Light Wooden Table Lamp, Bedroom Decorative Lighting Product',
    };

    let updatedCountEn = 0;

    for (const image of kumikoProductEn.ProductImage) {
      const filename = image.url.split('/').pop() || '';
      const newAltText = optimizedAltTextsEn[filename];

      if (newAltText && image.alt !== newAltText) {
        await prisma.productImage.update({
          where: { id: image.id },
          data: { alt: newAltText },
        });

        console.log(`✅ Updated (EN): ${filename}`);
        console.log(`   Old: ${image.alt || '(empty)'}`);
        console.log(`   New: ${newAltText}\n`);
        updatedCountEn++;
      }
    }

    console.log(`\n🎉 English version completed! ${updatedCountEn} images updated.`);
  } else {
    console.log('ℹ️  İngilizce versiyonu bulunamadı veya resim yok.');
  }
}

updateKumikoAltTexts()
  .catch((error) => {
    console.error('❌ Hata oluştu:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
