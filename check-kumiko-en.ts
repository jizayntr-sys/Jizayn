import prisma from './lib/prisma';

async function checkKumikoEn() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        locales: {
          some: {
            locale: 'tr',
            slug: 'el-yapimi-kumiko-ahsap-masa-lambasi'
          }
        }
      },
      include: {
        locales: {
          where: {
            locale: 'en'
          }
        }
      }
    });

    if (!product) {
      console.log('Kumiko ürünü bulunamadı');
      return;
    }

    console.log('Product ID:', product.id);
    console.log('\nEN Locale:');
    if (product.locales.length > 0) {
      const enLocale = product.locales[0];
      console.log('Name:', enLocale.name);
      console.log('Slug:', enLocale.slug);
      console.log('Meta Description:', enLocale.metaDescription?.substring(0, 100));
      console.log('\nDescription (first 200 chars):');
      console.log(enLocale.description?.substring(0, 200));
    } else {
      console.log('EN locale bulunamadı!');
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkKumikoEn();
