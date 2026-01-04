import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/utils/slug';

// POST /api/admin/generate-slugs - Tüm ürünler için slug'ları otomatik oluştur
export async function POST() {
  try {
    console.log('Starting slug generation...');

    const productLocales = await prisma.productLocale.findMany({
      select: {
        id: true,
        locale: true,
        name: true,
        slug: true,
        productId: true
      }
    });

    let updatedCount = 0;
    const updates = [];

    for (const productLocale of productLocales) {
      const needsUpdate = !productLocale.slug || 
                          productLocale.slug === productLocale.name ||
                          productLocale.slug.includes(' ');

      if (needsUpdate && productLocale.name) {
        const newSlug = generateSlug(productLocale.name, productLocale.locale);
        
        const existing = await prisma.productLocale.findUnique({
          where: {
            locale_slug: {
              locale: productLocale.locale,
              slug: newSlug
            }
          }
        });

        let finalSlug = newSlug;
        
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

        updates.push({
          locale: productLocale.locale,
          name: productLocale.name,
          oldSlug: productLocale.slug,
          newSlug: finalSlug
        });
        
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} slug güncellendi`,
      updated: updatedCount,
      total: productLocales.length,
      updates
    });

  } catch (error) {
    console.error('Slug generation error:', error);
    return NextResponse.json(
      { error: 'Slug oluşturma hatası' },
      { status: 500 }
    );
  }
}
