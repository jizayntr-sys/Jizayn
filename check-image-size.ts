import sharp from 'sharp';

async function checkImage() {
  const imagePath = 'public/images/products/Kumiko/KumikoModelA (3).webp';
  
  try {
    const metadata = await sharp(imagePath).metadata();
    console.log('Resim Bilgileri:');
    console.log('Genişlik:', metadata.width);
    console.log('Yükseklik:', metadata.height);
    console.log('Format:', metadata.format);
    console.log('Boyut (KB):', (await sharp(imagePath).toBuffer()).length / 1024);
  } catch (error) {
    console.error('Hata:', error);
  }
}

checkImage();
