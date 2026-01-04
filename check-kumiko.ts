import { prisma } from './lib/prisma';

async function checkKumiko() {
  const locales = await prisma.productLocale.findMany({
    where: {
      slug: 'el-yapimi-kumiko-ahsap-masa-lambasi'
    },
    include: {
      product: {
        include: {
          locales: {
            select: {
              locale: true,
              slug: true,
              name: true
            }
          }
        }
      }
    }
  });

  console.log('Kumiko Ürün Bilgileri:');
  console.log('======================');
  console.log(JSON.stringify(locales, null, 2));

  if (locales.length > 0) {
    console.log('\n\nTüm Dil Versiyonları:');
    console.log('=====================');
    locales[0].product.locales.forEach((locale: any) => {
      console.log(`${locale.locale}: ${locale.slug} - ${locale.name}`);
    });
  }
  
  await prisma.$disconnect();
}

checkKumiko().catch(console.error);
