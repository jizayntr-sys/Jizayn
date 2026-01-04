import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../utils/slug';

const prisma = new PrismaClient();

async function generateAllSlugs() {
  try {
    console.log('Starting slug generation for all products...\n');

    // Tüm productLocale kayıtlarını getir
    const productLocales = await prisma.productLocale.findMany({
      select: {
        id: true,
        locale: true,
        name: true,
        slug: true,
        productId: true
      }
    });

    console.log(`Found ${productLocales.length} product locales\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const productLocale of productLocales) {
      // Eğer slug boş veya name ile aynı ise (yanlış girilmiş demektir)
      const needsUpdate = !productLocale.slug || 
                          productLocale.slug === productLocale.name ||
                          productLocale.slug.includes(' ');

      if (needsUpdate && productLocale.name) {
        const newSlug = generateSlug(productLocale.name, productLocale.locale);
        
        // Aynı locale'de bu slug kullanılıyor mu kontrol et
        const existing = await prisma.productLocale.findUnique({
          where: {
            locale_slug: {
              locale: productLocale.locale,
              slug: newSlug
            }
          }
        });

        let finalSlug = newSlug;
        
        // Eğer başka bir ürün bu slug'ı kullanıyorsa, sonuna sayı ekle
        if (existing && existing.id !== productLocale.id) {
          let counter = 1;
          let uniqueSlug = `${newSlug}-${counter}`;
          
          while (await prisma.productLocale.findUnique({
            where: {
              locale_slug: {
                locale: productLocale.locale,
                slug: uniqueSlug
              }
            }
          })) {
            counter++;
            uniqueSlug = `${newSlug}-${counter}`;
          }
          
          finalSlug = uniqueSlug;
        }

        await prisma.productLocale.update({
          where: { id: productLocale.id },
          data: { slug: finalSlug }
        });

        console.log(`✓ Updated ${productLocale.locale.toUpperCase()}: "${productLocale.name}"`);
        console.log(`  Old: "${productLocale.slug}" → New: "${finalSlug}"\n`);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Total: ${productLocales.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateAllSlugs();
