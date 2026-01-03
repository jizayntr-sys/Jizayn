import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function autoCropImages() {
  const productDir = join(process.cwd(), 'public', 'images', 'products', 'Kumiko');
  
  try {
    const files = await readdir(productDir);
    const imageFiles = files.filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'));
    
    console.log(`${imageFiles.length} resim bulundu. İşleniyor...`);
    
    for (const file of imageFiles) {
      const inputPath = join(productDir, file);
      const outputPath = join(productDir, file);
      
      console.log(`İşleniyor: ${file}`);
      
      // Resmi oku ve beyaz kenarları otomatik kırp
      await sharp(inputPath)
        .trim({
          background: 'white',
          threshold: 10 // Beyaza yakın renkleri de kırp
        })
        .resize(600, 600, {
          fit: 'contain', // Kırpılan resmi 600x600'e sığdır
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Şeffaf arka plan
        })
        .webp({ quality: 90 })
        .toFile(outputPath.replace(/\.(jpg|png|webp)$/, '_cropped.webp'));
      
      console.log(`✓ ${file} işlendi`);
    }
    
    console.log('\n✅ Tüm resimler başarıyla işlendi!');
    console.log('Yeni dosyalar: *_cropped.webp olarak kaydedildi.');
    console.log('İnceleyip sorun yoksa eski dosyaları silebilirsiniz.');
    
  } catch (error) {
    console.error('Hata:', error);
  }
}

autoCropImages();
