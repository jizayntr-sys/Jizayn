/**
 * Kumiko ürünü için İngilizce locale oluşturma API endpoint'i
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateText } from '@/lib/translate';
import { generateSlug } from '@/utils/slug';

export async function POST() {
  try {
    console.log('Kumiko ürünü için İngilizce locale oluşturuluyor...');

    // Kumiko TR locale'i bul
    const trLocale = await prisma.productLocale.findFirst({
      where: {
        slug: 'el-yapimi-kumiko-ahsap-masa-lambasi',
        locale: 'tr'
      },
      include: {
        product: true,
        images: { orderBy: { order: 'asc' } }
      }
    });

    if (!trLocale) {
      return NextResponse.json({ error: 'Kumiko TR locale bulunamadı!' }, { status: 404 });
    }

    console.log(`✓ TR locale bulundu: ${trLocale.name}`);

    // EN locale var mı kontrol et
    const existingEn = await prisma.productLocale.findFirst({
      where: {
        productId: trLocale.productId,
        locale: 'en'
      }
    });

    if (existingEn) {
      return NextResponse.json({ 
        message: 'EN locale zaten mevcut!',
        slug: existingEn.slug 
      }, { status: 200 });
    }

    // Türkçe içeriği İngilizceye çevir
    console.log('Çeviri yapılıyor...');
    const nameEn = await translateText({ text: trLocale.name, from: 'tr', to: 'en' });
    const descriptionEn = await translateText({ text: trLocale.description, from: 'tr', to: 'en' });
    const dimensionsEn = await translateText({ text: trLocale.dimensions, from: 'tr', to: 'en' });
    const materialsEn = await translateText({ text: trLocale.materials, from: 'tr', to: 'en' });
    const metaTitleEn = await translateText({ text: trLocale.metaTitle, from: 'tr', to: 'en' });
    const metaDescriptionEn = await translateText({ text: trLocale.metaDescription, from: 'tr', to: 'en' });

    console.log(`✓ İsim çevrildi: ${nameEn}`);

    // Slug oluştur
    const slugEn = generateSlug(nameEn, 'en');
    console.log(`✓ Slug oluşturuldu: ${slugEn}`);

    // EN locale oluştur
    const enLocale = await prisma.productLocale.create({
      data: {
        productId: trLocale.productId,
        locale: 'en',
        slug: slugEn,
        name: nameEn,
        description: descriptionEn,
        dimensions: dimensionsEn,
        materials: materialsEn,
        specifications: [],
        sku: trLocale.sku,
        gtin: trLocale.gtin,
        availability: trLocale.availability,
        priceMin: trLocale.priceMin,
        priceMax: trLocale.priceMax,
        priceCurrency: 'USD',
        amazonUrl: trLocale.amazonUrl,
        etsyUrl: trLocale.etsyUrl,
        video: trLocale.video,
        metaTitle: metaTitleEn,
        metaDescription: metaDescriptionEn,
        metaKeywords: [],
      }
    });

    console.log(`✓ EN locale oluşturuldu: ${enLocale.id}`);

    // TR'deki resimleri EN locale'e kopyala (alt text'leri çevirerek)
    console.log('Resimler kopyalanıyor...');
    const imagePromises = trLocale.images.map(async (image) => {
      const altEn = await translateText({ text: image.alt, from: 'tr', to: 'en' });
      const pinterestEn = image.pinterestDescription
        ? await translateText({ text: image.pinterestDescription, from: 'tr', to: 'en' })
        : null;

      return prisma.productImage.create({
        data: {
          productLocaleId: enLocale.id,
          url: image.url,
          alt: altEn,
          pinterestDescription: pinterestEn,
          order: image.order
        }
      });
    });

    await Promise.all(imagePromises);

    console.log(`✓ ${trLocale.images.length} resim kopyalandı`);

    return NextResponse.json({
      success: true,
      message: 'Kumiko ürünü artık İngilizce olarak erişilebilir',
      slugs: {
        tr: trLocale.slug,
        en: slugEn
      },
      urls: {
        tr: `/tr/urunler/${trLocale.slug}`,
        en: `/en/products/${slugEn}`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ 
      error: 'İngilizce locale oluşturulurken hata',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
