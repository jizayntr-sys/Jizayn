require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('Fetching Turkish products...\n');
    
    const products = await prisma.productLocale.findMany({
      where: { locale: 'tr' },
      select: {
        id: true,
        name: true,
        slug: true,
        productId: true
      },
      orderBy: { name: 'asc' }
    });

    console.log('Total Turkish products:', products.length);
    console.log('\nAll products:');
    products.forEach((p, i) => {
      console.log(`${i + 1}. Name: "${p.name}"`);
      console.log(`   Slug: "${p.slug}"`);
      console.log(`   ID: ${p.id}\n`);
    });

    // Robot içeren ürünleri ara
    const robotProducts = products.filter(p => 
      p.name.toLowerCase().includes('robot')
    );
    
    if (robotProducts.length > 0) {
      console.log('\n=== Robot products found ===');
      robotProducts.forEach(p => {
        console.log(`Name: "${p.name}"`);
        console.log(`Slug: "${p.slug}"`);
        console.log(`Correct URL should be: /tr/urunler/${p.slug}\n`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
