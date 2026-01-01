import { products } from '../data/products';

console.log('🔍 Ürün görselleri ve alt etiketleri kontrol ediliyor...\n');

let missingAltCount = 0;
let totalImages = 0;

products.forEach((product) => {
  if (!product.locales) return;

  // Her dil için kontrol et
  Object.entries(product.locales).forEach(([locale, data]) => {
    if (!data || !data.images) return;

    data.images.forEach((image, index) => {
      totalImages++;
      
      // Alt etiketi yoksa veya boşsa veya sadece boşluktan oluşuyorsa
      if (!image.alt || image.alt.trim().length === 0) {
        missingAltCount++;
        console.error(`❌ EKSİK ALT ETİKETİ:`);
        console.error(`   Ürün ID: ${product.id}`);
        console.error(`   Dil: ${locale}`);
        console.error(`   Görsel Sırası: ${index + 1}`);
        console.error(`   Görsel URL: ${image.url}\n`);
      }
    });
  });
});

console.log('--------------------------------------------------');
console.log(`📊 Toplam Görsel: ${totalImages}`);
if (missingAltCount === 0) {
  console.log('✅ Harika! Tüm görsellerin alt etiketleri dolu.');
} else {
  console.log(`⚠️  Toplam ${missingAltCount} görselde alt etiketi eksik.`);
  process.exit(1);
}