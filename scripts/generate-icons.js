/**
 * Görselleri oluşturmak için script
 * 
 * Kullanım:
 * 1. npm install sharp (veya yarn add sharp)
 * 2. node scripts/generate-icons.js
 * 
 * Bu script, JizaynLogo.svg'yi kullanarak gerekli PNG dosyalarını oluşturur.
 */

const fs = require('fs');
const path = require('path');

// Sharp kütüphanesi yüklü mü kontrol et
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Sharp kütüphanesi bulunamadı!');
  console.log('\n📦 Kurulum için:');
  console.log('   npm install sharp');
  console.log('   veya');
  console.log('   yarn add sharp');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'JizaynLogo.svg');

// Logo dosyası var mı kontrol et
if (!fs.existsSync(logoPath)) {
  console.error('❌ JizaynLogo.svg bulunamadı!');
  process.exit(1);
}

// Oluşturulacak görseller
const icons = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

// OG Image için daha büyük bir görsel
const ogImage = {
  name: 'og-image.png',
  width: 1200,
  height: 630,
};

async function generateIcons() {
  console.log('🎨 Görseller oluşturuluyor...\n');

  try {
    // Manifest icon'ları oluştur
    for (const icon of icons) {
      await sharp(logoPath)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(path.join(publicDir, icon.name));
      
      console.log(`✅ ${icon.name} oluşturuldu (${icon.size}x${icon.size})`);
    }

    // OG Image oluştur (arka plan + logo)
    const ogImageBuffer = await sharp({
      create: {
        width: ogImage.width,
        height: ogImage.height,
        channels: 4,
        background: { r: 67, g: 56, b: 202, alpha: 1 } // indigo-700
      }
    })
      .composite([
        {
          input: logoPath,
          top: Math.floor((ogImage.height - 400) / 2),
          left: Math.floor((ogImage.width - 400) / 2),
        }
      ])
      .png()
      .toFile(path.join(publicDir, ogImage.name));

    console.log(`✅ ${ogImage.name} oluşturuldu (${ogImage.width}x${ogImage.height})`);
    
    console.log('\n✨ Tüm görseller başarıyla oluşturuldu!');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

generateIcons();

