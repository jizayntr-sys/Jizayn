import sitemap from '../app/sitemap';

async function validateSitemap() {
  console.log('🗺️  Sitemap konfigürasyonu kontrol ediliyor...\n');

  try {
    // Sitemap fonksiyonunu çalıştır
    const entries = await sitemap();

    if (!Array.isArray(entries)) {
      console.error('❌ HATA: Sitemap bir dizi (array) döndürmedi.');
      process.exit(1);
    }

    console.log(`📊 Toplam URL Sayısı: ${entries.length}`);

    let errorCount = 0;
    const urls = new Set<string>();

    entries.forEach((entry, index) => {
      // 1. URL Kontrolü
      if (!entry.url) {
        console.error(`❌ HATA (Sıra ${index + 1}): URL alanı boş.`);
        errorCount++;
      } else if (!entry.url.startsWith('http')) {
        console.error(`❌ HATA: Geçersiz URL formatı: ${entry.url}`);
        errorCount++;
      }

      // 2. Tekrar Eden URL Kontrolü
      if (urls.has(entry.url)) {
        console.warn(`⚠️  UYARI: Tekrar eden URL bulundu: ${entry.url}`);
      }
      urls.add(entry.url);

      // 3. LastModified Kontrolü
      if (!entry.lastModified) {
        console.warn(`⚠️  UYARI: Tarih bilgisi eksik: ${entry.url}`);
      }
    });

    console.log('--------------------------------------------------');
    if (errorCount === 0) {
      console.log('✅ Sitemap yapısı geçerli görünüyor.');
      console.log(`ℹ️  Örnek URL: ${entries[0]?.url}`);
    } else {
      console.error(`❌ Toplam ${errorCount} kritik hata bulundu.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Beklenmeyen bir hata oluştu:', error);
    process.exit(1);
  }
}

validateSitemap();