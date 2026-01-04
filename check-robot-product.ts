import { prisma } from './lib/prisma.js';

async function checkProduct() {
  try {
    console.log('Searching for Robot products...');
    
    const products = await prisma.productLocale.findMany({
      where: {
        name: {
          contains: 'Robot'
        }
      },
      select: {
        id: true,
        locale: true,
        name: true,
        slug: true,
        productId: true
      }
    });

    console.log('Found products:', JSON.stringify(products, null, 2));

    // Tüm slugları listele
    console.log('\nAll product slugs:');
    const allSlugs = await prisma.productLocale.findMany({
      where: { locale: 'tr' },
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    });
    
    console.log(JSON.stringify(allSlugs, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();
