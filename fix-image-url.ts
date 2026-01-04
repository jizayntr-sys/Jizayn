import { prisma } from './lib/prisma';

async function main() {
  // Tüm resimleri listele
  const images = await prisma.productImage.findMany({
    include: {
      ProductLocale: {
        include: {
          Product: true
        }
      }
    }
  });

  console.log('Mevcut resimler:');
  images.forEach(img => {
    console.log(`- ${img.url} (Order: ${img.order}, Alt: ${img.alt})`);
  });

  // Eğer eski URL varsa güncelle
  const oldUrl = '/images/products/El yapımı Kumiko masa lambası - Maun ve çam ahşap geleneksel Japon tasarım.WEBP';
  const newUrl = '/images/products/ElyapimiKumikomasalambasi.webp';

  const imageToUpdate = images.find(img => img.url.includes('Kumiko') || img.url.includes('yapımı'));
  
  if (imageToUpdate) {
    console.log(`\nGüncelleniyor: ${imageToUpdate.url} -> ${newUrl}`);
    
    await prisma.productImage.update({
      where: { id: imageToUpdate.id },
      data: { url: newUrl }
    });
    
    console.log('✅ Resim URL güncellendi!');
  } else {
    console.log('\nGüncellenecek resim bulunamadı.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
