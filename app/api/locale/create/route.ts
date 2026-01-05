/**
 * Lazy Locale Creation API
 * Bir ürün için eksik olan locale'leri talep üzerine oluşturur
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateText } from '@/lib/translate';
import { generateSlug } from '@/utils/slug';

// Desteklenen tüm diller
const SUPPORTED_LOCALES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'ar', 'ja', 'zh'];

// Varsayılan diller (her zaman oluşturulur)
const DEFAULT_LOCALES = ['tr', 'en'];

/**
 * GET /api/locale/create?productId=xxx&locale=de
 * Belirtilen ürün için belirtilen locale'i oluşturur
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const targetLocale = searchParams.get('locale');

    if (!productId || !targetLocale) {
      return NextResponse.json({
        error: 'productId ve locale parametreleri gerekli'
      }, { status: 400 });
    }

    if (!SUPPORTED_LOCALES.includes(targetLocale)) {
      return NextResponse.json({
        error: `Desteklenmeyen dil: ${targetLocale}`
      }, { status: 400 });
    }

    // Bu locale zaten var mı kontrol et
    const existingLocale = await prisma.productLocale.findFirst({
      where: {
        productId,
        locale: targetLocale
      }
    });

    if (existingLocale) {
      return NextResponse.json({
        message: 'Locale zaten mevcut',
        locale: existingLocale,
        alreadyExists: true
      }, { status: 200 });
    }

    // TR veya EN locale'den kaynak al (öncelik sırasına göre)
    const sourceLocale = await prisma.productLocale.findFirst({
      where: {
        productId,
        locale: { in: ['en', 'tr'] }
      },
      include: {
        ProductImage: { orderBy: { order: 'asc' } }
      },
      orderBy: {
        // EN varsa önce onu al, yoksa TR
        locale: 'asc'
      }
    });

    if (!sourceLocale) {
      return NextResponse.json({
        error: 'Kaynak locale bulunamadı (TR veya EN olmalı)'
      }, { status: 404 });
    }

    console.log(`${targetLocale} locale oluşturuluyor (kaynak: ${sourceLocale.locale})...`);

    // İçerikleri çevir
    const name = await translateText({
      text: sourceLocale.name,
      from: sourceLocale.locale,
      to: targetLocale
    });

    const description = await translateText({
      text: sourceLocale.description,
      from: sourceLocale.locale,
      to: targetLocale
    });

    const dimensions = await translateText({
      text: sourceLocale.dimensions,
      from: sourceLocale.locale,
      to: targetLocale
    });

    const materials = await translateText({
      text: sourceLocale.materials,
      from: sourceLocale.locale,
      to: targetLocale
    });

    const metaTitle = await translateText({
      text: sourceLocale.metaTitle,
      from: sourceLocale.locale,
      to: targetLocale
    });

    const metaDescription = await translateText({
      text: sourceLocale.metaDescription,
      from: sourceLocale.locale,
      to: targetLocale
    });

    // Slug oluştur
    const slug = generateSlug(name, targetLocale);

    // Yeni locale oluştur
    const newLocale = await prisma.productLocale.create({
      data: {
        id: crypto.randomUUID(),
        productId,
        locale: targetLocale,
        slug,
        name,
        description,
        dimensions,
        materials,
        specifications: [],
        sku: sourceLocale.sku,
        gtin: sourceLocale.gtin,
        availability: sourceLocale.availability,
        priceMin: sourceLocale.priceMin,
        priceMax: sourceLocale.priceMax,
        priceCurrency: sourceLocale.priceCurrency,
        amazonUrl: sourceLocale.amazonUrl,
        etsyUrl: sourceLocale.etsyUrl,
        video: sourceLocale.video,
        metaTitle,
        metaDescription,
        metaKeywords: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Görselleri kopyala (alt text'leri çevirerek)
    const imagePromises = sourceLocale.ProductImage.map(async (image) => {
      const alt = await translateText({
        text: image.alt,
        from: sourceLocale.locale,
        to: targetLocale
      });

      const pinterestDescription = image.pinterestDescription
        ? await translateText({
            text: image.pinterestDescription,
            from: sourceLocale.locale,
            to: targetLocale
          })
        : null;

      return prisma.productImage.create({
        data: {
          id: crypto.randomUUID(),
          productLocaleId: newLocale.id,
          url: image.url,
          alt,
          pinterestDescription,
          order: image.order
        }
      });
    });

    await Promise.all(imagePromises);

    console.log(`✅ ${targetLocale} locale oluşturuldu: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `${targetLocale.toUpperCase()} locale başarıyla oluşturuldu`,
      locale: newLocale,
      slug,
      imageCount: sourceLocale.ProductImage.length
    }, { status: 201 });

  } catch (error) {
    console.error('Locale oluşturma hatası:', error);
    return NextResponse.json({
      error: 'Locale oluşturulurken hata',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

/**
 * POST /api/locale/create
 * Tüm ürünler için eksik locale'leri toplu oluşturur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale } = body;

    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({
        error: 'Geçerli bir locale belirtilmeli'
      }, { status: 400 });
    }

    // Tüm ürünleri al
    const products = await prisma.product.findMany({
      include: {
        locales: {
          select: { locale: true }
        }
      }
    });

    const results = {
      total: products.length,
      created: 0,
      alreadyExists: 0,
      errors: [] as string[]
    };

    for (const product of products) {
      // Bu ürünün bu locale'i var mı?
      const hasLocale = product.locales.some(l => l.locale === locale);
      
      if (hasLocale) {
        results.alreadyExists++;
        continue;
      }

      try {
        // Lazy creation API'sini çağır
        const response = await fetch(
          `${request.nextUrl.origin}/api/locale/create?productId=${product.id}&locale=${locale}`
        );
        
        if (response.ok) {
          results.created++;
        } else {
          results.errors.push(`${product.id}: ${response.statusText}`);
        }
      } catch (error) {
        results.errors.push(`${product.id}: ${error instanceof Error ? error.message : 'Hata'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${locale.toUpperCase()} için toplu locale oluşturma tamamlandı`,
      results
    }, { status: 200 });

  } catch (error) {
    console.error('Toplu locale oluşturma hatası:', error);
    return NextResponse.json({
      error: 'Toplu oluşturma sırasında hata',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
