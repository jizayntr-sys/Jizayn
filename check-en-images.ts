import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnglishImages() {
  const enLocale = await prisma.productLocale.findUnique({
    where: {
      locale_slug: {
        locale: 'en',
        slug: 'handmade-wooden-robot-desk-organizer'
      }
    },
    select: {
      locale: true,
      slug: true,
      name: true,
      images: {
        select: { url: true, alt: true, order: true }
      }
    }
  });

  console.log('Robot Ürünü EN Locale:');
  console.log(JSON.stringify(enLocale, null, 2));

  // TR locale'i de kontrol et
  const trLocale = await prisma.productLocale.findUnique({
    where: {
      locale_slug: {
        locale: 'tr',
        slug: 'el-yapimi-ahsap-robot-masa-duzenleyici'
      }
    },
    select: {
      locale: true,
      slug: true,
      name: true,
      images: {
        select: { url: true, alt: true, order: true }
      }
    }
  });

  console.log('\nRobot Ürünü TR Locale:');
  console.log(JSON.stringify(trLocale, null, 2));

  await prisma.$disconnect();
}

checkEnglishImages();
