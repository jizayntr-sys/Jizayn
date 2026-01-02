import { prisma } from './lib/prisma';

async function checkImages() {
  const images = await prisma.productImage.findMany({
    take: 10,
    select: {
      id: true,
      url: true,
    },
  });

  console.log('Sample image URLs:');
  images.forEach(img => {
    console.log(`ID: ${img.id}, URL: ${img.url}`);
  });

  await prisma.$disconnect();
}

checkImages();
