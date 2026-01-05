/**
 * Kumiko EN locale'in slug'ını düzelt
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/utils/slug';

export async function POST() {
  try {
    console.log('Kumiko EN locale slug düzeltiliyor...');

    // EN locale'i bul
    const enLocale = await prisma.productLocale.findFirst({
      where: {
        locale: 'en',
        Product: {
          locales: {
            some: {
              locale: 'tr',
              slug: 'el-yapimi-kumiko-ahsap-masa-lambasi'
            }
          }
        }
      }
    });

    if (!enLocale) {
      return NextResponse.json({ error: 'EN locale bulunamadı!' }, { status: 404 });
    }

    console.log(`Mevcut slug: ${enLocale.slug}`);
    console.log(`İsim: ${enLocale.name}`);

    // Yeni slug oluştur - İngilizce isimden
    const newSlug = generateSlug(enLocale.name, 'en');
    console.log(`Yeni slug: ${newSlug}`);

    // Slug'ı güncelle
    await prisma.productLocale.update({
      where: { id: enLocale.id },
      data: { slug: newSlug }
    });

    console.log('✅ Slug güncellendi!');

    return NextResponse.json({
      success: true,
      message: 'Slug başarıyla güncellendi',
      oldSlug: enLocale.slug,
      newSlug: newSlug,
      url: `/en/products/${newSlug}`
    }, { status: 200 });

  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ 
      error: 'Slug güncellenirken hata',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
