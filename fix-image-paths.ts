import { prisma } from './lib/prisma';

async function fixImagePaths() {
  // Tüm görselleri al
  const images = await prisma.productImage.findMany();
  
  console.log(`Total images found: ${images.length}`);
  
  let fixed = 0;
  
  for (const image of images) {
    // Eğer backslash içeriyorsa düzelt
    if (image.url.includes('\\')) {
      const fixedUrl = image.url.replace(/\\/g, '/');
      
      // URL başında / yoksa ekle
      const finalUrl = fixedUrl.startsWith('/') ? fixedUrl : '/' + fixedUrl;
      
      await prisma.productImage.update({
        where: { id: image.id },
        data: { url: finalUrl },
      });
      
      console.log(`Fixed: ${image.url} -> ${finalUrl}`);
      fixed++;
    }
  }
  
  console.log(`\nFixed ${fixed} image paths`);
  
  await prisma.$disconnect();
}

fixImagePaths();
