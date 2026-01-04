import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRobotSlugs() {
  try {
    console.log('Checking robot product slugs...\n');
    
    // TR slug'ından ürünü bul
    const trProduct = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'tr',
          slug: 'el-yapimi-ahsap-robot-masa-duzenleyici'
        }
      },
      include: {
        product: {
          include: {
            locales: {
              select: {
                locale: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (trProduct) {
      console.log('Product found!');
      console.log('Product ID:', trProduct.productId);
      console.log('\nAll locales for this product:');
      trProduct.product.locales.forEach(loc => {
        console.log(`  ${loc.locale.toUpperCase()}: "${loc.name}"`);
        console.log(`       Slug: ${loc.slug}\n`);
      });
    } else {
      console.log('Product not found with TR slug: el-yapimi-ahsap-robot-masa-duzenleyici');
      
      // Robot içeren tüm ürünleri listele
      console.log('\nSearching for products containing "robot"...');
      const products = await prisma.productLocale.findMany({
        where: {
          name: {
            contains: 'Robot',
            mode: 'insensitive'
          }
        },
        select: {
          locale: true,
          name: true,
          slug: true,
          productId: true
        }
      });
      
      console.log(`Found ${products.length} products:`);
      products.forEach(p => {
        console.log(`\n${p.locale.toUpperCase()}: "${p.name}"`);
        console.log(`Slug: ${p.slug}`);
        console.log(`Product ID: ${p.productId}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRobotSlugs();
